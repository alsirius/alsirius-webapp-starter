import { Response } from 'express';
import { DatabaseManager } from '../database/DatabaseManager';
import { JwtMiddleware } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';
export declare class InvitationManager {
    private db;
    private jwtMiddleware;
    constructor(db: DatabaseManager, jwtMiddleware: JwtMiddleware);
    initialize(): Promise<void>;
    createRegistrationCode(req: AuthenticatedRequest, res: Response): Promise<void>;
    getRegistrationCodes(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteRegistrationCode(req: AuthenticatedRequest, res: Response): Promise<void>;
    sendInvitation(req: AuthenticatedRequest, res: Response): Promise<void>;
    private generateInviteCode;
}
//# sourceMappingURL=InvitationManager.d.ts.map