# 🚀 Complete Deployment Guide - GitHub → Vercel + Render

Deploy Project Auralis to production with full automation!

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)
- Telegram BotFather
- Git installed locally

---

## Step 1️⃣: Prepare GitHub Repository

### 1.1 Initialize Git (if not done)
```bash
cd /path/to/Auralis
git init
git add .
git commit -m "Initial commit: Project Auralis Phase 1"
```

### 1.2 Create .gitignore
Create `Auralis/.gitignore`:
```
# Environment variables
.env
.env.local
.env.*.local

# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
/build
/dist
*.js.map

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*

# Cache
.cache/
.next/
.nuxt/

# Testing
coverage/
.nyc_output/

# Temporary
tmp/
temp/
```

Run:
```bash
git add .gitignore
git commit -m "Add .gitignore"
```

### 1.3 Push to GitHub

Go to github.com, create new repo `auralis`, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/auralis.git
git branch -M main
git push -u origin main
```

✅ **Repository ready!**

---

## Step 2️⃣: MongoDB Atlas Setup

### 2.1 Create Free Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create Organization & Project
4. Create a **Free Shared Cluster**
5. Choose region closest to you

### 2.2 Add Database User

1. Go to "Database Access"
2. Create user: `auralis_user`
3. Strong password (save it!)
4. Permissions: "Read and write to any database"

### 2.3 Add IP Whitelist

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere" (0.0.0.0/0)
   - For production, restrict to your server IPs

### 2.4 Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy MongoDB URI:
```
mongodb+srv://auralis_user:PASSWORD@cluster.mongodb.net/auralis?retryWrites=true&w=majority
```

Save this! You'll need it for both Render and Vercel.

✅ **Database ready!**

---

## Step 3️⃣: Telegram Mini Bot Setup

### 3.1 Create Bot with BotFather

1. Open Telegram
2. Search for `@BotFather`
3. Send `/newbot`
4. Follow prompts:
   - Bot name: `Auralis Bot`
   - Bot username: `auralis_game_bot` (unique)
5. Copy your **Bot Token** (save it!)

### 3.2 Enable Mini App

1. Send `/mybots` to BotFather
2. Select your bot
3. Click "Bot Settings"
4. Select "Menu Button"
5. Click "Configure menu button"
6. Set URL to your Vercel frontend URL (after deployment)

Example: `https://auralis.vercel.app`

### 3.3 Update Bot Webhook (for Render)

After deploying to Render, set webhook:
```bash
curl -X POST https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-render-app.onrender.com/webhook",
    "allowed_updates": ["message", "callback_query"]
  }'
```

✅ **Bot ready!**

---

## Step 4️⃣: Deploy Backend on Render

### 4.1 Connect GitHub to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Grant repository access

### 4.2 Create Web Service

1. Click "New +" → "Web Service"
2. Select repository: `auralis`
3. Settings:
   - **Name:** `auralis-api`
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Select **Free plan**

### 4.3 Add Environment Variables

In Render dashboard, go to your service → "Environment":

```
MONGODB_URI=mongodb+srv://auralis_user:PASSWORD@cluster.mongodb.net/auralis?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
CORS_ORIGIN=https://auralis.vercel.app
JWT_SECRET=your_super_secret_key_here_min_32_chars
```

### 4.4 Update server/.env for Render

Create `server/.env.production`:
```
MONGODB_URI=mongodb+srv://auralis_user:PASSWORD@cluster.mongodb.net/auralis?retryWrites=true&w=majority
NODE_ENV=production
PORT=10000
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
CORS_ORIGIN=${CORS_ORIGIN}
JWT_SECRET=${JWT_SECRET}
```

### 4.5 Update bot/.env for Render

Create `bot/.env.production`:
```
TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
SERVER_URL=https://auralis-api.onrender.com
```

### 4.6 Verify Deployment

After deployment (takes ~5 min):
```bash
curl https://auralis-api.onrender.com/health
# Should return: {"status":"ok"}
```

✅ **Backend deployed!**

---

## Step 5️⃣: Deploy Frontend on Vercel

### 5.1 Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Grant repository access

### 5.2 Create Project

1. Click "Add New..." → "Project"
2. Select `auralis` repository
3. Settings:
   - **Framework Preset:** Create React App
   - **Root Directory:** `./client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`

### 5.3 Add Environment Variables

In Vercel project settings → "Environment Variables":

```
REACT_APP_API_URL=https://auralis-api.onrender.com
REACT_APP_ENVIRONMENT=production
REACT_APP_TELEGRAM_BOT_ID=YOUR_BOT_USERNAME
```

### 5.4 Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Build React app
3. Deploy to Vercel CDN
4. Give you a URL: `https://auralis.vercel.app`

### 5.5 Update Telegram Mini App URL

Go back to BotFather:
1. `/mybots` → Select your bot
2. "Menu Button" → Set URL to `https://auralis.vercel.app`

✅ **Frontend deployed!**

---

## Step 6️⃣: Test Everything (Local First)

### 6.1 Test on Local Web

Before testing in Telegram, test locally:

```bash
# 1. Start backend (uses MongoDB Atlas)
cd server
npm start
# Should see: "Server running on port 5000"

# 2. Start frontend (in new terminal)
cd client
npm start
# Browser opens to http://localhost:3000
```

### 6.2 Test Basic Flows

