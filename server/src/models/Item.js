const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['medicine', 'tms', 'held_items', 'battle_items', 'pokeballs', 'other'],
    required: true,
  },
  tier: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 1,
  },
  description: String,
  effect: mongoose.Schema.Types.Mixed,
  price: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Item', ItemSchema);
