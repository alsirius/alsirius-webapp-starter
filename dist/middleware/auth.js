"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requirePermission = exports.requireRole = exports.adminAuth = exports.tokenAuth = exports.JwtMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../types/auth");
/**
 * JWT Authentication Middleware
 * Provides token-based authentication for Express applications
 */
class JwtMiddleware {
    constructor() {
        /**
         * Authentication middleware
         * Verifies JWT token and sets req.user
         */
        this.authenticate = (req, res, next) => {
            try {
                const token = this.extractToken(req);
                if (!token) {
                    res.status(401).json({
                        success: false,
                        error: 'No token provided'
                    });
                    return;
                }
                // Validate token format before verification
                if (typeof token !== 'string' || token.split('.').length !== 3) {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid token format'
                    });
                    return;
                }
                const decoded = jsonwebtoken_1.default.verify(token, this.jwtSecret);
                if (!this.isValidTokenPayload(decoded)) {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid token payload'
                    });
                    return;
                }
                req.user = decoded;
                next();
            }
            catch (error) {
                if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                    res.status(401).json({
                        success: false,
                        error: 'Invalid token'
                    });
                    return;
                }
                else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    res.status(401).json({
                        success: false,
                        error: 'Token expired'
                    });
                    return;
                }
                else if (error instanceof jsonwebtoken_1.default.NotBeforeError) {
                    res.status(401).json({
                        success: false,
                        error: 'Token not active'
                    });
                    return;
                }
                res.status(500).json({
                    success: false,
                    error: 'Authentication failed'
                });
                return;
            }
        };
        /**
         * Admin-only middleware
         * Requires authentication and admin role
         */
        this.requireAdmin = (req, res, next) => {
            if (!req.user || req.user.role !== auth_1.UserRole.ADMIN) {
                res.status(403).json({
                    success: false,
                    error: 'Admin access required'
                });
                return;
            }
            next();
        };
        /**
         * Role-based middleware
         * Requires specific role or higher
         */
        this.requireRole = (requiredRole) => {
            return (req, res, next) => {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        error: 'Authentication required'
                    });
                    return;
                }
                const roleHierarchy = {
                    [auth_1.UserRole.USER]: 0,
                    [auth_1.UserRole.MANAGER]: 1,
                    [auth_1.UserRole.ADMIN]: 2
                };
                const userRoleLevel = roleHierarchy[req.user.role];
                const requiredRoleLevel = roleHierarchy[requiredRole];
                if (userRoleLevel < requiredRoleLevel) {
                    res.status(403).json({
                        success: false,
                        error: `${requiredRole} access required`
                    });
                    return;
                }
                next();
            };
        };
        /**
         * Permission-based middleware
         * Requires specific permission
         */
        this.requirePermission = (permission) => {
            return (req, res, next) => {
                if (!req.user) {
                    res.status(401).json({
                        success: false,
                        error: 'Authentication required'
                    });
                    return;
                }
                if (!req.user.permissions.includes(permission)) {
                    res.status(403).json({
                        success: false,
                        error: `Permission '${permission}' required`
                    });
                    return;
                }
                next();
            };
        };
        this.jwtSecret = process.env.JWT_SECRET;
        if (!this.jwtSecret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
    }
    static getInstance() {
        if (!JwtMiddleware.instance) {
            JwtMiddleware.instance = new JwtMiddleware();
        }
        return JwtMiddleware.instance;
    }
    /**
     * Extract token from Authorization header or cookie
     */
    extractToken(req) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            return authHeader.split(' ')[1];
        }
        // Check for token in cookie
        if (req.cookies && req.cookies.accessToken) {
            return req.cookies.accessToken;
        }
        return null;
    }
    /**
     * Validate JWT token payload
     */
    isValidTokenPayload(payload) {
        return (payload &&
            typeof payload === 'object' &&
            typeof payload.userId === 'string' &&
            typeof payload.email === 'string' &&
            typeof payload.role === 'string' &&
            Array.isArray(payload.permissions) &&
            typeof payload.iat === 'number' &&
            typeof payload.exp === 'number');
    }
    /**
     * Generate JWT access token
     */
    generateToken(user) {
        return jsonwebtoken_1.default.sign({
            userId: user.userId,
            email: user.email,
            role: user.role,
            permissions: user.permissions,
            iat: Math.floor(Date.now() / 1000),
        }, this.jwtSecret, { expiresIn: '7d' });
    }
    /**
     * Generate refresh token
     */
    generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ userId, type: 'refresh' }, this.jwtSecret, { expiresIn: '30d' });
    }
    /**
     * Verify refresh token
     */
    verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.jwtSecret);
    }
}
exports.JwtMiddleware = JwtMiddleware;
// Export singleton instance and convenience functions
const jwtMiddleware = JwtMiddleware.getInstance();
exports.tokenAuth = jwtMiddleware.authenticate;
exports.adminAuth = jwtMiddleware.requireAdmin;
exports.requireRole = jwtMiddleware.requireRole;
exports.requirePermission = jwtMiddleware.requirePermission;
//# sourceMappingURL=auth.js.map