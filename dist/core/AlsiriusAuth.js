"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlsiriusAuth = void 0;
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const DatabaseManager_1 = require("../database/DatabaseManager");
const UserManager_1 = require("./UserManager");
const InvitationManager_1 = require("./InvitationManager");
const EmailManager_1 = require("./EmailManager");
/**
 * Main Alsirius Auth Framework class
 * Provides complete authentication and user management system
 */
class AlsiriusAuth {
    constructor(config) {
        this.config = config;
        // Initialize JWT middleware
        this.jwtMiddleware = auth_1.JwtMiddleware.getInstance();
        // Initialize database
        this.databaseManager = new DatabaseManager_1.DatabaseManager(config.database || { type: 'sqlite', path: './auth.db' });
        // Initialize managers
        this.userManager = new UserManager_1.UserManager(this.databaseManager, this.jwtMiddleware);
        this.invitationManager = new InvitationManager_1.InvitationManager(this.databaseManager, this.jwtMiddleware);
        this.emailManager = config.email ? new EmailManager_1.EmailManager(config.email) : null;
    }
    /**
     * Initialize the framework
     */
    async initialize() {
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
    get routes() {
        const router = (0, express_1.Router)();
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
    get userRoutes() {
        const router = (0, express_1.Router)();
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
    get adminRoutes() {
        const router = (0, express_1.Router)();
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
    get users() {
        return this.userManager;
    }
    /**
     * Get invitation manager
     */
    get invitations() {
        return this.invitationManager;
    }
    /**
     * Get email manager
     */
    get emails() {
        return this.emailManager;
    }
    /**
     * Create static instance with config
     */
    static create(config) {
        return new AlsiriusAuth(config);
    }
    /**
     * Get framework version
     */
    static get version() {
        return '1.0.0';
    }
}
exports.AlsiriusAuth = AlsiriusAuth;
//# sourceMappingURL=AlsiriusAuth.js.map