export interface AuthConfig {
    database?: {
        type: 'sqlite' | 'postgresql' | 'mysql';
        path?: string;
        host?: string;
        port?: number;
        database?: string;
        username?: string;
        password?: string;
    };
    jwt?: {
        secret: string;
        expiresIn?: string;
        refreshExpiresIn?: string;
    };
    email?: {
        provider: 'smtp' | 'sendgrid' | 'ses';
        host?: string;
        port?: number;
        secure?: boolean;
        auth?: {
            user: string;
            pass: string;
        };
        from?: string;
        fromName?: string;
    };
    features?: {
        emailVerification?: boolean;
        passwordReset?: boolean;
        invitations?: boolean;
        socialLogin?: boolean;
        multiFactor?: boolean;
    };
}
export interface DatabaseConfig {
    type: 'sqlite' | 'postgresql' | 'mysql';
    path?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean;
    connectionLimit?: number;
    acquireTimeout?: number;
    timeout?: number;
}
export interface JwtConfig {
    secret: string;
    expiresIn?: string;
    refreshExpiresIn?: string;
    algorithm?: 'HS256' | 'HS384' | 'HS512' | 'RS256' | 'RS384' | 'RS512';
    issuer?: string;
    audience?: string;
}
export interface EmailConfig {
    provider: 'smtp' | 'sendgrid' | 'ses';
    host?: string;
    port?: number;
    secure?: boolean;
    auth?: {
        user: string;
        pass: string;
    };
    from?: string;
    fromName?: string;
    replyTo?: string;
    templates?: {
        welcome?: string;
        invitation?: string;
        passwordReset?: string;
        emailVerification?: string;
    };
}
export interface FeatureConfig {
    emailVerification?: boolean;
    passwordReset?: boolean;
    invitations?: boolean;
    socialLogin?: boolean;
    multiFactor?: boolean;
    auditLogging?: boolean;
    rateLimiting?: boolean;
    sessionManagement?: boolean;
}
export interface LoggingConfig {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'text';
    file?: string;
    console?: boolean;
    audit?: boolean;
}
export interface SecurityConfig {
    passwordPolicy: {
        minLength?: number;
        requireUppercase?: boolean;
        requireLowercase?: boolean;
        requireNumbers?: boolean;
        requireSpecialChars?: boolean;
        maxAge?: number;
    };
    sessionTimeout?: number;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
    allowedOrigins?: string[];
    rateLimiting?: {
        windowMs?: number;
        maxRequests?: number;
    };
}
//# sourceMappingURL=config.d.ts.map