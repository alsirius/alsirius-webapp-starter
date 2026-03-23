# Alsirius WebApp Starter Architecture & Design Principles

## Overview
Alsirius WebApp Starter is a complete, production-ready web application template built with a clean separation between frontend and backend, emphasizing security, type safety, and rapid development.

## Core Architecture Principles

### 1. Separation of Concerns
- **Frontend**: Next.js 14 with TypeScript, responsible for UI/UX only
- **Backend**: Express.js with TypeScript, handles business logic and data
- **Database**: SQLite with DAO pattern for data access abstraction
- **Communication**: REST APIs with JWT-based authentication

### 2. Security First
- All API endpoints require JWT authentication (except public endpoints)
- Token payload inspection for forgery detection
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration

### 3. Type Safety
- **TypeScript** throughout the stack
- Shared type definitions between frontend and backend
- Database models with TypeScript interfaces
- API request/response type definitions

### 4. Developer Experience
- Hot reload for rapid development
- Comprehensive documentation
- AI-assisted development context
- Automated testing and linting

## Backend Architecture

### Layer Structure
```
backend/src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic layer
├── dao/            # Data Access Objects
├── models/         # Database models and interfaces
├── middleware/     # Authentication, validation, error handling
├── routes/         # API route definitions
├── utils/          # Helper functions
├── types/          # TypeScript type definitions
├── email/          # Email templates and services
└── config/         # Configuration files
```

### Data Flow
1. **Request** → Middleware (auth, validation) → Controller → Service → DAO → Database
2. **Response** → Database → DAO → Service → Controller → Response

### Authentication Strategy
- JWT tokens with signed payload
- Token contains: userId, role, permissions, timestamp
- Backend inspects token signature and payload for each request
- Refresh token mechanism for extended sessions

### User Management System
- Complete user lifecycle management
- Role-based permissions (User, Manager, Admin)
- Email verification and password reset
- Invitation system for user onboarding

## Frontend Architecture

### Component Structure
```
frontend/src/
├── app/            # Next.js app router
│   ├── (auth)/     # Authentication routes
│   ├── (dashboard)/# Protected routes
│   └── api/        # API routes
├── components/     # Reusable UI components
│   ├── ui/         # Base components
│   ├── forms/      # Form components
│   └── layout/     # Layout components
├── hooks/          # Custom React hooks
├── services/       # API communication layer
├── utils/          # Helper functions
├── types/          # TypeScript definitions
└── store/          # State management
```

### API Communication
- Centralized API service with typed requests/responses
- Automatic token injection in headers
- Error handling and retry logic
- Request/response interceptors

### Authentication Flow
- AuthProvider context wrapper for global auth state
- useAuth hook for authentication operations
- ProtectedRoute components for route guards
- Automatic token refresh on expiration

## Database Design

### DAO Pattern Implementation
- Abstract database operations behind interfaces
- Each entity has its own DAO class
- Transaction support across multiple operations
- Connection pooling and error handling

### Core Schema
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
```

### Example DAO Structure
```typescript
interface UserDAO {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: CreateUserDto): Promise<User>;
  update(id: string, updates: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<boolean>;
}
```

## API Design Principles

### RESTful Conventions
- Resource-based URLs: `/api/users`, `/api/auth`, `/api/invitations`
- HTTP methods: GET, POST, PUT, DELETE
- Consistent response format
- Proper HTTP status codes

### Response Format
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}
```

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - Session termination
- `POST /api/auth/refresh` - Token refresh
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset confirmation

### User Management Endpoints
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/admin/users` - List all users (admin)
- `POST /api/admin/users` - Create user (admin)
- `PUT /api/admin/users/:id` - Update user (admin)
- `DELETE /api/admin/users/:id` - Delete user (admin)

### Invitation Endpoints
- `GET /api/admin/invitations` - List invitations (admin)
- `POST /api/admin/invitations` - Create invitation (admin)
- `DELETE /api/admin/invitations/:id` - Delete invitation (admin)
- `POST /api/auth/register-with-invite` - Register with invitation

## Email System Architecture

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
- Handlebars for dynamic content
- Responsive HTML templates
- Text fallback versions
- Template inheritance for consistent styling

### Email Types
- **Welcome emails** - New user registration
- **Email verification** - Account verification
- **Password reset** - Secure password recovery
- **Invitation emails** - User onboarding
- **System notifications** - Account changes

## Documentation Strategy

### 1. Code Documentation
- JSDoc comments for all public functions
- Type definitions serve as documentation
- README files for each major module

### 2. API Documentation
- OpenAPI/Swagger specification
- Interactive API documentation
- Example requests/responses

### 3. AI Context Management
- Central context file (`AI_CONTEXT.md`) for development guidelines
- Type definitions as single source of truth
- Consistent naming conventions and patterns

## Development Workflow

### 1. AI-Assisted Development
- AI always references `AI_CONTEXT.md` for guidelines
- Type-first development approach
- Automated testing and linting

### 2. Code Quality
- ESLint + Prettier for consistent formatting
- Unit tests for business logic
- Integration tests for API endpoints
- Type checking as first line of defense

### 3. Development Environment
- Hot reload for both frontend and backend
- Environment-based configuration
- Database migrations and seeding
- Email testing with mock services

## Technology Stack Summary

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3 (dev), PostgreSQL/MySQL (prod)
- **Authentication**: JWT with bcrypt
- **Email**: Nodemailer with SMTP
- **Documentation**: OpenAPI/Swagger
- **Testing**: Jest + Supertest

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **Components**: Custom UI components
- **State**: React hooks with Context API
- **HTTP Client**: Native fetch with interceptors
- **Forms**: React Hook Form with Zod validation
- **Testing**: Jest + React Testing Library

### Development Tools
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript compiler
- **Build Tools**: Next.js built-in bundler
- **Environment**: Docker support
- **CI/CD**: GitHub Actions ready

## Security Considerations

### Token Security
- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (30 days)
- Secure token storage (httpOnly cookies)
- Token rotation on refresh

### API Security
- Rate limiting
- Input validation with Zod schemas
- SQL injection prevention
- XSS protection
- CORS configuration
- Request sanitization

### Data Protection
- Password hashing with bcrypt (salt rounds: 12)
- Sensitive data encryption
- Audit logging for security events
- Secure session management

## Performance Considerations

### Backend
- Database connection pooling
- Query optimization with proper indexes
- Response caching for static data
- Pagination for large datasets
- Email queue management

### Frontend
- Code splitting with Next.js dynamic imports
- Lazy loading for heavy components
- Image optimization with Next.js Image
- Bundle size optimization
- Client-side caching strategies

## Deployment Strategy

### Development
- Local development with hot reload
- Docker Compose for consistent environment
- Environment variable configuration
- Database migrations on startup

### Production
- Containerized deployment (Docker)
- Environment-based configuration
- Health checks and monitoring
- Database migrations
- SSL/TLS termination
- CDN integration for static assets

### Scalability
- Horizontal scaling ready (stateless backend)
- Database read replicas support
- Load balancer compatible
- Microservice ready architecture

## Customization Guidelines

### 1. Branding and Theming
- Update Tailwind CSS configuration
- Modify color schemes in CSS variables
- Replace logos and branding assets
- Customize email templates

### 2. Feature Extensions
- Add new API routes following existing patterns
- Create corresponding frontend pages
- Update TypeScript types
- Add database migrations if needed

### 3. Business Logic
- Implement domain-specific services
- Add validation schemas
- Create custom hooks for frontend
- Update documentation

This architecture ensures scalability, maintainability, and security while providing clear guidelines for rapid development and customization.
