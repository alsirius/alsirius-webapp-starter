import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthenticatedRequest, UserRole } from '../types/auth';

/**
 * JWT Authentication Middleware
 * Provides token-based authentication for Express applications
 */
export class JwtMiddleware {
  private static instance: JwtMiddleware;
  private jwtSecret: string;

  private constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'default-secret-key';
    if (!this.jwtSecret) {
      console.warn('JWT_SECRET not set, using default secret key');
    }
  }

  public static getInstance(): JwtMiddleware {
    if (!JwtMiddleware.instance) {
      JwtMiddleware.instance = new JwtMiddleware();
    }
    return JwtMiddleware.instance;
  }

  /**
   * Extract token from Authorization header or cookie
   */
  private extractToken(req: Request): string | null {
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
  private isValidTokenPayload(payload: any): payload is JwtPayload {
    return (
      payload &&
      typeof payload === 'object' &&
      typeof payload.userId === 'string' &&
      typeof payload.email === 'string' &&
      typeof payload.role === 'string' &&
      Array.isArray(payload.permissions) &&
      typeof payload.iat === 'number' &&
      typeof payload.exp === 'number'
    );
  }

  /**
   * Generate JWT access token
   */
  public generateToken(user: {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
  }): string {
    return jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        iat: Math.floor(Date.now() / 1000),
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  /**
   * Generate refresh token
   */
  public generateRefreshToken(userId: string): string {
    return jwt.sign(
      { userId, type: 'refresh' },
      this.jwtSecret,
      { expiresIn: '30d' }
    );
  }

  /**
   * Verify refresh token
   */
  public verifyRefreshToken(token: string): any {
    return jwt.verify(token, this.jwtSecret);
  }

  /**
   * Authentication middleware
   * Verifies JWT token and sets req.user
   */
  public authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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

      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;
      
      if (!this.isValidTokenPayload(decoded)) {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid token payload' 
        });
        return;
      }

      req.user = decoded;
      next();
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          success: false, 
          error: 'Invalid token' 
        });
        return;
      } else if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ 
          success: false, 
          error: 'Token expired' 
        });
        return;
      } else if (error instanceof jwt.NotBeforeError) {
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
  public requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || req.user.role !== UserRole.ADMIN) {
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
  public requireRole = (requiredRole: UserRole) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({ 
          success: false, 
          error: 'Authentication required' 
        });
        return;
      }

      const roleHierarchy = {
        [UserRole.USER]: 0,
        [UserRole.MANAGER]: 1,
        [UserRole.ADMIN]: 2
      };

      const userRoleLevel = roleHierarchy[req.user.role as UserRole];
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
  public requirePermission = (permission: string) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
}

// Export singleton instance and convenience functions
const jwtMiddleware = JwtMiddleware.getInstance();

export const tokenAuth = jwtMiddleware.authenticate;
export const adminAuth = jwtMiddleware.requireAdmin;
export const requireRole = jwtMiddleware.requireRole;
export const requirePermission = jwtMiddleware.requirePermission;