**In browser at http://localhost:3000:**
- [ ] Load Pokédex
- [ ] View empty team
- [ ] Check API calls in DevTools Network tab

**In terminal (test API):**
```bash
curl http://localhost:5000/health
curl http://localhost:5000/api/pokedex?limit=1
```

### 6.3 Test in Telegram Mini App

1. Open your bot on Telegram
2. Click menu button
3. Should open Vercel app inside Telegram
4. Test user profile, Pokédex, etc.

### 6.4 Debug Issues

**Check Render logs:**
```bash
curl https://auralis-api.onrender.com/health
```

**Check Vercel logs:**
1. Go to Vercel dashboard
2. Select project
3. "Deployments" tab
4. Click latest → "Logs"

**Check MongoDB:**
1. Go to MongoDB Atlas
2. Click "Browse Collections"
3. Verify `auralis` database exists

---

## 📝 File Structure for Deployment

```
Auralis/
├── .github/
│   └── workflows/              ← CI/CD pipelines (optional)
│
├── server/
│   ├── .env.production         ← Production env template
│   ├── package.json            ← MUST have "start" script
│   ├── src/
│   │   ├── app.js
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── vercel.json             ← Vercel config (if using)
│
├── bot/
│   ├── .env.production
│   ├── package.json
│   └── index.js
│
├── client/
│   ├── .env.production         ← Vercel will use this
│   ├── package.json
│   ├── public/
│   └── src/
│
├── .gitignore                  ← Ignore .env files!
├── README.md
└── DEPLOYMENT.md              ← This file
```

---

## 🔐 Security Checklist

Before deploying:
- [ ] All sensitive values in environment variables (not in code)
- [ ] `.env` files are in `.gitignore`
- [ ] No API keys/tokens in GitHub
- [ ] MongoDB user has minimal permissions
- [ ] Render service is private (not exposed)
- [ ] Vercel domain is HTTPS only
- [ ] CORS origin matches Vercel URL
- [ ] JWT secret is strong & random

---

## 🐛 Common Deployment Issues

### "Build failed on Vercel"
**Solution:** Check build logs. Usually missing dependencies.
```bash
cd client && npm install
git add package-lock.json && git commit -m "Update dependencies"
git push
```

### "API returns 401 Unauthorized"
**Solution:** Check CORS_ORIGIN in Render env vars
```
CORS_ORIGIN=https://auralis.vercel.app
```

### "MongoDB connection timeout"
**Solution:** 
1. Check IP whitelist in MongoDB Atlas (should be 0.0.0.0/0)
2. Verify connection string is correct
3. Check Render environment variable is set

### "Telegram Bot not responding"
**Solution:** Set webhook in Render after deployment:
```bash
curl -X POST https://api.telegram.org/bot{TOKEN}/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://auralis-api.onrender.com/webhook"}'
```

### "Vercel shows blank page"
**Solution:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set correctly
3. Check API is accessible: `curl https://auralis-api.onrender.com/health`

---

## 📊 Architecture After Deployment

```
User on Telegram
        ↓
Telegram Mini App (Vercel)
        ↓
REST API (Render)
        ↓
MongoDB Atlas
```

All components communicate via HTTPS.

---

## 🚀 Advanced Deployment Options

### GitHub Actions CI/CD
Create `.github/workflows/deploy.yml` for auto-deploy on push:
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Trigger Render deployment
        run: |
          curl ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Custom Domain
1. Buy domain (e.g., auralis.game)
2. Vercel: Add domain in project settings
3. Render: Add custom domain in environment
4. Update DNS records

### SSL/TLS
- Vercel: Automatic (free)
- Render: Automatic (free)

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Code pushed to GitHub
- [ ] `.env` files in `.gitignore`
- [ ] README.md complete
- [ ] All tests pass locally
- [ ] No console errors

### During Deployment
- [ ] Create MongoDB Atlas cluster
- [ ] Create Render web service
- [ ] Create Vercel project
- [ ] Set all environment variables
- [ ] Create Telegram bot

### After Deployment
- [ ] Test health endpoint
- [ ] Test API endpoints
- [ ] Test web UI
- [ ] Test Telegram Mini App
- [ ] Verify MongoDB has data
- [ ] Check Render/Vercel logs

---

## 📞 Monitoring & Maintenance

### Vercel Monitoring
1. Dashboard shows deployment status
2. Function analytics
3. Error tracking

### Render Monitoring
1. Service status page
2. Resource usage
3. Logs accessible

### MongoDB Monitoring
1. Atlas dashboard
2. Query performance
3. Storage usage

---

## 💚 Cost Summary (Free Tier)

| Service | Cost | Limits |
|---------|------|--------|
| Vercel | Free | 100GB bandwidth |
| Render | Free | 750 hours/month |
| MongoDB Atlas | Free | 512MB storage |
| Telegram | Free | Unlimited |
| GitHub | Free | Public repos |
| **Total** | **$0** | **Great for Phase 1!** |

---

## 🎯 Next Steps

1. ✅ Set up GitHub repo
2. ✅ Create MongoDB Atlas cluster
3. ✅ Deploy backend to Render
4. ✅ Deploy frontend to Vercel
5. ✅ Create Telegram Mini Bot
6. ✅ Test everything
7. 🚀 Share with friends!

---

## 📚 Useful Links

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Telegram Mini Apps](https://core.telegram.org/bots/webapps)

---

**Your game is ready for the world!** 🌍🎮
