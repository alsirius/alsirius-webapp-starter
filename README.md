# Alsirius WebApp Starter 🚀

A complete, production-ready web application starter kit with authentication, user management, and all essential features built-in. Perfect for quickly spinning up new projects!

## ✨ Features

- 🔐 **Complete Authentication** - JWT with refresh tokens, email verification, password reset
- 👥 **User Management** - Registration, profiles, admin dashboard, role-based access
- 📧 **Invitation System** - Personalized user invitations with registration codes
- 🎭 **Role-Based Access** - User, Manager, Admin roles with permissions
- 📧 **Email Integration** - SMTP setup with beautiful HTML templates
- 🗄️ **Database Ready** - SQLite (dev), PostgreSQL/MySQL (prod) with migrations
- ⚛️ **React Frontend** - Complete UI with forms, routing, and state management
- 🔧 **Developer Tools** - TypeScript, ESLint, Prettier, hot reload
- 📱 **Responsive Design** - Mobile-friendly UI with Tailwind CSS
- 🚀 **Production Ready** - Environment configs, deployment scripts

## 🚀 Quick Start

### Clone and Start

```bash
# Clone the starter
git clone https://github.com/alsirius/alsirius-webapp-starter.git my-new-app

# Navigate to your new app
cd my-new-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your settings

# Start development servers
npm run dev
```

### What You Get

- ✅ **Backend API** running on `http://localhost:3002`
- ✅ **Frontend App** running on `http://localhost:3000`
- ✅ **Database** automatically created and migrated
- ✅ **Email Templates** ready for SMTP configuration
- ✅ **Admin Dashboard** with user management
- ✅ **Authentication Flow** complete with login/register/forgot password

## 📁 Project Structure

```
my-new-app/
├── 📁 backend/              # Node.js/Express API
│   ├── src/
│   │   ├── routes/          # API routes (auth, users, admin)
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── database/        # Database setup and migrations
│   │   ├── services/        # Business logic
│   │   └── email/           # Email templates and sending
│   └── package.json
├── 📁 frontend/             # React/Next.js frontend
│   ├── src/
│   │   ├── app/            # Pages and layouts
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API client and auth
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── 📁 docs/                 # Documentation and guides
├── 📁 scripts/              # Setup and deployment scripts
└── 📋 README.md
```

## 🛠️ Customization Guide

### 1. Branding & Styling
```bash
# Update colors and theme
frontend/src/styles/globals.css
frontend/tailwind.config.js
```

### 2. Database Configuration
```bash
# Update database settings
backend/src/database/config.ts
# Add new migrations
backend/src/database/migrations/
```

### 3. Email Setup
```bash
# Configure SMTP
backend/src/email/config.ts
# Customize templates
backend/src/email/templates/
```

### 4. Add New Features
```bash
# Add API routes
backend/src/routes/
# Add pages
frontend/src/app/
# Add components
frontend/src/components/
```

## 🚀 Deployment

### Development
```bash
npm run dev          # Start both frontend and backend
npm run dev:backend  # Backend only
npm run dev:frontend # Frontend only
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production servers
```

### Docker
```bash
docker-compose up    # Development with Docker
docker-compose up -d # Production with Docker
```

## � Documentation

- [**AI_CONTEXT.md**](./AI_CONTEXT.md) - AI assistant context and project overview
- [**ARCHITECTURE.md**](./ARCHITECTURE.md) - Technical architecture and design decisions
- [**API Documentation**](./docs/api.md) - Backend API reference
- [**Frontend Guide**](./docs/frontend.md) - React components and usage
- [**Deployment Guide**](./docs/deployment.md) - Production deployment

## 🎯 Quick Project Ideas

Perfect for building:
- 🏢 **SaaS Applications** - Multi-tenant with user management
- 📊 **Admin Dashboards** - Data visualization and management
- 🛒 **E-commerce** - User accounts and order management
- 📚 **Learning Platforms** - Student and instructor management
- 💼 **CRM Systems** - Customer and lead management
- 🏥 **Healthcare Apps** - Patient and provider management

## � Technology Stack

### Backend
- **Node.js** + **Express** - API framework
- **TypeScript** - Type safety
- **SQLite/PostgreSQL/MySQL** - Database
- **JWT** - Authentication
- **Nodemailer** - Email sending
- **Bcrypt** - Password hashing

### Frontend
- **React** + **Next.js** - Framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **React Router** - Navigation

### Development
- **ESLint** + **Prettier** - Code quality
- **Jest** - Testing
- **Docker** - Containerization
- **GitHub Actions** - CI/CD

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Attribution

Built with ❤️ by the [Alsirius](https://alsirius.co.uk) team.

---

🚀 **Ready to build your next web application? Clone this starter and start coding!**
