# Project Auralis - Pokémon Bot Game

A fully-featured Pokémon-based game built with Express, MongoDB, React, and Telegram Bot API. Playable entirely through a bot interface with no external wikis or resources needed.

## 🎮 Features Implemented (Phase 1)

### Core Systems
- **Pokédex** - Browse all Region 1-2 Pokémon with stats, types, abilities
- **Pokémon Collection** - Catch, level, evolve, and manage Pokémon
- **Teams** - Create up to 6 teams with 6 Pokémon each
- **Combat Engine** - Accurate turn-based battle system with:
  - Damage formula (STAB, type effectiveness, crits)
  - Status effects (burn, poison, paralysis, sleep, freeze)
  - Weather system
  - Abilities and held items
  - Accuracy and evasion
  - Stat stage modifications (-6 to +6)

### PvE Content
- **Encounters** - Find and catch wild Pokémon
- **Exploration** - Search areas for items and currency
- **Trainers** - Dynamic AI teams based on region/difficulty
- **Gym System** - 8 gyms per region with scaling difficulty
- **Raids** - 4-tier cooperative boss battles (1★-4★)
- **Dungeon** - 50-floor roguelike with save points, random status effects
- **Destination System** - Story-driven progression through regions

### Economy & Trading
- **PokéMarket** - Central trading hub with three subsystems:
  - **Market** - Fixed-price buy/sell Pokémon
  - **Auction House** - Time-limited bidding with bid locks
  - **Trade Center** - P2P Pokémon-for-Pokémon trades
- **Currency System** - Standard and premium currency
- **Mail System** - Reward delivery (7-14 day expiry)
- **Items & Bag** - Unlimited inventory with 6 categories

### Social Features
- **Factions** - Guild-like groups with:
  - Predefined faction types
  - Leader, Vice Leader, Member roles
  - Membership caps (50 or 100 based on tier)
  - Join cooldowns to discourage hopping

### Other
- **EV Training** - Time-based stat training with cap validation
- **Day Care** - Passive Pokémon leveling and breeding
- **Safari Zone** - Region-specific capture system
- **Leaderboard** - Dungeon speedrun rankings

---

## 📁 Project Structure

```
Auralis/
├── server/
│   ├── src/
│   │   ├── app.js                 # Express server & routes
│   │   ├── models/
│   │   │   ├── User.js            # User data model
│   │   │   ├── PokemonInstance.js # Individual Pokémon
│   │   │   ├── Pokedex.js         # Pokédex entry
│   │   │   ├── Faction.js         # Faction data
│   │   │   ├── Raid.js            # Raid instance
│   │   │   ├── DungeonProgress.js # Dungeon progress
│   │   │   ├── Item.js            # Item templates
│   │   │   ├── Mail.js            # Mail messages
│   │   │   ├── MarketListing.js   # Market listings
│   │   │   ├── AuctionListing.js  # Auction listings
│   │   │   ├── TradeListing.js    # Trade listings
│   │   │   └── Move.js            # Move data
│   │   ├── routes/
│   │   │   ├── user.js            # User endpoints
│   │   │   ├── pokemon.js         # Pokémon endpoints
│   │   │   ├── pokedex.js         # Pokédex endpoints
│   │   │   ├── team.js            # Team management
│   │   │   ├── faction.js         # Faction endpoints
│   │   │   ├── raid.js            # Raid endpoints
│   │   │   ├── gym.js             # Gym endpoints
│   │   │   ├── dungeon.js         # Dungeon endpoints
│   │   │   ├── market.js          # Market/Auction/Trade
│   │   │   └── mail.js            # Mail endpoints
│   │   └── services/
│   │       ├── combatEngine.js    # Battle logic
│   │       └── pokeapiSeeder.js   # Data seeding
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Pokedex.js         # Pokédex UI
│   │   │   ├── Pokemon.js         # Collection UI
│   │   │   ├── Teams.js           # Team manager UI
│   │   │   ├── Raids.js           # Raid browser UI
│   │   │   ├── Dungeon.js         # Dungeon UI
│   │   │   ├── Market.js          # Market UI
│   │   │   ├── Encounter.js       # Wild encounter UI
│   │   │   ├── Pokedex View.js    # Detail view
│   │   │   └── BagMenu.js         # Inventory UI
│   │   ├── App.js                 # Main app component
│   │   └── index.js               # React entry point
│   └── package.json
│
└── bot/
    ├── index.js                   # Telegram bot commands
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)
- Telegram Bot Token (from BotFather)

### Installation

1. **Clone and install dependencies:**
```bash
cd server
npm install

