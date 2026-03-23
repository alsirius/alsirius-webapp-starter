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

#### Option 1: NPM (Recommended for public projects)
```bash
npm install alsirius-auth-framework
```

#### Option 2: Direct from Git (For latest features or private use)
```bash
# Clone into your project
git clone https://github.com/alsirius/auth-framework.git ./libs/auth-framework
cd ./libs/auth-framework
npm install
npm run build
```

#### Option 3: Git Submodule (For multi-project setups)
```bash
git submodule add https://github.com/alsirius/auth-framework.git libs/auth-framework
git submodule update --init --recursive
```

#### Option 4: Package.json Git Dependency
```json
{
  "dependencies": {
    "alsirius-auth-framework": "git+https://github.com/alsirius/auth-framework.git"
  }
}
```

### Basic Usage

#### Using Git Clone
```typescript
import { AlsiriusAuth } from './libs/auth-framework/dist/index.js';
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

## 📦 Installation Methods

### When to Use Each Method

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **NPM** | Public projects, production apps | Easy updates, version locking | Requires npm account for publishing |
| **Git Clone** | Latest features, private projects | Always get latest code, full control | Manual updates, larger repo size |
| **Git Submodule** | Multi-project workspaces | Shared across projects, version control | Complex setup, learning curve |
| **Git Dependency** | Development, custom builds | Direct source access, flexible | Slower installs, no version locking |

## 📚 Documentation

For detailed documentation and examples, visit the GitHub repository:
https://github.com/alsirius/auth-framework

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Attribution

Built with ❤️ by the [Alsirius](https://alsirius.co.uk) team.
