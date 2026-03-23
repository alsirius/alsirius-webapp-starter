import { EmailConfig } from '../types/config';
export declare class EmailManager {
    private config;
    private transporter;
    constructor(config: EmailConfig);
    initialize(): Promise<void>;
    sendInvitationEmail(email: string, firstName: string, inviteCode: string, inviterName: string): Promise<void>;
    sendVerificationEmail(email: string, verificationCode: string): Promise<void>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<void>;
    private generateInvitationTemplate;
    private generateVerificationTemplate;
    private generatePasswordResetTemplate;
}
//# sourceMappingURL=EmailManager.d.ts.map