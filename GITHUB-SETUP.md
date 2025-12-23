# 📦 GitHub Setup Guide

Complete guide to push Project Auralis to GitHub for deployment.

## Prerequisites

- GitHub account ([github.com](https://github.com) - create free account if needed)
- Git installed (`git --version` to verify)
- All code files ready

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in details:
   - **Repository name:** `auralis` (lowercase, no spaces)
   - **Description:** "Pokémon game with combat, raids, dungeons, and market system"
   - **Public / Private:** Choose based on preference
   - **Initialize with README:** Leave unchecked (we have our own)
   - **.gitignore:** Select "Node"
   - **License:** Optional (choose MIT if unsure)

3. Click **"Create repository"**

You'll see a new empty repository with setup instructions.

---

## Step 2: Initialize Git Locally

Open your terminal in the project root (`c:\Users\RAYX\Auralis`):

```bash
# Check if git is already initialized
git status

# If not initialized, initialize it
git init
```

---

## Step 3: Verify .gitignore

Make sure `.gitignore` exists in project root and contains:

```
# Critical - Don't commit these!
.env
.env.local
.env.*.local
.env.production

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
build/
dist/
.next/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
.DS_Store

# Database
*.db
mongo.log
```

**Verify .env files are NOT staged:**
```bash
git status
# Should NOT show server/.env, client/.env, bot/.env
```

---

## Step 4: Stage All Files

```bash
# Add all files to staging
git add .

# Verify what will be committed
git status
```

**Checklist:**
- ✓ `server/` folder visible
- ✓ `client/` folder visible
- ✓ `bot/` folder visible
- ✓ `.gitignore` file included
- ✓ `.env` files NOT shown
- ✓ `node_modules/` NOT shown

---

## Step 5: Create Initial Commit

```bash
# Commit with descriptive message
git commit -m "Initial commit: Project Auralis Phase 1 - Full Game Implementation

- Complete backend with 50+ API endpoints
- React frontend with 6 game components
- Telegram bot with 13 commands
- Combat engine with Gen 8 mechanics
- MongoDB models for all game systems
- Comprehensive documentation and guides"
```

This creates a snapshot of your code.

---

## Step 6: Add Remote Repository

Copy the setup commands from your GitHub repository page:

```bash
# Add GitHub as remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/auralis.git

# Verify remote is added
git remote -v
# Should show: origin https://github.com/YOUR_USERNAME/auralis.git (fetch)
#             origin https://github.com/YOUR_USERNAME/auralis.git (push)
```

---

## Step 7: Push to GitHub

```bash
# Rename branch to main (if not already)
git branch -M main

# Push to GitHub
git push -u origin main
```

This may prompt for GitHub authentication:
- Use your GitHub username and password
- Or use GitHub personal access token
- Or authenticate with SSH key

**Expected output:**
```
Enumerating objects: 150, done.
Counting objects: 100% (150/150), done.
Delta compression using up to 8 threads
Compressing objects: 100% (120/120), done.
Writing objects: 100% (150/150), 500 KiB, done.
Creating pull request...
...
To https://github.com/YOUR_USERNAME/auralis.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Step 8: Verify on GitHub

1. Go to https://github.com/YOUR_USERNAME/auralis
2. You should see:
   - ✓ All folders (server, client, bot)
   - ✓ All documentation files (README.md, DEPLOYMENT.md, etc.)
   - ✓ `.gitignore` file protecting secrets
   - ✓ File count showing your project size
   - ✓ "main" branch with commit history

3. Click on a file to verify content

---

## GitHub Best Practices

### Protecting Secrets

Never commit:
- `.env` files with actual credentials
- API keys or tokens
- Database passwords
- JWT secrets

These should ONLY exist in:
- Local `.env` (not committed)
- Production environment variables (Render, Vercel dashboards)

### Future Commits

After initial push, making changes:

```bash
# Make your code changes...

# Stage changes
git add .

# Commit with message
git commit -m "Clear message about what changed"

# Push to GitHub
git push
```

### Branching (Optional)

For bigger changes, use branches:

```bash
# Create new branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push branch
git push -u origin feature/new-feature

# On GitHub: Create Pull Request
# After review: Merge to main
```

---

## Troubleshooting GitHub Setup

### "fatal: not a git repository"
```bash
# Initialize git
git init
```

### "remote origin already exists"
```bash
# View existing remote
git remote -v

# Remove old remote
git remote remove origin

# Add correct remote
git remote add origin https://github.com/YOUR_USERNAME/auralis.git
```

### "Authentication failed"
- Check GitHub username is correct
- Check password is correct
- Create GitHub Personal Access Token:
  - GitHub Settings → Developer settings → Personal access tokens
  - Click "Generate new token"
  - Select "repo" and "workflow" scopes
  - Use token as password when prompted

### "branch rename failed"
```bash
# Verify branch name
git branch -a

# Rename to main
git branch -M main

# Try push again
git push -u origin main
```

### ".env file showing in git status"
```bash
# If .env was already committed:
git rm --cached .env
git commit -m "Remove .env from tracking"

# Add to .gitignore and commit
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to .gitignore"
```

---

## Next Steps

After pushing to GitHub:

1. ✅ Code is backed up on GitHub
2. 🔄 Next: Deploy to production
   - **Backend:** [Render Deployment](https://render.com)
   - **Frontend:** [Vercel Deployment](https://vercel.com)
   - **Database:** [MongoDB Atlas Setup](https://mongodb.com/cloud/atlas)

3. See `DEPLOYMENT.md` for full instructions

---

## GitHub Repository Structure

Your repository will look like:

```
auralis/
├── .git/                    # Git history (auto-created)
├── .gitignore               # Files to ignore
├── README.md                # Main documentation
├── DEPLOYMENT.md            # Cloud deployment guide
├── QUICKSTART-LOCAL.md      # Local setup guide
├── TESTING-CHECKLIST.md     # Testing procedures
├── server/
│   ├── package.json
│   ├── src/
│   │   ├── app.js           # Express server
│   │   ├── models/          # Database schemas
│   │   ├── routes/          # API endpoints
│   │   └── services/        # Business logic
│   └── .env.example         # Template (actual .env NOT committed)
├── client/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── components/      # React components
│   │   └── api/             # API calls
│   └── .env.example         # Template
└── bot/
    ├── index.js             # Bot commands
    ├── package.json
    └── .env.example         # Template
```

---

## Useful Git Commands

```bash
# View commit history
git log --oneline

# Check what changed
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Create new branch
git checkout -b branch-name

# Switch to branch
git checkout branch-name

# List all branches
git branch -a

# Delete branch
git branch -d branch-name

# See who changed each line
git blame filename.js

# Search commit history
git log --grep="keyword"
```

---

Good luck! Your code is now safely backed up on GitHub and ready for deployment! 🎉

Next: Follow `DEPLOYMENT.md` to deploy to Render and Vercel.
