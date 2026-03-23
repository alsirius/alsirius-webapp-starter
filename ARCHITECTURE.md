# Architecture - Alsirius WebApp Starter

## Overview

The Alsirius WebApp Starter follows a modern, scalable architecture designed for rapid development and easy maintenance. It implements a clean separation between frontend and backend with comprehensive authentication and user management systems.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React/Next)  │◄──►│  (Node/Express) │◄──►│ (SQLite/PG/MySQL)│
│                 │    │                 │    │                 │
│ - UI Components │    │ - REST API      │    │ - User Data     │
│ - State Mgmt    │    │ - JWT Auth      │    │ - Sessions      │
│ - Routing       │    │ - Business Logic│    │ - Migrations    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Email Service │
                    │   (SMTP/Nodemailer)│
                    │                 │
                    │ - Templates     │
                    │ - Notifications │
                    │ - Verification  │
                    └─────────────────┘
```

## Frontend Architecture

### Technology Stack
- **React 18** with Next.js 13+ (App Router)
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Query** for server state
- **React Hook Form** for form management
- **Zustand** for client state management

### Directory Structure
```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes group
│   │   ├── login/
│   │   ├── register/
│   │   └── forgot-password/
│   ├── (dashboard)/       # Protected routes group
│   │   ├── dashboard/
│   │   ├── profile/
│   │   └── admin/
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/             # Reusable components
│   ├── ui/                # Base UI components
│   ├── forms/             # Form components
│   └── layout/            # Layout components
├── hooks/                 # Custom hooks
│   ├── useAuth.tsx        # Authentication hook
│   └── useApi.tsx         # API hook
├── services/              # External services
│   ├── apiClient.ts       # HTTP client
│   └── authService.ts     # Auth service
├── types/                 # TypeScript definitions
│   └── index.ts
├── utils/                 # Utility functions
└── styles/                # Global styles
```

### Component Architecture

#### Authentication Flow
1. **AuthProvider** wraps the entire app
2. **useAuth** hook provides auth state and actions
3. **ProtectedRoute** component guards authenticated routes
4. **RoleBasedAccess** component for permission-based rendering

#### State Management
- **Zustand** for global client state (user preferences, UI state)
- **React Query** for server state (API data, caching)
- **Local State** for component-specific state

#### Form Handling
- **React Hook Form** for form validation and submission
- **Zod** for schema validation
- **Tailwind** for styling and responsive design

## Backend Architecture

### Technology Stack
- **Node.js** with Express.js
- **TypeScript** for type safety
- **SQLite** (development) / PostgreSQL (production)
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Nodemailer** for email services
- **Winston** for logging

### Directory Structure
```
backend/src/
├── routes/                 # API routes
│   ├── auth.ts           # Authentication endpoints
│   ├── users.ts          # User management
│   ├── admin.ts          # Admin endpoints
│   └── invitations.ts     # Invitation system
├── middleware/            # Express middleware
│   ├── auth.ts           # JWT authentication
│   ├── validation.ts      # Request validation
│   ├── errorHandler.ts   # Error handling
│   └── rateLimit.ts      # Rate limiting
├── services/              # Business logic
│   ├── UserService.ts    # User operations
│   ├── AuthService.ts    # Authentication logic
│   ├── EmailService.ts   # Email operations
│   └── InvitationService.ts # Invitations
├── database/              # Database layer
│   ├── DatabaseManager.ts # DB connection
│   ├── migrations/        # Schema migrations
│   ├── models/           # Data models
│   └── seeds/            # Seed data
├── email/                 # Email system
│   ├── templates/        # HTML templates
│   ├── config.ts         # SMTP configuration
│   └── EmailManager.ts   # Email sending
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── config/                # Configuration
```

### API Architecture

#### Route Organization
```
/api/
├── auth/                  # Public auth endpoints
│   ├── POST /login
│   ├── POST /register
│   ├── POST /logout
│   ├── POST /refresh
│   ├── POST /forgot-password
│   └── POST /reset-password
├── users/                 # Protected user endpoints
│   ├── GET /profile
│   ├── PUT /profile
│   └── GET /me
├── admin/                 # Admin-only endpoints
│   ├── GET /users
│   ├── POST /users
│   ├── PUT /users/:id
│   └── DELETE /users/:id
└── invitations/           # Invitation endpoints
    ├── GET / (admin)
    ├── POST / (admin)
    └── POST /register-with-invite
```

#### Middleware Stack
1. **CORS** - Cross-origin requests
2. **Request Logging** - API request logging
3. **Rate Limiting** - Prevent abuse
4. **Body Parser** - JSON parsing
5. **Authentication** - JWT validation (protected routes)
6. **Authorization** - Role-based access (admin routes)
7. **Validation** - Request validation
8. **Error Handling** - Centralized error handling

#### Service Layer Pattern
- **Controllers** handle HTTP requests/responses
- **Services** contain business logic
- **Repositories** handle data access
- **Models** define data structures

## Database Architecture

### Schema Design
```sql
users
├── id (PK)
├── email (unique)
├── password_hash
├── first_name
├── last_name
├── role (enum: user, manager, admin)
├── permissions (JSON)
├── email_verified (boolean)
├── is_active (boolean)
├── created_at
├── updated_at
└── last_login_at

