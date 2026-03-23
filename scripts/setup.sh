#!/bin/bash

# Alsirius WebApp Starter Setup Script
# This script sets up a new project from the starter template

echo "🚀 Setting up Alsirius WebApp Starter..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Get project name from user
if [ -z "$PROJECT_NAME" ]; then
    echo "Please enter your project name:"
    read -r PROJECT_NAME
fi

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ Project name is required."
    exit 1
fi

echo "📁 Creating project: $PROJECT_NAME"

# Create project directory
mkdir -p "$PROJECT_NAME"
cd "$PROJECT_NAME" || exit 1

# Clone the starter
echo "📥 Cloning Alsirius WebApp Starter..."
git clone https://github.com/alsirius/alsirius-webapp-starter.git .

# Remove git history to start fresh
echo "🔄 Removing git history..."
rm -rf .git

# Initialize new git repository
echo "🔧 Initializing new git repository..."
git init
git add .
git commit -m "Initial commit: Alsirius WebApp Starter setup"

# Install dependencies
echo "📦 Installing dependencies..."

# Root dependencies
npm install

# Backend dependencies
echo "Installing backend dependencies..."
cd backend || exit 1
npm install
cd ..

# Frontend dependencies
echo "Installing frontend dependencies..."
cd frontend || exit 1
npm install
cd ..

# Set up environment files
echo "⚙️ Setting up environment files..."

# Backend environment
if [ ! -f backend/.env ]; then
    cp .env.example backend/.env
    echo "✅ Created backend/.env - Please update with your configuration"
fi

# Frontend environment
if [ ! -f frontend/.env.local ]; then
    cp .env.example frontend/.env.local
    echo "✅ Created frontend/.env.local - Please update with your configuration"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/data
mkdir -p backend/logs
mkdir -p backend/uploads

# Set up database
echo "🗄️ Setting up database..."
cd backend || exit 1
npm run migrate || echo "⚠️ Migration command not found, database will be created on first run"
cd ..

# Success message
echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Update frontend/.env.local with your configuration"
echo "3. Run 'npm run dev' to start development servers"
echo "4. Visit http://localhost:3000 to see your app"
echo ""
echo "📚 Documentation:"
echo "- README.md - General information"
echo "- AI_CONTEXT.md - AI assistant context"
echo "- ARCHITECTURE.md - Technical architecture"
echo ""
echo "🚀 Happy coding!"
