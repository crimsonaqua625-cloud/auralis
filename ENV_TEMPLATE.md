# Environment Configuration Templates

## server/.env

```env
# Database
MONGODB_URI=mongodb://localhost:27017/auralis
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auralis

# Server
PORT=5000
NODE_ENV=development

# API Configuration
API_VERSION=1.0
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# Game Configuration
MAX_TEAMS_PER_PLAYER=6
POKEMON_PER_TEAM=6
MAX_MOVES_PER_POKEMON=4

# Economy
STARTING_CURRENCY=0
STARTING_PREMIUM_CURRENCY=0
RAID_TICKET_DAILY_REFRESH=1
RAID_TICKET_COST=1
DUNGEON_ENTRY_FEE=500

# Market Fees
MARKET_LISTING_FEE_PERCENT=5
MARKET_SALE_TAX_PERCENT=10
AUCTION_MIN_INCREMENT_PERCENT=5
TRADE_REQUEST_FEE=100

# Raid Configuration
RAID_TIERS_ENABLED=1,2,3,4
RAID_MAX_PLAYERS_PER_TIER=10
RAID_MIN_PLAYERS_TO_START=2
RAID_TURN_LIMIT=10

# Dungeon Configuration
DUNGEON_TOTAL_FLOORS=50
DUNGEON_SAVE_INTERVAL=5
DUNGEON_ENTRY_FEE=1000
DUNGEON_BOSS_FLOORS=10,20,30,40,50,25

# Combat
CRIT_MULTIPLIER=1.5
STAB_MULTIPLIER=1.5
WEATHER_BOOST=1.5
ABILITY_BOOST=1.2

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/server.log

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:8000
```

---

## bot/.env

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN_HERE

# Server
SERVER_URL=http://localhost:5000
API_TIMEOUT=10000

# Bot Configuration
BOT_NAME=Auralis
WELCOME_MESSAGE=Welcome to Auralis!
BOT_ADMIN_ID=YOUR_ADMIN_ID

# Feature Flags
FEATURE_RAIDS=true
FEATURE_DUNGEONS=true
FEATURE_PVPBATTLES=false
FEATURE_BREEDING=false

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/bot.log

# Webhook (if using webhook instead of polling)
# WEBHOOK_URL=https://yourdomain.com/webhook
# WEBHOOK_PORT=3001
```

---

## client/.env

```env
# API
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=10000

# App
REACT_APP_NAME=Auralis
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# Features
REACT_APP_ENABLE_PWA=false
REACT_APP_ENABLE_OFFLINE=false

# Telegram Web App (if using)
REACT_APP_TELEGRAM_BOT_ID=YOUR_BOT_ID
```

---

## Production Recommendations

### server/.env (Production)

```env
# Database
MONGODB_URI=mongodb+srv://prod_user:prod_password@cluster.mongodb.net/auralis?retryWrites=true&w=majority

# Server
PORT=8000
NODE_ENV=production

# Security
JWT_SECRET=your_jwt_secret_key_here_very_long_and_random
SESSION_SECRET=your_session_secret_key_here_very_long_and_random

# Rate Limiting
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS
CORS_ORIGIN=https://yourdomain.com

# SSL/TLS
SSL_CERT_PATH=/etc/ssl/certs/cert.pem
SSL_KEY_PATH=/etc/ssl/private/key.pem

# Logging
LOG_LEVEL=warn
LOG_FILE=/var/log/auralis/server.log
```

### bot/.env (Production)

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_production_bot_token_here

# Server
SERVER_URL=https://api.yourdomain.com

# Webhook
WEBHOOK_URL=https://yourdomain.com/webhook
WEBHOOK_SECRET=your_webhook_secret_here

# Monitoring
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Logging
LOG_LEVEL=warn
LOG_FILE=/var/log/auralis/bot.log
```

### client/.env (Production)

```env
# API
REACT_APP_API_URL=https://api.yourdomain.com

# App
REACT_APP_ENVIRONMENT=production

# Features
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_OFFLINE=true

# Analytics
REACT_APP_GA_ID=UA-XXXXXXXXX-X
```

---

## Docker Configuration (Optional)

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  server:
    build: ./server
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/auralis?authSource=admin
      NODE_ENV: production
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb

  bot:
    build: ./bot
    environment:
      TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN}
      SERVER_URL: http://server:5000
    depends_on:
      - server

  client:
    build: ./client
    environment:
      REACT_APP_API_URL: http://server:5000
    ports:
      - "3000:3000"
    depends_on:
      - server

volumes:
  mongo_data:
```

---

## nginx Configuration (Reverse Proxy)

### nginx.conf

```nginx
upstream auralis_api {
    server localhost:5000;
}

upstream auralis_client {
    server localhost:3000;
}

server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;

    # API Proxy
    location /api {
        proxy_pass http://auralis_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # Add security headers
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Client Proxy
    location / {
        proxy_pass http://auralis_client;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

---

## Environment Variables Checklist

### Required for Development
- [ ] `MONGODB_URI`
- [ ] `TELEGRAM_BOT_TOKEN`
- [ ] `PORT` (server)
- [ ] `REACT_APP_API_URL` (client)

### Recommended for Production
- [ ] `JWT_SECRET` (authentication)
- [ ] `SESSION_SECRET` (sessions)
- [ ] `SSL_CERT_PATH` & `SSL_KEY_PATH`
- [ ] `SENTRY_DSN` (error tracking)
- [ ] `CORS_ORIGIN` (security)
- [ ] `NODE_ENV=production`

### Optional
- [ ] Logging paths
- [ ] Rate limiting
- [ ] Feature flags
- [ ] Analytics tokens

---

## Notes

- **Never commit .env files** to version control
- Use `.env.example` template for developers
- Rotate secrets regularly
- Use password manager for production tokens
- Enable MongoDB authentication in production
- Use HTTPS in production
- Set appropriate rate limits
- Monitor API performance
- Enable logging for debugging

---

For more info, see QUICKSTART.md and README.md
