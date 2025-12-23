# ✅ Testing Checklist - Project Auralis

Comprehensive testing guide to verify all systems work before deployment.

## 🎯 Pre-Deployment Testing (Local)

### Step 1: Environment Setup
- [ ] Node.js 18+ installed
- [ ] npm 9+ installed
- [ ] Git installed
- [ ] MongoDB running (local or Atlas)
- [ ] `.env` files created from `.env.example` templates

### Step 2: Dependency Installation
```bash
# Test server installation
cd server && npm install
# Expected: All dependencies installed, no errors
```

```bash
# Test client installation
cd client && npm install
# Expected: All dependencies installed, no errors
```

```bash
# Test bot installation
cd bot && npm install
# Expected: All dependencies installed, no errors
```

---

## 🔧 Backend (Server) Testing

### 1. Server Startup
```bash
cd server
npm start
```

**Checklist:**
- [ ] No error on startup
- [ ] Console shows "MongoDB connected"
- [ ] Console shows "Server running on port 5000"
- [ ] Health check responds: `curl http://localhost:5000/health`

### 2. Database Connection
```bash
# Test MongoDB connection
curl http://localhost:5000/health
```

**Expected Response:**
```json
{"status":"ok","message":"API is running"}
```

**Checklist:**
- [ ] Response code is 200
- [ ] Status is "ok"
- [ ] No connection errors in logs

### 3. API Endpoints - User Routes

```bash
# Create user
curl -X POST http://localhost:5000/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"TestPlayer","region":"kanto"}'
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "TestPlayer",
  "region": "kanto",
  "teams": [
    {"name": "Main", "pokemon": []}
  ],
  "pokedex": []
}
```

**Checklist:**
- [ ] Status code 201
- [ ] User created with default teams
- [ ] Default region is kanto

```bash
# Get user profile
curl http://localhost:5000/api/user/profile
```

**Expected Response:**
```json
{
  "_id": "...",
  "name": "TestPlayer",
  "level": 1,
  "exp": 0,
  ...
}
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns user data
- [ ] Profile has expected fields

### 4. API Endpoints - Pokédex Routes

```bash
# Get all Pokédex entries
curl http://localhost:5000/api/pokedex
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns array of Pokémon
- [ ] Each Pokémon has: id, name, types, baseStats
- [ ] Total count is 151+ (from PokéAPI seed)

```bash
# Search Pokémon
curl "http://localhost:5000/api/pokedex?search=pikachu"
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns matching Pokémon
- [ ] Search is case-insensitive

### 5. API Endpoints - Team Routes

```bash
# Get all teams
curl http://localhost:5000/api/team
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns array of 6 teams (default)
- [ ] Main team is marked

```bash
# Update team
curl -X PUT http://localhost:5000/api/team/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Fire Team","description":"All fire types"}'
```

**Checklist:**
- [ ] Status code 200
- [ ] Team name updated
- [ ] Description saved

### 6. API Endpoints - Market Routes

```bash
# Get market listings
curl http://localhost:5000/api/market
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns array of listings
- [ ] Each listing has: seller, price, active status

```bash
# Create market listing
curl -X POST http://localhost:5000/api/market \
  -H "Content-Type: application/json" \
  -d '{"pokemonId":"1","price":1000}'
```

**Checklist:**
- [ ] Status code 201
- [ ] Listing created
- [ ] Price is stored correctly
- [ ] Seller is current user

### 7. API Endpoints - Raid Routes

```bash
# Get active raids
curl http://localhost:5000/api/raid
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns array of raids
- [ ] Each raid has: tier, boss, players, maxPlayers
- [ ] Tier is 1-4

### 8. API Endpoints - Dungeon Routes

```bash
# Get dungeon progress
curl http://localhost:5000/api/dungeon/progress
```

**Checklist:**
- [ ] Status code 200
- [ ] Returns dungeon progress object
- [ ] Current floor defaults to 0
- [ ] Max floor tracks progression
- [ ] Save points tracked

### 9. Combat Engine Testing

Create a test file `server/test-combat.js`:

```javascript
const { combatEngine } = require('./src/services/combatEngine');

// Test stat calculation
const stats = combatEngine.getStats({
  baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 }, // Pikachu
  ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
  evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
  level: 50,
  nature: 'neutral'
});

console.log('Stats at Level 50:', stats);
// Expected HP: 115

// Test type effectiveness
const effectiveness = combatEngine.getTypeEffectiveness('fire', 'grass');
console.log('Fire vs Grass:', effectiveness);
// Expected: 2 (super effective)
```

