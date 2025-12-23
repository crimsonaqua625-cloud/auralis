# 🚀 Deployment Checklist - Ready to Deploy

Your .env files are ready! Now follow these steps:

---

## ✅ STEP 1: MongoDB Atlas Setup (10 min)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster (takes 2-3 min)
4. Click "Database Access" → "Add New Database User"
   - Username: `auralis_user`
   - Password: Generate strong one (copy it!)
5. Click "Network Access" → "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)
6. Click "Databases" → "Connect" on your cluster
   - Choose "Drivers"
   - Copy connection string
   - Replace `<username>` and `<password>` with your values
   - This is your MONGODB_URI

**Example:** 
```
mongodb+srv://auralis_user:YOUR_PASSWORD@auralis.xxxxx.mongodb.net/auralis?retryWrites=true&w=majority
```

Put this in:
- `server/.env` → MONGODB_URI
- `bot/.env` → Add: MONGODB_URI=...

---

## ✅ STEP 2: Telegram Bot Setup (5 min)

1. Open Telegram
2. Search for: @BotFather
3. Send: `/newbot`
4. Follow prompts:
   - Bot name: "Auralis Game Bot" (or your choice)
   - Bot username: "auralis_game_bot" (unique, lowercase)
5. BotFather gives you a TOKEN (copy it!)
6. Send: `/mybots` → Select your bot → **Edit Commands**
7. Add these commands:
   ```
   start - Start the game
   help - View all commands
   profile - View your profile
   teams - View your teams
   pokedex - Browse Pokémon
   pokemon - View collection
   market - Access market
   raid - View raids
   dungeon - Enter dungeon
   encounter - Start wild battle
   faction - Guild info
   mail - View messages
   settings - Adjust settings
   ```

Put the TOKEN in:
- `server/.env` → TELEGRAM_BOT_TOKEN
- `bot/.env` → TELEGRAM_BOT_TOKEN

---

## ✅ STEP 3: Deploy Backend (Render) - (15 min)

1. Go to: https://render.com
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Select your auralis repository
5. Click "Connect"
6. Fill in settings:
   ```
   Name: auralis-api
   Environment: Node
   Build Command: cd server && npm install
   Start Command: cd server && node src/app.js
   Region: Choose nearest to you
   ```
7. Click "Advanced" and add Environment Variables:

   | Key | Value |
   |-----|-------|
   | MONGODB_URI | Your MongoDB Atlas connection string |
   | TELEGRAM_BOT_TOKEN | Your bot token from BotFather |
   | JWT_SECRET | Generate random: `openssl rand -hex 32` or just `your-secret-key-123` |
   | CORS_ORIGIN | https://auralis.vercel.app |
   | NODE_ENV | production |

8. Click "Create Web Service"
9. Wait for deployment (2-5 min)
10. You'll get a URL like: `https://auralis-api.onrender.com`
11. Test it: Visit `https://auralis-api.onrender.com/health`
    - Should see: `{"status":"ok","message":"API is running"}`

**Copy this URL** - you'll need it for frontend!

---

## ✅ STEP 4: Deploy Frontend (Vercel) - (10 min)

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New..." → "Project"
4. Import your auralis repository
5. Select "Create a new Team" or skip
6. Configure project:
   ```
   Project Name: auralis
   Framework: Create React App
   Root Directory: client
   ```
7. Add Environment Variables:

   | Key | Value |
   |-----|-------|
   | REACT_APP_API_URL | https://auralis-api.onrender.com (from Step 3) |
   | REACT_APP_TELEGRAM_BOT_ID | your_bot_username (from Step 2) |
   | REACT_APP_ENVIRONMENT | production |

8. Click "Deploy"
9. Wait for deployment (2-5 min)
10. You'll get a URL like: `https://auralis.vercel.app`
11. Visit it - your game should load! 🎮

---

## ✅ STEP 5: Update Backend CORS (2 min)

Now that you have your Vercel URL:

1. Go to Render dashboard
2. Click "auralis-api"
3. Go to "Environment" tab
4. Update `CORS_ORIGIN` to your actual Vercel URL:
   ```
   https://auralis.vercel.app
   ```
5. Click "Save" - service auto-redeploys

---

## ✅ STEP 6: Final Testing (5 min)

### Test Backend:
```bash
curl https://auralis-api.onrender.com/health
# Should return: {"status":"ok","message":"API is running"}
```

### Test Frontend:
- Visit: https://auralis.vercel.app
- You should see the Pokédex and game interface
- Check browser console (F12) for any errors
- Should see no red errors

### Test Bot:
- Search for your bot in Telegram: @auralis_game_bot (or your username)
- Send: `/start`
- Should get welcome message
- Try: `/profile`, `/pokedex`, `/teams`

### Test API Integration:
- In Vercel frontend, click around
- Check browser DevTools (F12) → Network tab
- Should see API calls to render.com going through
- All requests should have green 200/201 status

---

## 🎉 YOU'RE LIVE!

If all tests pass, your game is now live at:

```
Frontend:  https://auralis.vercel.app
Backend:   https://auralis-api.onrender.com
Bot:       @your_bot_username
Repo:      https://github.com/crimsonaqua625-cloud/auralis
```

---

## 📝 Your .env Files are Ready!

All three .env files have been created with:
- ✅ All necessary variables only (no extra clutter)
- ✅ Placeholder values
- ✅ Production configuration

Just fill in:
1. **server/.env:**
   - MONGODB_URI (from MongoDB Atlas)
   - TELEGRAM_BOT_TOKEN (from BotFather)
   - JWT_SECRET (any random string)

2. **client/.env:**
   - REACT_APP_TELEGRAM_BOT_ID (your bot username)
   - REACT_APP_API_URL (will auto-update from Render URL)

3. **bot/.env:**
   - TELEGRAM_BOT_TOKEN (same as server)
   - API_URL (will auto-update from Render URL)

---

## 🚨 Important Reminders

- ⚠️ **NEVER commit .env files** - .gitignore protects them
- ✅ Do commit `.env.example` files (they're templates)
- 🔐 Keep your secrets safe
- 📌 Render free tier sleeps after 15 min inactivity
- ✅ Auto-redeploys on GitHub push

---

## 🆘 If Something Goes Wrong

1. **Check Render Logs**
   - Render dashboard → auralis-api → Logs tab
   - Look for MongoDB connection errors

2. **Check Vercel Logs**
   - Vercel dashboard → auralis → Deployments
   - Check build logs for errors

3. **Test MongoDB Connection**
   - Verify connection string is correct
   - Check IP whitelist in MongoDB Atlas (0.0.0.0/0 for now)
   - Verify username/password are correct

4. **Test CORS**
   - Open browser DevTools (F12)
   - Look for "CORS error" in console
   - Verify CORS_ORIGIN matches exactly

5. **See Troubleshooting**
   - DEPLOYMENT.md has detailed troubleshooting
   - TESTING-CHECKLIST.md has validation procedures

---

## 📞 Quick Command Reference

```bash
# Test backend health
curl https://auralis-api.onrender.com/health

# Test API
curl https://auralis-api.onrender.com/api/pokedex

# Test locally (before deploying)
cd server && npm start      # Terminal 1
cd client && npm start      # Terminal 2
cd bot && npm start         # Terminal 3
```

---

**You're all set! Follow the 6 steps above and your game will be live! 🚀🎮**
