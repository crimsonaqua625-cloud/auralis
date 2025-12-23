# 🚀 Quick Start Guide - Project Auralis

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
# Server
cd server && npm install && cd ..

# Bot
cd bot && npm install && cd ..

# Client (optional)
cd client && npm install && cd ..
```

### Step 2: Create Environment Files

**server/.env**
```
MONGODB_URI=mongodb://localhost:27017/auralis
PORT=5000
NODE_ENV=development
```

**bot/.env**
```
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE
SERVER_URL=http://localhost:5000
```

**client/.env**
```
REACT_APP_API_URL=http://localhost:5000
```

### Step 3: Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Use MongoDB Compass or Atlas
```

### Step 4: Seed Data (One-time)
```bash
cd server
node -e "require('./src/services/pokeapiSeeder').seedAll()"
```

This downloads and caches Region 1-2 Pokémon (151+ species).

### Step 5: Start Services

**Terminal 1 - Server:**
```bash
cd server && npm start
```

**Terminal 2 - Bot:**
```bash
cd bot && npm start
```

**Terminal 3 - Client (optional):**
```bash
cd client && npm start
```

✅ **Done!** Your game is ready.

---

## 🎮 First Steps in Game

### Via Telegram Bot
1. Find your bot on Telegram
2. Send `/start`
3. Send `/help` to see all commands
4. Try `/profile` to see your data

### Via Web Client
1. Open http://localhost:3000
2. Browse Pokédex with `/pokedex`
3. View your Pokémon with `/pokemon`

### Via API Directly
```bash
# Create a user
curl -X GET http://localhost:5000/api/users/123456789

# View Pokédex
curl http://localhost:5000/api/pokedex?limit=5

# Check server health
curl http://localhost:5000/health
```

---

## 🎯 Core Commands

### User Commands
- `/profile` - Your stats & currency
- `/teams` - Team management
- `/bag` - Your inventory
- `/mail` - Messages & rewards

### Adventure
- `/encounter` - Find wild Pokémon
- `/explore` - Search for items
- `/gym` - Challenge Gym Leaders
- `/raid` - Join cooperative raids
- `/dungeon` - Enter 50-floor challenge

### Social
- `/market` - Buy/sell Pokémon
- `/faction` - View guilds
- `/leaderboard` - Top players

---

## 📊 System Overview

| System | Status | Details |
|--------|--------|---------|
| **Core Game** | ✅ | User profiles, Pokémon collection, teams |
| **Combat** | ✅ | Full turn-based with accurate damage formula |
| **Pokédex** | ✅ | 151+ Pokémon from Regions 1-2 |
| **PvE** | ✅ | Encounters, Trainers, Gyms, Raids, Dungeons |
| **Market** | ✅ | Buy/sell, auctions, P2P trading |
| **Factions** | ✅ | Guilds with roles and membership |
| **Bots** | ✅ | Telegram bot commands |
| **Web UI** | ✅ | React components (basic) |

---

## 🛠️ Architecture

```
User (Telegram Bot) 
    ↓
Telegram Bot (bot/index.js) 
    ↓
REST API (server/app.js)
    ↓
MongoDB (game data)
    ↓
PokéAPI (initial seed only)
```

All Pokémon data is cached locally. No external API calls during gameplay.

---

## 💾 Database Schema

The system uses 13 MongoDB collections:
- `User` - Player accounts
- `Pokemoninstance` - Individual Pokémon owned
- `Pokedex` - Species data
- `Faction` - Guild data
- `Raid` - Active raids
- `DungeonProgress` - Dungeon state
- `Item` - Item templates
- `Mail` - Player messages
- `MarketListing` - Buy/sell listings
- `AuctionListing` - Auctions
- `TradeListing` - Trade offers
- `Move` - Move data

---

## 🔧 Configuration

### Toggle Features
Edit `server/app.js` to enable/disable routes:
```javascript
// Disable PvP (Phase 2)
// app.use('/api/pvp', require('./routes/pvp'));

// Enable Safari Zone
app.use('/api/safari', require('./routes/safari'));
```

### Adjust Game Balance
Edit `server/src/services/combatEngine.js`:
```javascript
const STAB_MULTIPLIER = 1.5; // Adjust STAB bonus
const CRIT_MULTIPLIER = 1.5; // Adjust crit damage
```

### Change API Port
Edit `server/.env`:
```
PORT=8000  # Change from 5000
```

---

## 🐛 Troubleshooting

**"Cannot find module 'axios'"**
```bash
cd server && npm install axios
```

**"MongoDB connection refused"**
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Try MongoDB Atlas instead: `mongodb+srv://user:pass@cluster.mongodb.net/auralis`

**"Telegram bot token invalid"**
- Get a new token from @BotFather
- Paste into `bot/.env`

**"Port 5000 already in use"**
- Change `PORT=8000` in `server/.env`
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

**"Seeding takes too long"**
- PokéAPI might be slow
- Run in background: `nohup node seeder.js &`
- Or import pre-cached data (if available)

---

## 📚 Documentation

Full docs available in:
- **README.md** - Project overview & features
- **TESTING.md** - Testing guide & API examples
- **spec.txt** - Complete feature specification

---

## 🚀 Next: Phase 2 Features

Ready for what's next? Phase 2 will add:
- ⭐ PvP ranking system
- 🏆 Faction raids with bonuses
- 🧬 Breeding with IV/EV inheritance
- 🔮 Mega Evolution
- 📱 Native mobile app

---

## 💡 Tips & Tricks

1. **Seed data includes Regions 1-2 only** (Kanto & Johto)
   - Phase 2 will add more regions

2. **Raid tickets reset daily** (1 per day)
   - Use wisely for tier 3+ raids

3. **Dungeon has autosave every 5 floors**
   - You won't lose progress if disconnected

4. **Market has small fees**
   - 5% listing fee + 10% sale tax (configurable)

5. **Favorite Pokémon can't be removed from teams**
   - Prevents accidental loss of favorites

---

## 🎓 Learning Path

**New to the codebase?**
1. Read `README.md`
2. Explore `server/src/models/` (data structure)
3. Check `server/src/routes/` (API endpoints)
4. Review `server/src/services/combatEngine.js` (game logic)
5. Look at `bot/index.js` (user interface)

**Want to add a feature?**
1. Define data model in `models/`
2. Add API route in `routes/`
3. Implement business logic in `services/`
4. Add bot command in `bot/`
5. Create React component in `client/src/components/`

---

## 📞 Support

For issues or questions:
1. Check **TESTING.md** for common issues
2. Review **spec.txt** for feature details
3. Check server logs for errors
4. Test API endpoints with Postman

---

## 🎉 Success!

If you've made it here:
- ✅ Server running on port 5000
- ✅ Bot connected to Telegram
- ✅ MongoDB storing data
- ✅ Web UI accessible (optional)

**You're ready to play Project Auralis!** 🎮

---

**Happy hunting!** 🔴
