# 🚀 Quick Start - Local Testing Guide

Get the Auralis game running locally in 5 minutes.

## Prerequisites

- Node.js 18+ (`node -v` to check)
- npm 9+ (`npm -v` to check)
- MongoDB (local or Atlas)

## Option 1: Local MongoDB (Easiest with Docker)

```bash
# Install Docker from docker.com if needed

# Start MongoDB container
docker run -d -p 27017:27017 --name auralis-mongo mongo

# Verify it's running
docker ps | grep mongo
```

## Option 2: MongoDB Atlas (Cloud)

1. Create free account: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create cluster (takes 2-3 min)
3. Get connection string from "Connect" button
4. Use in `.env` file

## Step 1: Setup Server

```bash
cd server

# Copy environment file
cp .env.example .env

# Edit .env with your MongoDB connection
# If using local MongoDB:
#   MONGODB_URI=mongodb://localhost:27017/auralis
# If using MongoDB Atlas:
#   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auralis

# Install dependencies
npm install

# Start server
npm start
```

Expected output:
```
✓ MongoDB connected
✓ Server running on http://localhost:5000
✓ Health check: http://localhost:5000/health
```

**✓ Server is running!**

## Step 2: Setup Client (New Terminal)

```bash
cd client

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start React app
npm start
```

This automatically opens http://localhost:3000

**✓ Client is running!**

## Step 3: Test Basic Features

In your browser at http://localhost:3000:

### Pokédex
- [ ] Click "Pokédex" tab
- [ ] See list of Pokémon loading
- [ ] Search for "pikachu" works
- [ ] Click a Pokémon shows details

### Teams
- [ ] Click "Teams" tab
- [ ] See your team slots
- [ ] Try to add/remove Pokémon

### Raids
- [ ] Click "Raids" tab
- [ ] See active raids
- [ ] Filter by tier (1-4 stars)

### Market
- [ ] Click "Market" tab
- [ ] See listings, auctions, trades
- [ ] Can view prices

## Step 4: Test API (Terminal)

```bash
# Health check
curl http://localhost:5000/health

# Get Pokédex
curl http://localhost:5000/api/pokedex

# Create user
curl -X POST http://localhost:5000/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"TestPlayer","region":"kanto"}'

# Get user
curl http://localhost:5000/api/user/profile
```

**✓ API is working!**

## Step 5: Test Bot (Optional)

If you have a Telegram bot token:

```bash
cd bot

# Copy environment file
cp .env.example .env

# Edit .env with your bot token from @BotFather
# TELEGRAM_BOT_TOKEN=your_token_here

# Install dependencies
npm install

# Start bot
npm start
```

Then in Telegram:
- Find your bot
- Type `/start`
- Type `/profile`
- Type `/pokedex`

## Common Issues

### Port 5000 Already in Use
```bash
# Change port in server/.env
PORT=5001

# Restart server
```

### Port 3000 Already in Use
```bash
# In client terminal, press Ctrl+C then:
PORT=3001 npm start
```

### MongoDB Connection Error
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Fix:**
- If local MongoDB: `docker start auralis-mongo`
- If Atlas: Check connection string in `.env`
- If Atlas: Whitelist your IP in MongoDB Atlas (Network Access)

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS
```

**Fix:**
- Server might not be running (check terminal)
- Check `CORS_ORIGIN` in `server/.env`
- Set to: `http://localhost:3000`

### Dependencies Installation Fails
```bash
# Try clearing npm cache
npm cache clean --force

# Try again
npm install
```

## Stopping Services

```bash
# Server (press Ctrl+C in server terminal)
# Client (press Ctrl+C in client terminal)
# Bot (press Ctrl+C in bot terminal)

# Stop MongoDB
docker stop auralis-mongo

# Remove MongoDB container (optional)
docker rm auralis-mongo
```

## Next Steps

Once everything is working locally:

1. ✅ Test thoroughly
2. ✅ Create GitHub repository
3. ✅ Deploy to Render (backend)
4. ✅ Deploy to Vercel (frontend)
5. ✅ Configure Telegram Mini Bot
6. 🎮 Share with friends!

See `DEPLOYMENT.md` for full deployment guide.

## Quick Troubleshooting Command

```bash
# Kill all node processes
pkill -f "node"

# Clean install
rm -rf node_modules package-lock.json
npm install
npm start
```

## Help

Check these files for more info:
- `server/README.md` - Backend API docs
- `client/README.md` - Frontend docs
- `bot/README.md` - Bot docs
- `DEPLOYMENT.md` - Full deployment guide

Good luck! 🎮
