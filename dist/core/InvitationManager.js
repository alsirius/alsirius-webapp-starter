"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationManager = void 0;
const uuid_1 = require("uuid");
class InvitationManager {
    constructor(db, jwtMiddleware) {
        this.db = db;
        this.jwtMiddleware = jwtMiddleware;
    }
    async initialize() {
        // Initialize invitation system
    }
    async createRegistrationCode(req, res) {
        try {
            const { code, usableBy, maxUses, expiresAt } = req.body;
            const database = this.db.getDatabase();
            const codeId = (0, uuid_1.v4)();
            const createdBy = req.user.userId;
            database.prepare(`
        INSERT INTO registration_codes (id, code, created_by, usable_by, max_uses, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(codeId, code, createdBy, usableBy || 'anyone', maxUses || 1, expiresAt || null);
            res.status(201).json({
                success: true,
                data: {
                    id: codeId,
                    code,
                    createdBy,
                    usableBy: usableBy || 'anyone',
                    maxUses: maxUses || 1,
                    expiresAt
                }
            });
        }
        catch (error) {
            console.error('Failed to create registration code', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'CREATE_CODE_FAILED',
                    message: 'Failed to create registration code',
                    statusCode: 500
                }
            });
        }
    }
    async getRegistrationCodes(req, res) {
        try {
            const database = this.db.getDatabase();
            const codes = database.prepare(`
        SELECT rc.*, u.email as created_by_email, u.first_name as created_by_name
        FROM registration_codes rc
        LEFT JOIN users u ON rc.created_by = u.id
        ORDER BY rc.created_at DESC
      `).all();
            res.json({
                success: true,
                data: codes
            });
        }
        catch (error) {
            console.error('Failed to get registration codes', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'GET_CODES_FAILED',
                    message: 'Failed to get registration codes',
                    statusCode: 500
                }
            });
        }
    }
    async deleteRegistrationCode(req, res) {
        try {
            const { codeId } = req.params;
            const database = this.db.getDatabase();
            const result = database.prepare('DELETE FROM registration_codes WHERE id = ?').run(codeId);
            if (result.changes === 0) {
                res.status(404).json({
                    success: false,
                    error: {
                        code: 'CODE_NOT_FOUND',
                        message: 'Registration code not found',
                        statusCode: 404
                    }
                });
                return;
            }
            res.json({
                success: true,
                message: 'Registration code deleted successfully'
            });
        }
        catch (error) {
            console.error('Failed to delete registration code', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'DELETE_CODE_FAILED',
                    message: 'Failed to delete registration code',
                    statusCode: 500
                }
            });
        }
    }
    async sendInvitation(req, res) {
        try {
            const { email, firstName, lastName, role, department, message } = req.body;
            const database = this.db.getDatabase();
            const adminId = req.user.userId;
            const admin = database.prepare('SELECT first_name, last_name FROM users WHERE id = ?').get(adminId);
            // Generate unique invitation code
            const inviteCode = this.generateInviteCode();
            const codeId = (0, uuid_1.v4)();
            // Set expiration (default 7 days from now)
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);
            // Create registration code
            database.prepare(`
        INSERT INTO registration_codes (id, code, created_by, usable_by, max_uses, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(codeId, inviteCode, adminId, email, 1, expiresAt.toISOString());
            // TODO: Send invitation email
            res.status(201).json({
                success: true,
                data: {
                    id: codeId,
                    email,
                    firstName,
                    lastName,
                    role,
                    department,
                    message,
                    inviteCode,
                    invitedBy: adminId,
                    invitedByName: `${admin.first_name} ${admin.last_name}`,
                    createdAt: new Date().toISOString(),
                    expiresAt: expiresAt.toISOString(),
                    maxUses: 1,
                    usedCount: 0,
                    isActive: true
                }
            });
        }
        catch (error) {
            console.error('Failed to create registration code', error);
            res.status(500).json({
                success: false,
                error: {
                    code: 'CREATE_CODE_FAILED',
                    message: 'Failed to create registration code',
                    statusCode: 500
                }
            });
        }
    }
    generateInviteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}
exports.InvitationManager = InvitationManager;
//# sourceMappingURL=InvitationManager.js.map