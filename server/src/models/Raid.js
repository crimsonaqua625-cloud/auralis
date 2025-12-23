const mongoose = require('mongoose');

const RaidSchema = new mongoose.Schema({
  tier: {
    type: Number,
    enum: [1, 2, 3, 4],
    required: true,
  },
  bossPokemon: {
    speciesId: Number,
    stats: mongoose.Schema.Types.Mixed,
    moves: [String],
    ability: String,
    shiny: Boolean,
  },
  maxPlayers: {
    type: Number,
    default: 10,
  },
  currentPlayers: {
    type: Number,
    default: 0,
  },
  players: [
    {
      userId: String,
      pokemonInstanceId: mongoose.Schema.Types.ObjectId,
      turnsUsed: {
        type: Number,
        default: 0,
      },
      damageDealt: {
        type: Number,
        default: 0,
      },
    },
  ],
  bossHp: Number,
  totalBossHp: Number,
  turnsPerPlayer: {
    type: Number,
    default: 10,
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed', 'failed'],
    default: 'waiting',
  },
  caught: [String], // User IDs who caught the boss
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Raid', RaidSchema);
