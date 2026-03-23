# Alsirius Auth Framework 🚀

A comprehensive, reusable authentication and user management framework for Node.js applications.

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based auth with refresh tokens
- 👥 **User Management** - Complete user lifecycle management
- 📧 **Invitation System** - Personalized user invitations with registration codes
- 🎭 **Role-Based Access** - Flexible permission system
- 📧 **Email Integration** - Multiple email providers with beautiful templates
- 🗄️ **Database Agnostic** - SQLite, PostgreSQL, MySQL support
- 🔧 **Easy Setup** - CLI tools and project templates
- 📱 **Frontend Ready** - React components and client SDK

## 🚀 Quick Start

### Installation

```bash
npm install @alsirius/auth-framework
```

### Basic Usage

```typescript
import { AlsiriusAuth } from '@alsirius/auth-framework';
import express from 'express';

const app = express();

// Initialize auth framework
const auth = new AlsiriusAuth({
  database: {
    type: 'sqlite',
    path: './data/auth.db'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d'
  },
  email: {
    provider: 'smtp',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
});

// Add auth routes
app.use('/api/auth', auth.routes);
app.use('/api/users', auth.userRoutes);
app.use('/api/admin', auth.adminRoutes);

app.listen(3000, () => {
  console.log('🚀 Server running with Alsirius Auth Framework');
});
```

## 📦 Packages

- `@alsirius/auth-core` - Core authentication logic
- `@alsirius/auth-express` - Express.js integration
- `@alsirius/auth-react` - React components and hooks
- `@alsirius/auth-cli` - Command-line tools

## 🛠️ CLI Tools

```bash
# Install CLI globally
npm install -g @alsirius/auth-cli

# Initialize auth in existing project
alsirius auth init

# Create new project with auth
npx create-alsirius-app my-project --with-auth

# Database migrations
alsirius auth migrate

# Create admin user
alsirius auth create-admin --email admin@example.com

# Send invitation
alsirius auth invite --email user@example.com --firstName John
```

## 📖 Documentation

Full documentation available at: [alsirius.github.io/auth-framework](https://alsirius.github.io/auth-framework)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Attribution

Built with ❤️ by the [Alsirius](https://alsirius.co.uk) team.
