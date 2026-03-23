import express from 'express';
import { AlsiriusAuth } from '../src';

const app = express();
app.use(express.json());

// Initialize Alsirius Auth Framework
const auth = AlsiriusAuth.create({
  database: {
    type: 'sqlite',
    path: './data/auth.db'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: '7d'
  },
  email: {
    provider: 'smtp',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || '',
      pass: process.env.EMAIL_PASS || ''
    },
    from: process.env.EMAIL_FROM || 'noreply@yourdomain.com',
    fromName: 'Your App'
  },
  features: {
    emailVerification: true,
    passwordReset: true,
    invitations: true,
    socialLogin: false,
    multiFactor: false
  }
});

// Add authentication routes
app.use('/api/auth', auth.routes);
app.use('/api/users', auth.userRoutes);
app.use('/api/admin', auth.adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await auth.initialize();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔐 Auth endpoints: http://localhost:${PORT}/api/auth`);
      console.log(`👥 User endpoints: http://localhost:${PORT}/api/users`);
      console.log(`👑 Admin endpoints: http://localhost:${PORT}/api/admin`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
