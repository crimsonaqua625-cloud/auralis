const mongoose = require('mongoose');

const MoveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  type: String,
  category: {
    type: String,
    enum: ['physical', 'special', 'status'],
  },
  power: Number,
  accuracy: Number,
  priority: {
    type: Number,
    default: 0,
  },
  pp: Number,
  effects: [
    {
      type: String,
      chance: Number,
      target: String, // 'self', 'opponent', 'user'
      value: mongoose.Schema.Types.Mixed,
    },
  ],
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Move', MoveSchema);
