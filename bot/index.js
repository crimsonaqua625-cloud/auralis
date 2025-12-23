const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:5000';

// ====== COMMAND HANDLERS ======

// Start command
bot.start((ctx) => {
  ctx.reply(`Welcome to Auralis! A Pokémon-based adventure game.\n\n
Use /help to see all commands.`);
});

// Help command
bot.help((ctx) => {
  const helpText = `
📚 **Auralis Commands:**

🎮 **Main**
/profile - View your profile
/pokedex - Browse all Pokémon
/pokemon - View your Pokémon collection
/teams - Manage your teams
/bag - View your inventory

⚔️ **Battle & Adventure**
/encounter - Find wild Pokémon
/explore - Explore an area for items
/raid - View and join raids
/gym - Challenge Gym Leaders
/dungeon - Enter the Dungeon

💰 **Market & Trading**
/market - Browse PokéMarket
/auction - View auctions
/trade - Send trade offers

👥 **Social**
/faction - View factions
/leaderboard - View leaderboards
/mail - Check your mail

🛠️ **Settings**
/help - Show this message
/settings - Change settings
`;
  ctx.reply(helpText, { parse_mode: 'Markdown' });
});

// Profile command
bot.command('profile', async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const response = await axios.get(`${SERVER_URL}/api/users/${userId}`);
    const user = response.data;

    const profile = `
👤 **Profile**
ID: ${user._id}
Username: ${user.username || 'Not set'}
Level: ${user.level}

💰 Currency: ${user.currency}
💎 Premium: ${user.premiumCurrency}

🎮 Region: ${user.region}
📊 Raid Tickets: ${user.raidTickets}
👥 Faction: ${user.faction || 'None'}
    `;

    ctx.reply(profile, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load profile.');
    console.error(error);
  }
});

// Pokédex command
bot.command('pokedex', async (ctx) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/pokedex?limit=5`);
    const { entries } = response.data;

    let message = '📖 **Pokédex** (First 5 entries)\n\n';
    entries.forEach((entry) => {
      message += `#${entry.speciesId} **${entry.name}** - ${entry.types?.join('/')}\n`;
      message += `HP: ${entry.baseStats?.hp} | ATK: ${entry.baseStats?.atk} | DEF: ${entry.baseStats?.def}\n\n`;
    });

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load Pokédex.');
    console.error(error);
  }
});

// My Pokémon command
bot.command('pokemon', async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const response = await axios.get(`${SERVER_URL}/api/pokemon/user/${userId}`);
    const pokemon = response.data;

    if (pokemon.length === 0) {
      ctx.reply('You don\'t have any Pokémon yet! Use /encounter to find some.');
      return;
    }

    let message = `🎮 **My Pokémon** (${pokemon.length})\n\n`;
    pokemon.forEach((p, i) => {
      message += `${i + 1}. ${p.nickname || `Pokémon #${p.speciesId}`} - Lvl ${p.level}`;
      if (p.shiny) message += ' ✨';
      message += '\n';
    });

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load Pokémon.');
    console.error(error);
  }
});

// Teams command
bot.command('teams', async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const response = await axios.get(`${SERVER_URL}/api/teams/${userId}`);
    const { mainTeamId, teams } = response.data;

    let message = `👥 **Teams**\n\n`;
    message += `Main Team: **Team ${mainTeamId}**\n\n`;

    for (let i = 1; i <= 6; i++) {
      const teamSize = teams[i]?.length || 0;
      const marker = i === mainTeamId ? '⭐' : '　';
      message += `${marker} Team ${i}: ${teamSize}/6 Pokémon\n`;
    }

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load teams.');
    console.error(error);
  }
});

// Mail command
bot.command('mail', async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const response = await axios.get(`${SERVER_URL}/api/mail/${userId}`);
    const mail = response.data;

    if (mail.length === 0) {
      ctx.reply('📭 No mail.');
      return;
    }

    let message = `📬 **Mail** (${mail.length})\n\n`;
    mail.forEach((m) => {
      const read = m.read ? '📖' : '📬';
      message += `${read} ${m.subject}\n`;
      message += `From: ${m.sender}\n`;
      if (!m.claimed) message += '⚠️ Unclaimed\n';
      message += '\n';
    });

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load mail.');
    console.error(error);
  }
});

// Raids command
bot.command('raid', async (ctx) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/raids`);
    const raids = response.data;

    if (raids.length === 0) {
      ctx.reply('No active raids at the moment.');
      return;
    }

    let message = `⚔️ **Active Raids**\n\n`;
    raids.slice(0, 5).forEach((raid) => {
      const stars = '⭐'.repeat(raid.tier);
      message += `${stars} Tier ${raid.tier} - Boss #${raid.bossPokemon.speciesId}\n`;
      message += `Players: ${raid.currentPlayers}/${raid.maxPlayers}\n`;
      message += `HP: ${raid.bossHp}/${raid.totalBossHp}\n\n`;
    });

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load raids.');
    console.error(error);
  }
});

// Market command
bot.command('market', async (ctx) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/market/market`);
    const listings = response.data;

    if (listings.length === 0) {
      ctx.reply('🛒 No listings on the market.');
      return;
    }

    let message = `🛒 **PokéMarket**\n\n`;
    message += `Listings: ${listings.length}\n`;
    message += `Use /market for more options.\n`;

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load market.');
    console.error(error);
  }
});

// Faction command
bot.command('faction', async (ctx) => {
  try {
    const response = await axios.get(`${SERVER_URL}/api/factions`);
    const factions = response.data;

    let message = `👥 **Factions**\n\n`;
    factions.forEach((f) => {
      message += `**${f.name}**\n`;
      message += `Leader: ${f.leaderId}\n`;
      message += `Members: ${f.memberIds?.length || 0}/${f.maxMembers}\n\n`;
    });

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load factions.');
    console.error(error);
  }
});

// Dungeon command
bot.command('dungeon', async (ctx) => {
  try {
    const userId = ctx.from.id.toString();
    const response = await axios.get(`${SERVER_URL}/api/dungeons/${userId}`);
    const progress = response.data;

    const message = `🏯 **Dungeon**\n\n
Current Floor: ${progress.currentFloor}/50
Last Save: Floor ${progress.lastSaveFloor}
Status: ${progress.status || 'Not entered'}

Use /dungeon from the game to enter!
    `;

    ctx.reply(message, { parse_mode: 'Markdown' });
  } catch (error) {
    ctx.reply('❌ Failed to load dungeon.');
    console.error(error);
  }
});

// Settings command
bot.command('settings', (ctx) => {
  ctx.reply(`⚙️ **Settings**\n\n
Telegram integration: Settings available in-game.
Use /help to see all commands.
  `, { parse_mode: 'Markdown' });
});

// Default handler
bot.on('message', (ctx) => {
  ctx.reply(
    'Unknown command. Use /help to see available commands.'
  );
});

// Error handler
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('❌ An error occurred. Please try again later.');
});

// Launch bot
bot.launch();

console.log('🤖 Telegram bot is running...');

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

module.exports = bot;