registration_codes
├── id (PK)
├── code (unique)
├── email
├── max_uses
├── used_count
├── expires_at
├── created_by (FK users.id)
├── created_at
└── is_active

user_sessions
├── id (PK)
├── user_id (FK users.id)
├── refresh_token
├── expires_at
├── created_at
└── last_used_at

email_verifications
├── id (PK)
├── user_id (FK users.id)
├── token
├── expires_at
├── created_at
└── verified_at
```

### Migration Strategy
- **Version-controlled migrations** with timestamps
- **Rollback support** for each migration
- **Seed data** for development environment
- **Environment-specific** database configurations

## Authentication Architecture

### JWT Token Flow
```
Login Request
    ↓
Validate Credentials
    ↓
Generate Access Token (15 min)
Generate Refresh Token (30 days)
    ↓
Store Refresh Token in DB
    ↓
Return Both Tokens to Client
    ↓
Client Stores Tokens (localStorage/httpOnly)
```

### Token Management
- **Access Token**: Short-lived (15 minutes) for API requests
- **Refresh Token**: Long-lived (30 days) for token renewal
- **Automatic Refresh**: Client-side token refresh logic
- **Secure Storage**: HttpOnly cookies for refresh tokens

### Role-Based Access Control (RBAC)
```typescript
interface User {
  role: 'user' | 'manager' | 'admin';
  permissions: string[];
}

// Permission examples:
const permissions = {
  'user': ['read:own_profile', 'update:own_profile'],
  'manager': ['read:team_members', 'invite:users'],
  'admin': ['read:all_users', 'delete:users', 'system:config']
};
```

## Email Architecture

### Email Service Design
```
Email Request
    ↓
Queue Email (Redis/DB)
    ↓
Background Worker
    ↓
Render Template
    ↓
Send via SMTP
    ↓
Log Result
```

### Template System
- **Handlebars** for dynamic content
- **Responsive HTML templates**
- **Text fallback versions**
- **Template inheritance** for consistent styling

### Email Types
- **Welcome emails** - New user registration
- **Email verification** - Account verification
- **Password reset** - Secure password recovery
- **Invitation emails** - User onboarding
- **System notifications** - Account changes

## Security Architecture

### Authentication Security
- **Password hashing** with bcrypt (salt rounds: 12)
- **JWT secrets** from environment variables
- **Token expiration** with automatic refresh
- **Secure headers** (helmet.js)
- **Rate limiting** on auth endpoints

### Data Security
- **Input validation** with Zod schemas
- **SQL injection prevention** with parameterized queries
- **XSS prevention** with content security policy
- **CSRF protection** with same-site cookies

### API Security
- **CORS configuration** for allowed origins
- **Request validation** for all endpoints
- **Error sanitization** - no stack traces in production
- **Audit logging** for sensitive operations

## Performance Architecture

### Frontend Optimizations
- **Code splitting** with Next.js dynamic imports
- **Image optimization** with Next.js Image component
- **Bundle analysis** with webpack bundle analyzer
- **Caching strategy** with React Query
- **Lazy loading** for heavy components

### Backend Optimizations
- **Database connection pooling**
- **Query optimization** with proper indexes
- **Response caching** for static data
- **Compression** with gzip middleware
- **API rate limiting** to prevent abuse

### Monitoring and Logging
- **Structured logging** with Winston
- **Request tracing** with correlation IDs
- **Performance metrics** collection
- **Error tracking** integration ready
- **Health check endpoints**

## Deployment Architecture

### Development Environment
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:3002)
├── Database (SQLite)
└── Email Service (Mailtrap)
```

### Production Environment
```
Cloud Infrastructure
├── Frontend (Vercel/Netlify)
├── Backend (Railway/Heroku/AWS)
├── Database (PostgreSQL)
├── Email Service (SendGrid/SES)
├── File Storage (AWS S3)
└── Monitoring (Sentry/DataDog)
```

### Container Architecture
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
# Build frontend and backend

FROM node:18-alpine AS runtime
# Production runtime
```

### CI/CD Pipeline
```
Git Push
    ↓
GitHub Actions
    ↓
Run Tests
    ↓
Build Applications
    ↓
Deploy to Staging
    ↓
Run E2E Tests
    ↓
Deploy to Production
```

## Scalability Considerations

### Horizontal Scaling
- **Stateless backend** - ready for load balancing
- **Database read replicas** for read-heavy workloads
- **CDN integration** for static assets
- **Microservice ready** architecture

### Vertical Scaling
- **Database optimization** with proper indexing
- **Memory management** for large datasets
- **CPU optimization** for intensive operations
- **Storage scaling** with cloud providers

## Future Architecture Plans

### Microservices Migration
- **Authentication Service** - Separate auth microservice
- **User Service** - User management service
- **Notification Service** - Email and push notifications
- **File Service** - File upload and storage

### Advanced Features
- **GraphQL API** - Alternative to REST
- **WebSocket Support** - Real-time features
- **Event Sourcing** - Audit trail and event replay
- **CQRS Pattern** - Command Query Responsibility Segregation

---

This architecture provides a solid foundation for building scalable, maintainable web applications while keeping development velocity high through the use of modern tools and best practices.
