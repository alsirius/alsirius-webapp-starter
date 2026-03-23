export interface Invitation {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
  department?: string;
  message?: string;
  inviteCode: string;
  invitedBy: string;
  invitedByName: string;
  createdAt: string;
  expiresAt: string;
  acceptedAt?: string;
  usedAt?: string;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
}

export interface CreateInvitationRequest {
  email: string;
  firstName: string;
  lastName?: string;
  role: string;
  department?: string;
  message?: string;
  maxUses?: number;
  expiresAt?: string;
}

export interface InvitationQuery {
  page?: number;
  limit?: number;
  status?: 'pending' | 'accepted' | 'expired' | 'revoked';
  role?: string;
  department?: string;
  search?: string;
}

export interface InvitationResponse {
  invitations: Invitation[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RegistrationCode {
  id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  usedBy?: string;
  usedAt?: string;
  usableBy: string;
  maxUses: number;
  usedCount: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface InvitationRegistrationRequest {
  inviteCode: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface EmailVerification {
  id: string;
  email: string;
  verificationCode: string;
  createdAt: string;
  expiresAt: string;
  verified: boolean;
  verifiedAt?: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface ResendVerificationRequest {
  email: string;
}
