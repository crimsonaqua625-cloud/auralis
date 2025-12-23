#!/bin/bash

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check Node version
NODE_VERSION=$(node -v)
echo "✓ Node version: $NODE_VERSION"

# Check dependencies
echo "✓ Installing server dependencies..."
cd server && npm install

echo "✓ Installing client dependencies..."
cd ../client && npm install

echo "✓ Installing bot dependencies..."
cd ../bot && npm install

echo "✓ Building client..."
cd ../client && npm run build

# Check .env files
echo ""
echo "⚠️  Deployment checklist:"
echo "  [ ] server/.env.production exists"
echo "  [ ] bot/.env.production exists"
echo "  [ ] client/.env exists (or .env.production)"
echo "  [ ] MongoDB Atlas connection string is valid"
echo "  [ ] Telegram Bot token is valid"
echo "  [ ] All .env files added to .gitignore"
echo ""

echo "✅ Pre-deployment checks complete!"
echo "Ready to push to GitHub and deploy!"
