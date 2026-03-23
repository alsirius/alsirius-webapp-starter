// Main exports
export { AlsiriusAuth } from './core/AlsiriusAuth';
export { JwtMiddleware } from './middleware/auth';
export { tokenAuth, adminAuth, requireRole, requirePermission } from './middleware/auth';

// Core managers
export { UserManager } from './core/UserManager';
export { InvitationManager } from './core/InvitationManager';
export { EmailManager } from './core/EmailManager';
export { DatabaseManager } from './database/DatabaseManager';

// Types - selective exports to avoid conflicts
export * from './types/auth';
export type { User, UserProfile, UserPreferences, CreateUserDto, UpdateUserDto, UserListQuery, UserListResponse } from './types/user';
export type { Invitation, CreateInvitationRequest, InvitationQuery, InvitationResponse, RegistrationCode, InvitationRegistrationRequest, EmailVerification } from './types/invitation';
export type { AuthConfig, DatabaseConfig, JwtConfig, EmailConfig, FeatureConfig, LoggingConfig, SecurityConfig } from './types/config';

// Version
export const version = '1.0.0';