cd ../client
npm install

cd ../bot
npm install
```

2. **Set up environment variables:**

Create `.env` in `server/`, `client/`, and `bot/`:

**server/.env:**
```
MONGODB_URI=mongodb://localhost:27017/auralis
PORT=5000
```

**bot/.env:**
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
SERVER_URL=http://localhost:5000
```

**client/.env:**
```
REACT_APP_API_URL=http://localhost:5000
```

3. **Seed Pokémon data (one-time):**
```bash
cd server
node -e "require('./src/services/pokeapiSeeder').seedAll()"
```

### Running the Application

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Bot:**
```bash
cd bot
npm start
```

**Terminal 3 - Client (optional, for web UI):**
```bash
cd client
npm start
```

The server will run on `http://localhost:5000`.  
The bot will connect to Telegram and be ready for commands.

---

## 📋 API Endpoints

### Users
- `GET /api/users/:telegramId` - Get user profile
- `PUT /api/users/:telegramId` - Update user data
- `POST /api/users/:telegramId/currency` - Add currency

### Pokémon
- `GET /api/pokemon/user/:telegramId` - Get user's Pokémon
- `GET /api/pokemon/:instanceId` - Get single Pokémon
- `POST /api/pokemon` - Create new Pokémon
- `PUT /api/pokemon/:instanceId` - Update Pokémon
- `POST /api/pokemon/:instanceId/heal` - Heal Pokémon

### Pokédex
- `GET /api/pokedex` - Get Pokédex entries (paginated)
- `GET /api/pokedex/:speciesId` - Get single entry
- `GET /api/pokedex/search/:name` - Search by name

### Teams
- `GET /api/teams/:telegramId` - Get all teams
- `PUT /api/teams/:telegramId/:teamId` - Update team
- `POST /api/teams/:telegramId/main/:teamId` - Set main team
- `POST /api/teams/:telegramId/favorite/:pokemonId` - Toggle favorite

### Raids
- `GET /api/raids` - Get active raids
- `POST /api/raids` - Create raid
- `POST /api/raids/:raidId/join` - Join raid
- `POST /api/raids/:raidId/attack` - Deal damage

### Dungeon
- `GET /api/dungeons/:telegramId` - Get progress
- `POST /api/dungeons/:telegramId/enter` - Enter dungeon
- `POST /api/dungeons/:telegramId/floor/:floorNumber` - Battle floor
- `POST /api/dungeons/:telegramId/exit` - Pause dungeon
- `POST /api/dungeons/:telegramId/reset` - Reset progress

### Market
- `GET /api/market/market` - Get market listings
- `POST /api/market/market/list` - List Pokémon
- `POST /api/market/market/buy/:listingId` - Buy Pokémon
- `GET /api/market/auction` - Get auctions
- `POST /api/market/auction/create` - Create auction
- `POST /api/market/auction/:auctionId/bid` - Bid on auction
- `GET /api/market/trade` - Get trade listings
- `POST /api/market/trade/:listingId/request` - Send trade offer

### Mail
- `GET /api/mail/:telegramId` - Get mail
- `PUT /api/mail/:mailId/read` - Mark as read
- `POST /api/mail/:mailId/claim` - Claim contents

---

## 🤖 Telegram Bot Commands

