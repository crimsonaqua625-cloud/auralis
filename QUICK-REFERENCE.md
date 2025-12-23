# 🎯 Quick Reference - Deployment Commands

Copy-paste ready commands for deploying Project Auralis.

## 🏃 Quick Deploy (5 Minutes)

If you've already tested locally and just want the commands:

### 1. Push to GitHub
```bash
cd ~/Auralis
git init
git add .
git commit -m "Initial commit: Project Auralis"
git remote add origin https://github.com/YOUR_USERNAME/auralis.git
git branch -M main
git push -u origin main
```

### 2. Deploy Backend (Render)
In Render dashboard:
- Click "New +" → "Web Service"
- Connect GitHub repo
- Set env vars (see list below)
- Deploy

### 3. Deploy Frontend (Vercel)
In Vercel dashboard:
- Click "Import Project"
- Select GitHub repo
- Set root to `client`
- Set env vars (see list below)
- Deploy

---

## 🔐 Environment Variables Quick Copy

### Server (.env)
```bash
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/auralis?retryWrites=true&w=majority
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
JWT_SECRET=your-secret-change-this
CORS_ORIGIN=https://auralis.vercel.app
NODE_ENV=production
PORT=5000
```

### Client (.env)
```bash
REACT_APP_API_URL=https://auralis-api.onrender.com
REACT_APP_TELEGRAM_BOT_ID=your_bot_username
REACT_APP_ENVIRONMENT=production
```

### Bot (.env)
```bash
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
API_URL=https://auralis-api.onrender.com
NODE_ENV=production
```

---

## 🧪 Quick Testing Commands

### Test Server Health
```bash
curl https://auralis-api.onrender.com/health
```

### Test API
```bash
curl https://auralis-api.onrender.com/api/pokedex
```

### Test Telegram Bot
In Telegram, search for your bot and:
```
/start
/profile
/pokedex
/teams
/raid
```

---

## 🔗 Important URLs After Deployment

```
Frontend:        https://auralis.vercel.app
Backend:         https://auralis-api.onrender.com
API Docs:        https://auralis-api.onrender.com/api-docs (if enabled)
GitHub:          https://github.com/YOUR_USERNAME/auralis
MongoDB:         https://cloud.mongodb.com (Atlas dashboard)
Telegram Bot:    @YourBotUsername
```

---

## 📦 Key Files to Know

| File | Purpose | When? |
|------|---------|-------|
| `.env` | Secrets & config | Run locally only |
| `.env.example` | Config template | Commit to GitHub |
| `.gitignore` | Hide secrets | Always |
| `server/app.js` | Backend entry | Render runs this |
| `client/src/App.js` | Frontend | Vercel builds this |
| `bot/index.js` | Bot code | Run locally |

---

## ⚡ Common Issues & Fixes

### "Cannot find module"
```bash
# Fix: Reinstall dependencies
cd server && npm install
cd ../client && npm install
cd ../bot && npm install
```

### "ECONNREFUSED"
```bash
# MongoDB not running locally
# Either: Start MongoDB, or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### "CORS error"
```bash
# Fix: Update CORS_ORIGIN in server/.env
CORS_ORIGIN=https://auralis.vercel.app

# Then redeploy server
```

### "Bot won't respond"
```bash
# Fix: Check bot token
# In Render, go to Environment and verify TELEGRAM_BOT_TOKEN
# Get new token from @BotFather if needed
```

### ".env file committed to Git"
```bash
# Fix: Remove from history
git rm --cached .env
git commit -m "Remove .env"

# Add to .gitignore
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Add .env to gitignore"
```

---

## 🚀 One-Liner Starters

### Start Server Locally
```bash
cd server && npm install && npm start
```

### Start Client Locally
```bash
cd client && npm install && npm start
```

### Start Bot Locally
```bash
cd bot && npm install && npm start
```

### Full Local Startup (3 terminals)
```bash
# Terminal 1 - Server
cd server && npm install && npm start

# Terminal 2 - Client
cd client && npm install && npm start

# Terminal 3 - Bot
cd bot && npm install && npm start
```

---

## 📋 Deployment Checklist

Before deploying:
- [ ] Tested locally
- [ ] All .env files created
- [ ] No secrets in code
- [ ] GitHub repo created
- [ ] MongoDB cluster ready
- [ ] Telegram bot token ready
- [ ] Render account created
- [ ] Vercel account created

During deployment:
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set everywhere
- [ ] Database connected

After deployment:
- [ ] Frontend loads at vercel.app URL
- [ ] API responds at render.com URL
- [ ] Bot commands work in Telegram
- [ ] Data syncs between all three

---

## 🎓 Documentation Files

```
├── DEPLOYMENT-ROADMAP.md      ← You are here (overview)
├── QUICKSTART-LOCAL.md         ← Local testing
├── GITHUB-SETUP.md             ← Push to GitHub
├── DEPLOYMENT.md               ← Cloud deployment
├── TESTING-CHECKLIST.md        ← Verify everything
└── README.md                    ← Architecture
```

---

## 💬 Quick Answers

**Q: Where do I start?**
A: Read `QUICKSTART-LOCAL.md` to test locally first

**Q: How long does deployment take?**
A: ~1-2 hours total (mostly waiting for services to deploy)

**Q: Can I skip local testing?**
A: Not recommended. Tests catch 90% of cloud issues

**Q: How much does it cost?**
A: $0 total. All free tiers (Render, Vercel, MongoDB Atlas)

**Q: What if something breaks?**
A: See "Troubleshooting" in `DEPLOYMENT.md`

**Q: Can multiple users play?**
A: Yes! Database supports multiple users, teams, trading

**Q: How do I access the game?**
A: Via browser at https://auralis.vercel.app OR Telegram bot

**Q: Can I modify the code after deployment?**
A: Yes! Push to GitHub, both services auto-redeploy

**Q: Where are my secrets stored?**
A: Never in code. Only in Render/Vercel/local .env files

**Q: How do I monitor the live game?**
A: Check Render logs for backend, Vercel logs for frontend

---

## 🔐 Security Checklist

- [ ] .env files in .gitignore
- [ ] No secrets in code
- [ ] No hardcoded API keys
- [ ] CORS limited to frontend domain
- [ ] JWT secret is random/strong
- [ ] MongoDB whitelist configured
- [ ] Bot token kept secret

---

## 📊 Architecture Summary

```
User ───→ Browser ──────────────→ Vercel Frontend
                    ↓
            React Components
                    ↓
         API calls to Backend
            ↓                  ↓
       Telegram Bot    Render Backend
            ↓                  ↓
    Telegram Messages   Express.js
                        ↓
                   MongoDB Atlas
                    (Database)
```

---

## ✨ After You're Done

1. Share the link: `https://auralis.vercel.app`
2. Add friends to your Telegram bot
3. Monitor for issues in Render/Vercel logs
4. Keep .env files safe
5. Back up your code regularly
6. Plan Phase 2 features!

---

**Need help? Start with `QUICKSTART-LOCAL.md` and follow the guides in order!** 🚀
