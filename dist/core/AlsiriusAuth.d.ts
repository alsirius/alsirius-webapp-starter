import { Router, Response } from 'express';
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
export declare class AlsiriusAuth {
    private config;
    private jwtMiddleware;
    private databaseManager;
    private userManager;
    private invitationManager;
    private emailManager;
    constructor(config: AlsiriusAuthOptions);
    /**
     * Initialize the framework
     */
    initialize(): Promise<void>;
    /**
     * Get authentication routes
     */
    get routes(): Router;
    /**
     * Get user management routes (protected)
     */
    get userRoutes(): Router;
    /**
     * Get admin routes (protected + admin role)
     */
    get adminRoutes(): Router;
    /**
     * Get middleware functions
     */
    get middleware(): {
        authenticate: (req: import("..").AuthenticatedRequest, res: Response, next: import("express").NextFunction) => void;
        requireAdmin: (req: import("..").AuthenticatedRequest, res: Response, next: import("express").NextFunction) => void;
        requireRole: (requiredRole: import("..").UserRole) => (req: import("..").AuthenticatedRequest, res: Response, next: import("express").NextFunction) => void;
        requirePermission: (permission: string) => (req: import("..").AuthenticatedRequest, res: Response, next: import("express").NextFunction) => void;
    };
    /**
     * Get user manager
     */
    get users(): UserManager;
    /**
     * Get invitation manager
     */
    get invitations(): InvitationManager;
    /**
     * Get email manager
     */
    get emails(): EmailManager | null;
    /**
     * Create static instance with config
     */
    static create(config: AlsiriusAuthOptions): AlsiriusAuth;
    /**
     * Get framework version
     */
    static get version(): string;
}
//# sourceMappingURL=AlsiriusAuth.d.ts.map