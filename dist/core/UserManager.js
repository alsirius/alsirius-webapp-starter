"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const auth_1 = require("../types/auth");
class UserManager {
    constructor(db, jwtMiddleware) {
        this.db = db;
        this.jwtMiddleware = jwtMiddleware;
    }
    async initialize() {
        // Initialize default admin user if none exists
        await this.createDefaultAdmin();
    }
    async createDefaultAdmin() {
        const database = this.db.getDatabase();
        const adminExists = database.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get(auth_1.UserRole.ADMIN);
        if (!adminExists) {
            const adminId = (0, uuid_1.v4)();
            const hashedPassword = await bcryptjs_1.default.hash('admin123', 12);
            database.prepare(`
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, role, permissions, status, email_verified
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(adminId, 'admin@siriux.com', hashedPassword, 'Admin', 'User', auth_1.UserRole.ADMIN, JSON.stringify(['admin', 'users', 'invitations', 'system']), 'active', 1);
            console.log('✅ Default admin user created: admin@siriux.com / admin123');
        }
    }
    async register(req, res) {
        try {
            const { email, password, firstName, lastName } = req.body;
            const database = this.db.getDatabase();
            // Check if user already exists
            const existingUser = database.prepare('SELECT id FROM users WHERE email = ?').get(email);
            if (existingUser) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'USER_EXISTS',
                        message: 'User with this email already exists',
                        statusCode: 400
                    }
                });
                return;
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(password, 12);
            const userId = (0, uuid_1.v4)();
            // Create user
            database.prepare(`
        INSERT INTO users (
          id, email, password_hash, first_name, last_name, role, permissions, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(userId, email, hashedPassword, firstName, lastName, auth_1.UserRole.USER, JSON.stringify([]), 'pending');
            // Generate tokens
            const accessToken = this.jwtMiddleware.generateToken({
                userId,
                email,
                role: auth_1.UserRole.USER,
                permissions: []
            });
            const refreshToken = this.jwtMiddleware.generateRefreshToken(userId);
            const user = this.getUserById(userId);
            res.status(201).json({
                success: true,
                data: {
                    user,
                    accessToken,
                    refreshToken
                }
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'REGISTRATION_FAILED',
                    message: 'Registration failed',
                    statusCode: 500
                }
            });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            const database = this.db.getDatabase();
            // Find user
            const user = database.prepare('SELECT * FROM users WHERE email = ? AND deleted = 0').get(email);
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password',
                        statusCode: 401
                    }
                });
                return;
            }
            // Check password
            const isPasswordValid = await bcryptjs_1.default.compare(password, user.password_hash);
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'INVALID_CREDENTIALS',
                        message: 'Invalid email or password',
                        statusCode: 401
                    }
                });
                return;
            }
            // Update last login
            database.prepare('UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);
            // Parse permissions from database string
            const permissions = JSON.parse(user.permissions || '[]');
            // Generate tokens
            const accessToken = this.jwtMiddleware.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
                permissions
            });
            const refreshToken = this.jwtMiddleware.generateRefreshToken(user.id);
            // Remove password from response
            const { password_hash, ...safeUser } = user;
            res.json({
                success: true,
                data: {
                    user: safeUser,
                    accessToken,
                    refreshToken
                }
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'LOGIN_FAILED',
                    message: 'Login failed',
                    statusCode: 500
                }
            });
        }
    }
    async logout(req, res) {
        try {
            // In a real implementation, you'd invalidate the token here
            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'LOGOUT_FAILED',
                    message: 'Logout failed',
                    statusCode: 500
                }
            });
        }
    }
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'MISSING_REFRESH_TOKEN',
                        message: 'Refresh token is required',
                        statusCode: 400
                    }
                });
                return;
            }
            const tokenData = this.jwtMiddleware.verifyRefreshToken(refreshToken);
            const database = this.db.getDatabase();
            const user = database.prepare('SELECT * FROM users WHERE id = ? AND deleted = 0').get(tokenData.userId);
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found',
                        statusCode: 401
                    }
                });
                return;
            }
            // Parse permissions from database string
            const permissions = JSON.parse(user.permissions || '[]');
            // Generate new tokens
            const newAccessToken = this.jwtMiddleware.generateToken({
                userId: user.id,
                email: user.email,
                role: user.role,
                permissions
            });
            const newRefreshToken = this.jwtMiddleware.generateRefreshToken(user.id);
            res.json({
                success: true,
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                }
            });
        }
        catch (error) {
            console.error('Token refresh error:', error);
            res.status(401).json({
                success: false,
                error: {
                    code: 'INVALID_REFRESH_TOKEN',
                    message: 'Invalid refresh token',
                    statusCode: 401
                }
            });
        }
    }
    async getProfile(req, res) {
        try {
            const user = await this.getUserById(req.user.userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'USER_NOT_FOUND',
                        message: 'User not found',
                        statusCode: 404
                    }
                });
                return;
            }
            const { password_hash, ...safeUser } = user;
            res.json({
                success: true,
                data: safeUser
            });
        }
        catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'GET_PROFILE_FAILED',
                    message: 'Failed to get profile',
                    statusCode: 500
                }
            });
        }
    }
    async updateProfile(req, res) {
        try {
            const updates = req.body;
            const database = this.db.getDatabase();
            // Build update query
            const updateFields = [];
            const updateValues = [];
            if (updates.firstName) {
                updateFields.push('first_name = ?');
                updateValues.push(updates.firstName);
            }
            if (updates.lastName) {
                updateFields.push('last_name = ?');
                updateValues.push(updates.lastName);
            }
            if (updates.department) {
                updateFields.push('department = ?');
                updateValues.push(updates.department);
            }
            if (updateFields.length === 0) {
                res.status(400).json({
                    success: false,
                    error: {
                        code: 'NO_UPDATES',
                        message: 'No valid updates provided',
                        statusCode: 400
                    }
                });
                return;
            }
            updateFields.push('updated_at = CURRENT_TIMESTAMP');
            updateValues.push(req.user.userId);
            database.prepare(`
        UPDATE users SET ${updateFields.join(', ')} WHERE id = ?
      `).run(...updateValues);
            const updatedUser = await this.getUserById(req.user.userId);
            const { password_hash, ...safeUser } = updatedUser;
            res.json({
                success: true,
                data: safeUser
            });
        }
        catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'UPDATE_PROFILE_FAILED',
                    message: 'Failed to update profile',
                    statusCode: 500
                }
            });
        }
    }
    async getAllUsers(req, res) {
        try {
            const query = req.query;
            const database = this.db.getDatabase();
            let sql = 'SELECT * FROM users WHERE deleted = 0';
            const params = [];
            // Add filters
            if (query.role) {
                sql += ' AND role = ?';
                params.push(query.role);
            }
            if (query.status) {
                sql += ' AND status = ?';
                params.push(query.status);
            }
            if (query.search) {
                sql += ' AND (email LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
                const searchTerm = `%${query.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }
            // Add sorting
            const sortBy = query.sortBy || 'created_at';
            const sortOrder = query.sortOrder || 'desc';
            sql += ` ORDER BY ${sortBy} ${sortOrder}`;
            // Add pagination
            const limit = Math.min(query.limit || 50, 100);
            const page = query.page || 1;
            const offset = (page - 1) * limit;
            sql += ' LIMIT ? OFFSET ?';
            params.push(limit, offset);
            const users = database.prepare(sql).all(...params);
            // Remove passwords
            const safeUsers = users.map(user => {
                const { password_hash, ...safeUser } = user;
                return safeUser;
            });
            // Get total count
            const countSql = sql.replace(/ORDER BY.*$/, '').replace(/LIMIT.*$/, '');
            const total = database.prepare(countSql.replace('SELECT *', 'SELECT COUNT(*)')).get(...params.slice(0, -2));
            res.json({
                success: true,
                data: {
                    users: safeUsers,
                    total: total.count,
                    page,
                    limit,
                    totalPages: Math.ceil(total.count / limit)
                }
            });
        }
        catch (error) {
            console.error('Get all users error:', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'GET_USERS_FAILED',
                    message: 'Failed to get users',
                    statusCode: 500
                }
            });
        }
    }
    async getUserById(userId) {
        const database = this.db.getDatabase();
        const user = database.prepare('SELECT * FROM users WHERE id = ? AND deleted = 0').get(userId);
        return user || null;
    }
    async verifyEmail(req, res) {
        // Implementation for email verification
        res.json({
            success: true,
            message: 'Email verification endpoint'
        });
    }
    async resendVerification(req, res) {
        // Implementation for resending verification
        res.json({
            success: true,
            message: 'Resend verification endpoint'
        });
    }
    async forgotPassword(req, res) {
        // Implementation for forgot password
        res.json({
            success: true,
            message: 'Forgot password endpoint'
        });
    }
    async resetPassword(req, res) {
        // Implementation for reset password
        res.json({
            success: true,
            message: 'Reset password endpoint'
        });
    }
    async changePassword(req, res) {
        // Implementation for change password
        res.json({
            success: true,
            message: 'Change password endpoint'
        });
    }
    async deleteAccount(req, res) {
        // Implementation for delete account
        res.json({
            success: true,
            message: 'Delete account endpoint'
        });
    }
    async updateUser(req, res) {
        // Implementation for admin updating user
        res.json({
            success: true,
            message: 'Update user endpoint'
        });
    }
    async deleteUser(req, res) {
        // Implementation for admin deleting user
        res.json({
            success: true,
            message: 'Delete user endpoint'
        });
    }
    async processUserApproval(req, res) {
        // Implementation for user approval
        res.json({
            success: true,
            message: 'Process user approval endpoint'
        });
    }
    async getPendingUsers(req, res) {
        // Implementation for getting pending users
        res.json({
            success: true,
            message: 'Get pending users endpoint'
        });
    }
    async validateToken(req, res) {
        // Implementation for token validation
        res.json({
            success: true,
            message: 'Token validation endpoint'
        });
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=UserManager.js.map