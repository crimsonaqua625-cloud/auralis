const mongoose = require('mongoose');

const PokedexSchema = new mongoose.Schema({
  speciesId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: String,
  types: [String],
  baseStats: {
    hp: Number,
    atk: Number,
    def: Number,
    spa: Number,
    spd: Number,
    spe: Number,
  },
  evolutions: [
    {
      speciesId: Number,
      method: String,
      requirement: mongoose.Schema.Types.Mixed,
    },
  ],
  learnableMovesAndLevels: [
    {
      move: String,
      level: Number,
      method: String, // 'level', 'tm', 'breed', etc.
    },
  ],
  abilities: [String],
  region: Number,
  generation: Number,
  height: Number,
  weight: Number,
  description: String,
  cached: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pokedex', PokedexSchema);