```
/start         - Welcome message
/help          - Show all commands
/profile       - View your profile
/pokedex       - Browse Pokédex
/pokemon       - View your Pokémon
/teams         - Manage teams
/bag           - View inventory
/raid          - View active raids
/dungeon       - Check dungeon progress
/market        - Browse PokéMarket
/faction       - View factions
/mail          - Check mail
/settings      - Change settings
```

---

## ⚔️ Combat System Details

### Damage Formula
```
Damage = (((2 × Level / 5 + 2) × Power × Attack / Defense) / 50 + 2) × Modifiers
```

**Modifiers applied:**
- STAB (1.5×)
- Type effectiveness (0.25x - 2×)
- Critical hits (1.5×)
- Weather effects
- Held items
- Abilities
- Random variance (85%-100%)

### Type Effectiveness
Fully implemented Gen 8 type matchups (18 types).

### Status Effects
- **Burn** - 1/8 HP per turn, reduces physical attack
- **Poison** - 1/8 HP per turn
- **Bad Poison** - Increasing damage per turn
- **Paralysis** - Reduces speed, chance to fail move
- **Sleep** - Cannot act for 1-3 turns
- **Freeze** - Chance to thaw each turn

### Stat Stages
Range from -6 to +6 with multipliers:
- -6: 0.25×
- +6: 4×

---

## 📊 Data Models

### Pokémon Instance
```javascript
{
  userId: String,
  speciesId: Number,
  nickname: String,
  level: Number,
  experience: Number,
  nature: String,
  shiny: Boolean,
  gender: String,
  currentHp: Number,
  status: String,
  moves: [String], // Max 4
  evs: {hp, atk, def, spa, spd, spe},
  ivs: {hp, atk, def, spa, spd, spe},
  readyToEvolve: Boolean,
  ability: String,
  heldItem: String
}
```

### User
```javascript
{
  telegramId: String,
  username: String,
  level: Number,
  currency: Number,
  premiumCurrency: Number,
  faction: ObjectId,
  mainTeamId: Number,
  teams: Map<1-6, [PokemonIds]>,
  favorites: [PokemonId],
  raidTickets: Number,
  region: Number,
  dungeonProgress: {
    currentFloor: Number,
    lastSaveFloor: Number,
    status: String
  }
}
```

---

## 🔄 Development Workflow

1. **Data Seeding** - Run seeder once to populate Pokédex
2. **Server Tests** - Test API endpoints with Postman/curl
3. **Bot Tests** - Command testing in Telegram
4. **UI Tests** - React component testing (optional for Phase 1)

---

## 📝 Phase 1 Locks & Decisions

**Fixed for Phase 1:**
- Generation 8 baseline (Mega/Z-Moves excluded)
- 1.5× crit multiplier (not 2×)
- Unified Pokédex (no progressive unlocks yet)
- Market for Pokémon only (no items/boxes yet)
- No PvP battles
- No breeding mechanics (placeholder)

**Planned for Phase 2+:**
- Faction raids & bonuses
- PvP system
- Mega Evolution / Dynamax
- Improved trading restrictions
- Item crafting

---

## 🐛 Known Limitations

- Raid event system is simplified
- Gym AI has basic logic (can be enhanced)
- Dungeon random status generation needs weighting
- Some edge cases in market fees/taxes not fully handled
- No image/sprite assets in Phase 1

---

## 📦 Dependencies

**Server:**
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `axios` - HTTP client (PokéAPI)
- `cors` - CORS middleware
- `dotenv` - Environment variables

**Bot:**
- `telegraf` - Telegram Bot API
- `axios` - HTTP client

**Client:**
- `react` - UI framework
- `react-scripts` - Build tools
- `@telegram-apps/sdk-react` - Telegram Web App SDK

---

## 📄 License

MIT

---

## 🎯 Next Steps (Phase 2)

- Implement faction raids with multiplier bonuses
- Add PvP system with ranking
- Integrate breeding with IV/EV inheritance
- Add Mega Evolution mechanics
- Implement item trading in market
- Enhanced AI for gym leaders
- Seasonal events & limited-time raids
- Mobile app wrapper

---

**Built with ❤️ for Pokémon fans worldwide**