**Checklist:**
- [ ] Stats calculation is correct
- [ ] Type effectiveness matrix works
- [ ] Damage formula produces realistic values
- [ ] Status effects apply correctly

---

## 🎨 Frontend (Client) Testing

### 1. Client Startup
```bash
cd client
npm start
```

**Checklist:**
- [ ] Browser opens to http://localhost:3000
- [ ] React DevTools show no errors
- [ ] Page loads in < 5 seconds

### 2. App Layout

Visit http://localhost:3000

**Visual Checklist:**
- [ ] Header/navigation visible
- [ ] Main content area loads
- [ ] No console errors (F12 > Console)
- [ ] All tabs are present

### 3. Pokédex Component
- [ ] List loads with Pokémon
- [ ] Can scroll through list
- [ ] Search filters Pokémon
- [ ] Click Pokémon shows details
- [ ] Pagination works (if implemented)
- [ ] Types display with colors
- [ ] Base stats show correctly

### 4. Teams Component
- [ ] Shows 6 team slots
- [ ] Can add Pokémon to team
- [ ] Can remove Pokémon from team
- [ ] Main team is highlighted
- [ ] Can favorite Pokémon
- [ ] Team name editable

### 5. Raids Component
- [ ] Loads active raids list
- [ ] Can filter by tier (1-4 stars)
- [ ] Shows difficulty indicator
- [ ] Shows player count
- [ ] Shows remaining HP
- [ ] Can join raid (button clickable)

### 6. Dungeon Component
- [ ] Shows current floor
- [ ] Shows progress bar (0-50)
- [ ] Shows save point marker
- [ ] Can enter dungeon
- [ ] Can resume dungeon
- [ ] Can reset progress
- [ ] Boss floor shows special icon

### 7. Market Component
- [ ] Three tabs visible: Market, Auction, Trade
- [ ] Market tab shows listings with prices
- [ ] Auction tab shows bid history
- [ ] Trade tab shows trade requests
- [ ] Buy/Bid/Trade buttons functional
- [ ] Price sorting works

### 8. Network Requests

Open browser DevTools (F12) → Network tab:

- [ ] API calls to `http://localhost:5000/api/*`
- [ ] All requests return 200 status
- [ ] No CORS errors
- [ ] JSON responses are valid
- [ ] Latency is < 500ms

### 9. Error Handling
- [ ] Stop server
- [ ] Try to load component
- [ ] Should show error message
- [ ] No unhandled exceptions

### 10. Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Layout adjusts properly
- [ ] Text is readable on all sizes

---

## 🤖 Telegram Bot Testing

### 1. Bot Setup
- [ ] Bot created via @BotFather
- [ ] Bot token copied correctly
- [ ] Added to `.env` as `TELEGRAM_BOT_TOKEN`
- [ ] Commands registered with BotFather

### 2. Bot Startup
```bash
cd bot
npm start
```

**Checklist:**
- [ ] No error on startup
- [ ] Console shows "Bot started"
- [ ] Shows listening for updates

### 3. Bot Commands

In Telegram, search for your bot and test each command:

#### Info Commands
```
/start
Expected: Welcome message, game introduction
[ ] Command responds
[ ] Formatting is correct
[ ] Contains game info

/help
Expected: List of all commands
[ ] All 10+ commands listed
[ ] Descriptions are clear
```

#### User Commands
```
/profile
Expected: User stats, level, currency
[ ] Shows name, level, exp
[ ] Shows currency (coins, gems)
[ ] Shows current team

/teams
Expected: Team overview
[ ] Shows 6 teams
[ ] Main team highlighted
[ ] Shows Pokémon count per team

/pokemon
Expected: Pokémon collection
[ ] Shows owned Pokémon
[ ] Displays stats (level, nature)
[ ] Can select for details
```

#### Adventure Commands
```
/encounter
Expected: Wild Pokémon encounter
[ ] Shows random Pokémon
[ ] Shows catch probability
[ ] Can attempt to catch

/raid
Expected: Active raids list
[ ] Shows 3-5 active raids
[ ] Shows tier, boss, players
[ ] Can join raid with button

/dungeon
Expected: Dungeon status
[ ] Shows current floor
[ ] Shows progress to floor 50
[ ] Can enter or resume
```

#### Social Commands
```
/market
Expected: Market overview
[ ] Shows buy/sell listings
[ ] Shows prices
[ ] Can buy/sell

/faction
Expected: Faction/Guild info
[ ] Shows your faction
[ ] Shows faction members
[ ] Can apply to faction

/mail
Expected: Messages
[ ] Shows new messages
[ ] Can claim rewards
[ ] Expired mail removed
```

### 4. Bot Data Consistency

**Test:** Modify data in client, check bot shows same data

