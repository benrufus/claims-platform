#!/bin/bash

echo "🚀 Claims Platform - Quick Setup Script"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

echo "✅ npm found: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check for .env.local
if [ ! -f .env.local ]; then
    echo "⚠️  No .env.local file found"
    echo "📝 Creating .env.local from template..."
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your API keys before running the server"
    echo ""
    echo "Required keys:"
    echo "  - AUTH0_SECRET (run: openssl rand -hex 32)"
    echo "  - AUTH0_CLIENT_ID"
    echo "  - AUTH0_CLIENT_SECRET"
    echo "  - NEXT_PUBLIC_SUPABASE_URL"
    echo "  - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "  - SUPABASE_SERVICE_ROLE_KEY"
    echo "  - DATA8_API_KEY"
    echo ""
    read -p "Press Enter after you've configured .env.local..."
fi

echo "✅ Environment configured"
echo ""

# Generate Auth0 secret if needed
if command -v openssl &> /dev/null; then
    echo "🔐 Generating AUTH0_SECRET..."
    SECRET=$(openssl rand -hex 32)
    echo "   Add this to your .env.local:"
    echo "   AUTH0_SECRET='$SECRET'"
    echo ""
fi

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase database (see README.md)"
echo "2. Configure Auth0 (see README.md)"
echo "3. Run 'npm run dev' to start the development server"
echo ""
echo "📖 For detailed instructions, see README.md"
