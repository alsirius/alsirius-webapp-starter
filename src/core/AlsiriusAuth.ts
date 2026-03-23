import { Router, Request, Response } from 'express';
import { JwtMiddleware } from '../middleware/auth';
import { DatabaseManager } from '../database/DatabaseManager';
import { UserManager } from './UserManager';
import { InvitationManager } from './InvitationManager';
import { EmailManager } from './EmailManager';
import { AuthConfig } from '../types/config';

export interface AlsiriusAuthOptions extends AuthConfig {
  database?: {
    type: 'sqlite' | 'postgresql' | 'mysql';
    path?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
  };
  jwt?: {
    secret: string;
    expiresIn?: string;
    refreshExpiresIn?: string;
  };
  email?: {
    provider: 'smtp' | 'sendgrid' | 'ses';
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
      user: string;
      pass: string;
    };
    from?: string;
    fromName?: string;
  };
  features?: {
    emailVerification?: boolean;
    passwordReset?: boolean;
    invitations?: boolean;
    socialLogin?: boolean;
    multiFactor?: boolean;
  };
}

/**
 * Main Alsirius Auth Framework class
 * Provides complete authentication and user management system
 */
export class AlsiriusAuth {
  private config: AlsiriusAuthOptions;
  private jwtMiddleware: JwtMiddleware;
  private databaseManager: DatabaseManager;
  private userManager: UserManager;
  private invitationManager: InvitationManager;
  private emailManager: EmailManager | null;

  constructor(config: AlsiriusAuthOptions) {
    this.config = config;
    
    // Initialize JWT middleware
    this.jwtMiddleware = JwtMiddleware.getInstance();
    
    // Initialize database
    this.databaseManager = new DatabaseManager(config.database || { type: 'sqlite', path: './auth.db' });
    
    // Initialize managers
    this.userManager = new UserManager(this.databaseManager, this.jwtMiddleware);
    this.invitationManager = new InvitationManager(this.databaseManager, this.jwtMiddleware);
    this.emailManager = config.email ? new EmailManager(config.email) : null;
  }

  /**
   * Initialize the framework
   */
  async initialize(): Promise<void> {
    await this.databaseManager.initialize();
    await this.userManager.initialize();
    await this.invitationManager.initialize();
    if (this.emailManager) {
      await this.emailManager.initialize();
    }
  }

  /**
   * Get authentication routes
   */
  get routes(): Router {
    const router = Router();

    // Authentication routes
    router.post('/register', this.userManager.register.bind(this.userManager));
    router.post('/login', this.userManager.login.bind(this.userManager));
    router.post('/logout', this.userManager.logout.bind(this.userManager));
    router.post('/refresh', this.userManager.refreshToken.bind(this.userManager));
    router.post('/verify-email', this.userManager.verifyEmail.bind(this.userManager));
    router.post('/resend-verification', this.userManager.resendVerification.bind(this.userManager));
    router.post('/forgot-password', this.userManager.forgotPassword.bind(this.userManager));
    router.post('/reset-password', this.userManager.resetPassword.bind(this.userManager));
    router.get('/validate-token', this.userManager.validateToken.bind(this.userManager));

    return router;
  }

  /**
   * Get user management routes (protected)
   */
  get userRoutes(): Router {
    const router = Router();
    
    // Apply authentication to all user routes
    router.use(this.jwtMiddleware.authenticate);

    // User profile routes
    router.get('/profile', this.userManager.getProfile.bind(this.userManager));
    router.put('/profile', this.userManager.updateProfile.bind(this.userManager));
    router.post('/change-password', this.userManager.changePassword.bind(this.userManager));
    router.delete('/account', this.userManager.deleteAccount.bind(this.userManager));

    return router;
  }

  /**
   * Get admin routes (protected + admin role)
   */
  get adminRoutes(): Router {
    const router = Router();
    
    // Apply authentication and admin role to all admin routes
    router.use(this.jwtMiddleware.authenticate);
    router.use(this.jwtMiddleware.requireAdmin);

    // User management routes
    router.get('/users', this.userManager.getAllUsers.bind(this.userManager));
    router.get('/users/:id', this.userManager.getUserById.bind(this.userManager));
    router.put('/users/:id', this.userManager.updateUser.bind(this.userManager));
    router.delete('/users/:id', this.userManager.deleteUser.bind(this.userManager));
    router.post('/users/approve', this.userManager.processUserApproval.bind(this.userManager));
    router.get('/users/pending', this.userManager.getPendingUsers.bind(this.userManager));

    // Invitation routes
    router.get('/registration-codes', this.invitationManager.getRegistrationCodes.bind(this.invitationManager));
    router.post('/registration-codes', this.invitationManager.createRegistrationCode.bind(this.invitationManager));
    router.delete('/registration-codes/:codeId', this.invitationManager.deleteRegistrationCode.bind(this.invitationManager));
    router.post('/users/invite', this.invitationManager.sendInvitation.bind(this.invitationManager));

    return router;
  }

  /**
   * Get middleware functions
   */
  get middleware() {
    return {
      authenticate: this.jwtMiddleware.authenticate,
      requireAdmin: this.jwtMiddleware.requireAdmin,
      requireRole: this.jwtMiddleware.requireRole,
      requirePermission: this.jwtMiddleware.requirePermission
    };
  }

  /**
   * Get user manager
   */
  get users(): UserManager {
    return this.userManager;
  }

  /**
   * Get invitation manager
   */
  get invitations(): InvitationManager {
    return this.invitationManager;
  }

  /**
   * Get email manager
   */
  get emails(): EmailManager | null {
    return this.emailManager;
  }

  /**
   * Create static instance with config
   */
  static create(config: AlsiriusAuthOptions): AlsiriusAuth {
    return new AlsiriusAuth(config);
  }

  /**
   * Get framework version
   */
  static get version(): string {
    return '1.0.0';
  }
}
