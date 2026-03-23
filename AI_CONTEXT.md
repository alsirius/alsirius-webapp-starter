# AI Context - Alsirius WebApp Starter

## Project Overview

**Alsirius WebApp Starter** is a complete, production-ready web application starter kit designed to accelerate development of new projects. It includes authentication, user management, and all essential features built-in.

## Purpose

This starter kit is designed to help developers quickly spin up new web applications without having to rebuild common features like authentication, user management, and basic UI components.

## Key Features

### Authentication System
- JWT-based authentication with refresh tokens
- Email verification and password reset
- Role-based access control (User, Manager, Admin)
- Invitation system for user onboarding

### User Management
- Complete user profiles with custom fields
- Admin dashboard for user management
- Permission system for granular access control
- User status management (active, inactive, suspended)

### Frontend Components
- React/Next.js application with TypeScript
- Pre-built authentication forms (login, register, forgot password)
- Responsive design with Tailwind CSS
- Custom hooks for authentication state management

### Backend API
- Node.js/Express REST API
- Database migrations and schema management
- Email integration with SMTP providers
- Comprehensive error handling and logging

## Technology Stack

### Backend
- **Node.js** + **Express** - API framework
- **TypeScript** - Type safety
- **SQLite/PostgreSQL/MySQL** - Database support
- **JWT** - Authentication tokens
- **Nodemailer** - Email sending
- **Bcrypt** - Password hashing

### Frontend
- **React** + **Next.js** - Frontend framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **React Query** - Server state management
- **React Router** - Client-side routing

## Project Structure

```
alsirius-webapp-starter/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # JWT middleware
│   │   ├── database/       # Database setup
│   │   ├── services/       # Business logic
│   │   └── email/          # Email templates
│   └── package.json
├── frontend/               # React/Next.js frontend
│   ├── src/
│   │   ├── app/           # Pages and layouts
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript types
│   └── package.json
├── docs/                  # Documentation
├── scripts/               # Setup scripts
└── README.md
```

## Development Workflow

### Getting Started
1. Clone the repository
2. Install dependencies (`npm install`)
3. Set up environment variables (`.env`)
4. Run development servers (`npm run dev`)

### Customization Guide
1. **Branding**: Update colors, logos, and styling
2. **Database**: Configure for production database
3. **Email**: Set up SMTP provider
4. **Features**: Add new API routes and frontend pages

### Deployment
1. **Development**: `npm run dev`
2. **Production**: `npm run build && npm run start`
3. **Docker**: `docker-compose up`

## Common Tasks

### Adding New Features
1. Create API route in `backend/src/routes/`
2. Add corresponding frontend page in `frontend/src/app/`
3. Create reusable components in `frontend/src/components/`
4. Update TypeScript types in `frontend/src/types/`

### Database Changes
1. Create migration in `backend/src/database/migrations/`
2. Update database schema
3. Run migrations with `npm run migrate`

### Email Templates
1. Modify templates in `backend/src/email/templates/`
2. Update email configuration in `backend/src/email/config.ts`

## Environment Variables

### Backend (.env)
```
DATABASE_URL=sqlite:./data/app.db
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=My App
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/admin/users` - List all users (admin)
- `POST /api/admin/users` - Create user (admin)

### Invitations
- `POST /api/admin/invitations` - Create invitation
- `GET /api/admin/invitations` - List invitations
- `POST /api/auth/register-with-invite` - Register with invitation

## Frontend Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Forgot password
- `/reset-password` - Reset password

### Protected Routes
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/admin` - Admin dashboard

## Security Considerations

- JWT tokens with expiration and refresh
- Password hashing with bcrypt
- Role-based access control
- Input validation and sanitization
- CORS configuration
- Rate limiting on sensitive endpoints

## Performance Optimizations

- Database connection pooling
- JWT token caching
- Email queue management
- Frontend code splitting
- Image optimization
- Bundle size optimization

## Testing Strategy

- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for user flows
- Database testing with test fixtures
- Email testing with mock services

## Deployment Options

### Development
- Local development with hot reload
- Docker Compose for local environment

### Production
- Vercel (frontend)
- Railway/Heroku (backend)
- AWS EC2 with Docker
- Self-hosted with PM2

## Monitoring and Logging

- Application logging with Winston
- Error tracking with Sentry
- Performance monitoring
- Database query logging
- API request/response logging

## Contributing Guidelines

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and merge

## Support and Documentation

- Comprehensive README with setup instructions
- API documentation
- Frontend component documentation
- Deployment guides
- Troubleshooting guide

## Future Roadmap

- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Mobile app support
- [ ] Advanced security features
- [ ] Performance optimizations
- [ ] Additional integrations (payment, storage, etc.)

---

This context should help AI assistants understand the project structure, purpose, and common development tasks when working with the Alsirius WebApp Starter.