```bash
# In browser client:
# 1. Create a Pokémon/Add to team

# In Telegram bot:
# 2. Type /pokemon - should show new Pokémon
# 3. Type /teams - should show in team
```

**Checklist:**
- [ ] Bot fetches fresh data from server
- [ ] Data matches between client and bot
- [ ] No stale data issues
- [ ] Updates reflect immediately

### 5. Bot Error Handling
- [ ] Invalid commands show help
- [ ] Network errors show message
- [ ] Timeouts are handled gracefully
- [ ] No bot crashes

---

## 🔐 Security Testing

### 1. Environment Variables
- [ ] `.env` files exist and are filled
- [ ] `.env` is in `.gitignore`
- [ ] No secrets in code
- [ ] No secrets in commits (check git log)

### 2. API Authentication (if implemented)
- [ ] Can't access user routes without token
- [ ] Can't access admin routes as regular user
- [ ] Tokens expire after set time
- [ ] Invalid tokens rejected

### 3. Database Security
- [ ] MongoDB whitelist configured
- [ ] Credentials are strong
- [ ] No hardcoded credentials in code
- [ ] Connection string uses environment variable

### 4. CORS Configuration
- [ ] Only allow localhost:3000 in development
- [ ] Proper headers returned
- [ ] No wildcard CORS in production

---

## 📊 Performance Testing

### 1. Server Load Time
```bash
time curl http://localhost:5000/api/pokedex
```

**Expected:** < 500ms for all requests

### 2. Client Load Time
- [ ] Page load: < 3 seconds
- [ ] First paint: < 1 second
- [ ] Interactive: < 5 seconds

Use Chrome DevTools Lighthouse for detailed report.

### 3. Database Queries
- [ ] Searching 151 Pokémon: < 100ms
- [ ] Listing teams (6): < 50ms
- [ ] Getting user profile: < 100ms
- [ ] Market search: < 200ms

### 4. Memory Usage
```bash
# Monitor while running
top -p $(pgrep -f "node")
```

- [ ] Server uses < 200MB RAM
- [ ] No memory leaks (stable over time)
- [ ] No growing memory usage

---

## 📋 Integration Testing

### 1. Full Game Flow
1. [ ] Start app
2. [ ] Create user
3. [ ] Browse Pokédex
4. [ ] Add Pokémon to team
5. [ ] Manage teams
6. [ ] Join a raid
7. [ ] Enter dungeon
8. [ ] Access market
9. [ ] Create guild/faction
10. [ ] Check mail

**All steps should succeed with no errors**

### 2. Multi-User Testing
- [ ] Create 2+ users
- [ ] Each user has separate data
- [ ] Market trading between users works
- [ ] Raid with multiple players works
- [ ] Guild/faction with members works

### 3. Data Persistence
- [ ] Restart server
- [ ] Data is still there
- [ ] User data saved correctly
- [ ] Teams preserved
- [ ] Pokémon collection preserved

---

## 📝 Final Checklist

Before deploying to production:

### Code Quality
- [ ] No console errors
- [ ] No console warnings
- [ ] All endpoints documented
- [ ] Error handling on all routes
- [ ] Input validation on all endpoints

### Documentation
- [ ] README.md complete
- [ ] API docs accurate
- [ ] Setup guide updated
- [ ] Deployment guide ready
- [ ] Troubleshooting guide included

### Testing
- [ ] All tests pass locally
- [ ] Manual testing complete
- [ ] Integration tests pass
- [ ] Security checks pass
- [ ] Performance acceptable

### Deployment
- [ ] GitHub repository created
- [ ] MongoDB Atlas cluster ready
- [ ] Telegram Bot token ready
- [ ] Environment variables prepared
- [ ] .gitignore configured
- [ ] No secrets in code

### Production Ready
- [ ] Can recreate setup from scratch
- [ ] Documentation is clear
- [ ] Team can maintain it
- [ ] Monitoring is set up
- [ ] Backups are configured

---

## 🆘 Troubleshooting

### Server won't start
- Check MongoDB is running
- Check port 5000 is not in use
- Check `.env` file exists
- Check `MONGODB_URI` is valid

### Client won't load
- Check server is running
- Check `REACT_APP_API_URL` in client `.env`
- Check for CORS errors in DevTools
- Clear browser cache

### Bot won't respond
- Check bot token is correct
- Check server is running and responding
- Check internet connection
- Try restarting bot

### MongoDB connection timeout
- Check MongoDB Atlas whitelist IP
- Check connection string format
- Try adding `?retryWrites=true&w=majority`
- Check credentials are correct

---

Good luck with testing! 🧪🎮

Next: Push to GitHub and deploy to cloud!
