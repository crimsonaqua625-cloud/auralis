#!/bin/bash

# ============================================
# Auralis Deployment Verification Script
# ============================================
# This script verifies all systems are ready for deployment

echo "🔍 Starting pre-deployment verification..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

check_pass() {
    echo -e "${GREEN}✓${NC} $1"
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# 1. Check Node.js
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Checking Node.js Installation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    check_pass "Node.js installed: $NODE_VERSION"
else
    check_fail "Node.js not found. Install from nodejs.org"
    exit 1
fi

# 2. Check npm
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Checking npm"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    check_pass "npm installed: $NPM_VERSION"
else
    check_fail "npm not found"
    exit 1
fi

# 3. Check Git
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Checking Git"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if command -v git &> /dev/null; then
    GIT_VERSION=$(git -v)
    check_pass "Git installed: $GIT_VERSION"
    
    if git rev-parse --git-dir > /dev/null 2>&1; then
        check_pass "Git repository initialized"
    else
        check_warn "Not in a git repository"
    fi
else
    check_fail "Git not found"
fi

# 4. Check Server structure
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Checking Server Structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "server/package.json" ]; then
    check_pass "server/package.json found"
else
    check_fail "server/package.json not found"
fi

if [ -f "server/src/app.js" ]; then
    check_pass "server/src/app.js found"
else
    check_fail "server/src/app.js not found"
fi

# 5. Check Client structure
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Checking Client Structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "client/package.json" ]; then
    check_pass "client/package.json found"
else
    check_fail "client/package.json not found"
fi

if [ -f "client/src/App.js" ]; then
    check_pass "client/src/App.js found"
else
    check_fail "client/src/App.js not found"
fi

# 6. Check Bot structure
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. Checking Bot Structure"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "bot/index.js" ]; then
    check_pass "bot/index.js found"
else
    check_fail "bot/index.js not found"
fi

# 7. Check .gitignore
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. Checking .gitignore"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".gitignore" ]; then
    check_pass ".gitignore found"
    if grep -q ".env" .gitignore; then
        check_pass ".env files will be ignored"
    else
        check_warn ".env not in .gitignore - add it!"
    fi
else
    check_warn ".gitignore not found - creating..."
fi

# 8. Check environment templates
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. Checking Environment Files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "server/.env.example" ]; then
    check_pass "server/.env.example found"
else
    check_warn "server/.env.example not found"
fi

if [ -f "client/.env.example" ]; then
    check_pass "client/.env.example found"
else
    check_warn "client/.env.example not found"
fi

# 9. Check documentation
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9. Checking Documentation"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "README.md" ]; then
    check_pass "README.md found"
else
    check_warn "README.md not found"
fi

if [ -f "DEPLOYMENT.md" ]; then
    check_pass "DEPLOYMENT.md found"
else
    check_warn "DEPLOYMENT.md not found"
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Pre-Deployment Verification Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo ""
echo "Next steps:"
echo "1. Create .env files from .env.example templates"
echo "2. Configure MongoDB Atlas connection"
echo "3. Test locally: npm start (server + client)"
echo "4. Create GitHub repository"
echo "5. Deploy to Render and Vercel"
echo ""
echo "See DEPLOYMENT.md for detailed instructions."
