export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    permissions: string[];
    status: 'pending' | 'active' | 'inactive' | 'suspended';
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
    lastLoginAt?: string;
    profile?: UserProfile;
    password_hash?: string;
}
export interface UserProfile {
    userId: string;
    avatar?: string;
    phone?: string;
    department?: string;
    title?: string;
    bio?: string;
    preferences: UserPreferences;
}
export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: {
        email: boolean;
        push: boolean;
        marketing: boolean;
    };
}
export interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    department?: string;
}
export interface UpdateUserDto {
    firstName?: string;
    lastName?: string;
    role?: string;
    department?: string;
    status?: string;
    permissions?: string[];
}
export interface UserListQuery {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    department?: string;
    sortBy?: 'createdAt' | 'email' | 'name' | 'lastLogin';
    sortOrder?: 'asc' | 'desc';
}
export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
export interface AuthResponse {
    success: boolean;
    data?: {
        user: any;
        accessToken: string;
        refreshToken: string;
    };
    error?: {
        code: string;
        message: string;
        statusCode: number;
    };
}
export interface VerifyEmailRequest {
    email: string;
    code: string;
}
export interface ResendVerificationRequest {
    email: string;
}
//# sourceMappingURL=user.d.ts.map