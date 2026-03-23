# Alsirius Auth Framework 🚀

A comprehensive, reusable authentication and user management framework for Node.js and React applications.

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based auth with refresh tokens
- 👥 **User Management** - Complete user lifecycle management
- 📧 **Invitation System** - Personalized user invitations with registration codes
- 🎭 **Role-Based Access** - Flexible permission system
- 📧 **Email Integration** - Multiple email providers with beautiful templates
- 🗄️ **Database Agnostic** - SQLite, PostgreSQL, MySQL support
- ⚛️ **React Components** - Pre-built auth forms and hooks
- 🔧 **Easy Setup** - CLI tools and project templates
- 📱 **Frontend Ready** - React components and client SDK

## 🚀 Quick Start

### Installation

#### Option 1: Git Clone (Recommended)
Clone the framework directly into your project:

```bash
# Clone into your project
git clone https://github.com/alsirius/auth-framework.git ./libs/auth-framework
cd ./libs/auth-framework
npm install
npm run build
```

#### Option 2: Git Submodule (For multi-project workspaces)
```bash
git submodule add https://github.com/alsirius/auth-framework.git libs/auth-framework
git submodule update --init --recursive
cd ./libs/auth-framework
npm install
npm run build
```

#### Option 3: Package.json Git Dependency
Add to your `package.json`:
```json
{
  "dependencies": {
    "alsirius-auth-framework": "git+https://github.com/alsirius/auth-framework.git"
  }
}
```

#### Option 4: Manual Download
Download the ZIP from GitHub and extract to your project directory.

### Basic Usage

#### Backend (Node.js/Express)
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

#### Frontend (React)
```typescript
import { AuthProvider, useAuth } from './libs/auth-framework/packages/react/dist/index.js';

// Wrap your app with AuthProvider
function App() {
  return (
    <AuthProvider baseURL="http://localhost:3000">
      <MyApp />
    </AuthProvider>
  );
}

// Use auth in your components
function LoginForm() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (credentials) => {
    try {
      await login(credentials);
      // User is now logged in
    } catch (err) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Your login form */}
    </form>
  );
}
```

## 📦 Installation Methods

### Why Git-Based Distribution?

| Method | Best For | Pros | Cons |
|--------|----------|------|------|
| **Git Clone** | Most projects | Always get latest code, full control | Manual updates, larger repo size |
| **Git Submodule** | Multi-project workspaces | Shared across projects, version control | Complex setup, learning curve |
| **Git Dependency** | Development, custom builds | Direct source access, flexible | Slower installs, no version locking |
| **Manual Download** | Offline development | No network required after download | Manual updates |

### Benefits of Git-Only Distribution

- ✅ **No NPM account required** for publishing
- ✅ **Private repositories** supported
- ✅ **Always get latest features** and fixes
- ✅ **Full source access** for customization
- ✅ **Fork and modify** for your specific needs
- ✅ **Branch-based development** - use specific features
- ✅ **Offline development** - clone once, use anywhere

## 📚 Documentation

For detailed documentation and examples, visit the GitHub repository:
https://github.com/alsirius/auth-framework

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Attribution

Built with ❤️ by the [Alsirius](https://alsirius.co.uk) team.
