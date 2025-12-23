const mongoose = require('mongoose');

const DungeonProgressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  currentFloor: {
    type: Number,
    default: 1,
  },
  lastSaveFloor: {
    type: Number,
    default: 1,
  },
  currentTeam: [mongoose.Schema.Types.ObjectId],
  randomStatus: String,
  status: {
    type: String,
    enum: ['none', 'in-progress', 'paused'],
    default: 'none',
  },
  entryFeesPaid: {
    type: Number,
    default: 0,
  },
  bestClear: Number,
  fastestClearTime: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('DungeonProgress', DungeonProgressSchema);
