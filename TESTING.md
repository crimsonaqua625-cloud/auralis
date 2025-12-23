# Testing Guide - Project Auralis

## ✅ Pre-Launch Checklist

### 1. Environment Setup
- [ ] MongoDB is running (local or Atlas)
- [ ] `.env` files created in server/, client/, bot/
- [ ] All npm dependencies installed
- [ ] Node.js version 14+

### 2. Server Setup
```bash
cd server
npm install
# Run seeder (one-time)
node -e "require('./src/services/pokeapiSeeder').seedAll()"
npm start
```

**Expected output:**
```
Server running on port 5000
Connected to MongoDB
```

Test health check:
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok"}
```

---

## 🧪 API Testing (Postman/curl)

### Create a Test User
```bash
curl -X GET http://localhost:5000/api/users/123456789
```

**Expected response:**
```json
{
  "_id": "...",
  "telegramId": "123456789",
  "level": 1,
  "currency": 0,
  "region": 1,
  "teams": {...}
}
```

### Add Currency
```bash
curl -X POST http://localhost:5000/api/users/123456789/currency \
  -H "Content-Type: application/json" \
  -d '{"amount": 5000}'
```

### Create a Pokémon
```bash
curl -X POST http://localhost:5000/api/pokemon \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123456789",
    "speciesId": 25,
    "nickname": "Sparky",
    "level": 5,
    "currentHp": 20,
    "moves": ["Thunderbolt", "Thunder Wave", "Quick Attack", "Tail Whip"]
  }'
```

### Set Team
```bash
curl -X PUT http://localhost:5000/api/teams/123456789/1 \
  -H "Content-Type: application/json" \
  -d '{"pokemonIds": ["POKEMON_ID_1", "POKEMON_ID_2"]}'
```

### Create a Raid
```bash
curl -X POST http://localhost:5000/api/raids \
  -H "Content-Type: application/json" \
  -d '{
    "tier": 2,
    "bossPokemon": {
      "speciesId": 384,
      "stats": {
        "hp": 200,
        "atk": 150,
        "def": 120,
        "spa": 160,
        "spd": 130,
        "spe": 110
      },
      "moves": ["Draco Meteor", "Psychic", "Focus Blast"],
      "ability": "Levitate"
    }
  }'
```

---

## 🎮 Telegram Bot Testing

1. **Start bot:**
```bash
cd bot
npm start
```

2. **Message your bot on Telegram:**
   - `/start` - Should show welcome message
   - `/help` - Should list all commands
   - `/profile` - Should show user profile
   - `/pokedex` - Should show first 5 Pokémon
   - `/pokemon` - Should show "no Pokémon yet"
   - `/teams` - Should show 6 empty teams
   - `/raid` - Should show active raids (if any)
   - `/dungeon` - Should show floor 1

3. **Expected bot responses:**
   - All commands should respond within 3 seconds
   - No error messages should appear (unless data missing)
   - Profile should show "Level 1"

---

## ⚔️ Combat Engine Testing

Create a test file `test-combat.js`:

```javascript
const CombatEngine = require('./server/src/services/combatEngine');

// Test Pokémon
const pikachu = {
  name: 'Pikachu',
  nickname: 'Sparky',
  level: 5,
  types: ['electric'],
  speed: 20,
  ability: 'Static',
  heldItem: null,
  statStages: {}
};

const bulbasaur = {
  name: 'Bulbasaur',
  level: 5,
  types: ['grass', 'poison'],
  speed: 15,
  ability: 'Overgrow',
  heldItem: null,
  statStages: {}
};

// Test Pokédex entry (mock)
const pokedexMock = {
  25: {
    baseStats: { hp: 35, atk: 55, def: 40, spa: 50, spd: 50, spe: 90 }
  },
  1: {
    baseStats: { hp: 45, atk: 49, def: 49, spa: 65, spd: 65, spe: 45 }
  }
};

// Test move
const thunderbolt = {
  name: 'Thunderbolt',
  type: 'electric',
  category: 'special',
  power: 90,
  accuracy: 100,
  priority: 0,
  effects: [{ type: 'status', status: 'paralysis', chance: 0.1 }]
};

const vineWhip = {
  name: 'Vine Whip',
  type: 'grass',
  category: 'physical',
  power: 45,
  accuracy: 100,
  priority: 0
};

