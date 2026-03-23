import { Request, Response } from 'express';
import { DatabaseManager } from '../database/DatabaseManager';
import { JwtMiddleware } from '../middleware/auth';
import { User } from '../types/user';
import { AuthenticatedRequest } from '../types/auth';
export declare class UserManager {
    private db;
    private jwtMiddleware;
    constructor(db: DatabaseManager, jwtMiddleware: JwtMiddleware);
    initialize(): Promise<void>;
    private createDefaultAdmin;
    register(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    refreshToken(req: Request, res: Response): Promise<void>;
    getProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateProfile(req: AuthenticatedRequest, res: Response): Promise<void>;
    getAllUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
    getUserById(userId: string): Promise<User | null>;
    verifyEmail(req: Request, res: Response): Promise<void>;
    resendVerification(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetPassword(req: Request, res: Response): Promise<void>;
    changePassword(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteAccount(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateUser(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteUser(req: AuthenticatedRequest, res: Response): Promise<void>;
    processUserApproval(req: AuthenticatedRequest, res: Response): Promise<void>;
    getPendingUsers(req: AuthenticatedRequest, res: Response): Promise<void>;
    validateToken(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserManager.d.ts.map