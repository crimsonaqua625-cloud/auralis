const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true,
  },
  username: String,
  level: {
    type: Number,
    default: 1,
  },
  currency: {
    type: Number,
    default: 0,
  },
  premiumCurrency: {
    type: Number,
    default: 0,
  },
  faction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Faction',
    default: null,
  },
  factionRole: {
    type: String,
    enum: ['Member', 'Vice Leader', 'Leader'],
    default: null,
  },
  mainTeamId: {
    type: Number,
    default: 1,
  },
  teams: {
    type: Map,
    of: [mongoose.Schema.Types.ObjectId],
    default: new Map([
      [1, []],
      [2, []],
      [3, []],
      [4, []],
      [5, []],
      [6, []],
    ]),
  },
  favorites: [mongoose.Schema.Types.ObjectId],
  raidTickets: {
    type: Number,
    default: 1,
  },
  lastRaidTicketRefresh: Date,
  region: {
    type: Number,
    default: 1,
  },
  regionsUnlocked: [Number],
  gymsBeat: [
    {
      region: Number,
      gymIndex: Number,
      tier: Number,
    },
  ],
  dungeonProgress: {
    currentFloor: {
      type: Number,
      default: 1,
    },
    lastSaveFloor: {
      type: Number,
      default: 1,
    },
    currentTeam: [mongoose.Schema.Types.ObjectId],
    status: {
      type: String,
      enum: ['none', 'in-progress', 'paused'],
      default: 'none',
    },
    randomStatus: String,
  },
  mail: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mail',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('User', UserSchema);