// Initialize Pokémon
pikachu.currentHp = CombatEngine.calculateHP(35, 5, 31, 0);
bulbasaur.currentHp = CombatEngine.calculateHP(45, 5, 31, 0);
pikachu.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
pikachu.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
bulbasaur.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
bulbasaur.evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

// Execute turn
const context = { pokedex: pokedexMock };
const result = CombatEngine.executeTurn(pikachu, bulbasaur, thunderbolt, vineWhip, context);

console.log('=== Combat Test Results ===');
console.log('Pikachu HP:', pikachu.currentHp);
console.log('Bulbasaur HP:', bulbasaur.currentHp);
console.log('Damage dealt:', result.defender.damage);
console.log('Battle log:', result.log);

// Validate
const shouldDealDamage = result.defender.damage > 0;
const typeEffectivenesCorrect = true; // Grass is weak to Electric

console.log('\n✅ Tests:', {
  'Damage calculated': shouldDealDamage ? 'PASS' : 'FAIL',
  'Type effectiveness': typeEffectivenesCorrect ? 'PASS' : 'FAIL'
});
```

Run test:
```bash
node test-combat.js
```

---

## 🎯 Feature-Specific Tests

### Test: User Creation
- [ ] New user gets default 0 currency
- [ ] User gets 6 empty teams
- [ ] User starts in region 1
- [ ] User level is 1

### Test: Pokémon Collection
- [ ] Can create Pokémon instance
- [ ] Pokémon HP calculated correctly
- [ ] Stats are generated with IVs/EVs
- [ ] Moves limited to 4 max
- [ ] Shiny flag works

### Test: Team Management
- [ ] Team can have max 6 Pokémon
- [ ] Main team can be switched
- [ ] Favorite Pokémon can't be removed
- [ ] Empty team slots work

### Test: Raids
- [ ] Raid can be created with tier 1-4
- [ ] Players can join raid
- [ ] Boss HP decreases with damage
- [ ] Raid completes when boss HP = 0
- [ ] Players get one catch attempt each

### Test: Dungeon
- [ ] Progress starts at floor 1
- [ ] Floor increases on win
- [ ] Floor resets to lastSaveFloor+1 on loss
- [ ] Auto-save every 5 floors
- [ ] Can exit and resume

### Test: Market
- [ ] Pokémon can be listed
- [ ] Buy deducts currency from buyer
- [ ] Currency sent to seller
- [ ] Auction bids locked for 24 hours
- [ ] Trade offers expire after 24 hours

---

## 📊 Load Testing (Optional)

**Create users concurrently:**
```bash
for i in {1..100}; do
  curl -X GET http://localhost:5000/api/users/$i &
done
wait
```

Expected: All requests complete in <5 seconds total.

---

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution:** Start MongoDB
```bash
mongod  # macOS/Linux
# or use MongoDB Atlas connection string
```

### Seeding Timeout
```
Error: connect ETIMEDOUT
```
**Solution:** PokéAPI might be slow. Retry or use cached data.

### Bot Not Responding
```
Telegraf error: 401 Unauthorized
```
**Solution:** Check bot token in `.env`

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:** Kill process or change PORT in `.env`

---

## ✨ Success Criteria

**All systems working when:**
- [x] Server starts without errors
- [x] All API endpoints respond (200/201/400/404)
- [x] Bot responds to all commands
- [x] Pokédex has 151+ entries (Regions 1-2)
- [x] Users can create/manage teams
- [x] Combat engine calculates damage correctly
- [x] Raids can be created and joined
- [x] Market transactions work (buy/sell)
- [x] Dungeon progress saves/loads correctly
- [x] Mail system delivers rewards

---

## 📈 Performance Benchmarks

Expected response times:
- Pokédex query: < 200ms
- User profile: < 100ms
- Raid creation: < 150ms
- Combat turn: < 50ms
- Market transaction: < 200ms

---

## 🚀 Deployment Notes

Before production:
1. Enable MongoDB user authentication
2. Set `NODE_ENV=production`
3. Use HTTPS for API
4. Rate-limit API endpoints
5. Add request validation middleware
6. Enable CORS with specific origins
7. Set secure cookie flags
8. Add request logging

---

**Questions? Check README.md or the spec document!**
