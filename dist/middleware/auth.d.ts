import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types/auth';
/**
 * JWT Authentication Middleware
 * Provides token-based authentication for Express applications
 */
export declare class JwtMiddleware {
    private static instance;
    private jwtSecret;
    private constructor();
    static getInstance(): JwtMiddleware;
    /**
     * Extract token from Authorization header or cookie
     */
    private extractToken;
    /**
     * Validate JWT token payload
     */
    private isValidTokenPayload;
    /**
     * Generate JWT access token
     */
    generateToken(user: {
        userId: string;
        email: string;
        role: string;
        permissions: string[];
    }): string;
    /**
     * Generate refresh token
     */
    generateRefreshToken(userId: string): string;
    /**
     * Verify refresh token
     */
    verifyRefreshToken(token: string): any;
    /**
     * Authentication middleware
     * Verifies JWT token and sets req.user
     */
    authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    /**
     * Admin-only middleware
     * Requires authentication and admin role
     */
    requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    /**
     * Role-based middleware
     * Requires specific role or higher
     */
    requireRole: (requiredRole: UserRole) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
    /**
     * Permission-based middleware
     * Requires specific permission
     */
    requirePermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
}
export declare const tokenAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const adminAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (requiredRole: UserRole) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requirePermission: (permission: string) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map