import { Request } from 'express';
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    permissions: string[];
    iat: number;
    exp: number;
    aud?: string;
    iss?: string;
}
export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
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
export interface RefreshTokenRequest {
    refreshToken: string;
}
export declare enum UserRole {
    USER = "user",
    MANAGER = "manager",
    ADMIN = "admin"
}
export declare enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        statusCode?: number;
    };
    message?: string;
}
//# sourceMappingURL=auth.d.ts.map