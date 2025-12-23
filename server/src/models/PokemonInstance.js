const mongoose = require('mongoose');

const PokemonInstanceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  speciesId: {
    type: Number,
    required: true,
  },
  nickname: String,
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  nature: String,
  shiny: {
    type: Boolean,
    default: false,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'genderless'],
  },
  currentHp: Number,
  status: {
    type: String,
    enum: ['burn', 'poison', 'badly_poisoned', 'paralysis', 'sleep', 'freeze', null],
    default: null,
  },
  moves: [String], // Max 4 moves
  evs: {
    hp: { type: Number, default: 0 },
    atk: { type: Number, default: 0 },
    def: { type: Number, default: 0 },
    spa: { type: Number, default: 0 },
    spd: { type: Number, default: 0 },
    spe: { type: Number, default: 0 },
  },
  ivs: {
    hp: { type: Number, default: 31 },
    atk: { type: Number, default: 31 },
    def: { type: Number, default: 31 },
    spa: { type: Number, default: 31 },
    spd: { type: Number, default: 31 },
    spe: { type: Number, default: 31 },
  },
  readyToEvolve: {
    type: Boolean,
    default: false,
  },
  fainted: {
    type: Boolean,
    default: false,
  },
  ability: String,
  heldItem: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pokemon', PokemonInstanceSchema);
