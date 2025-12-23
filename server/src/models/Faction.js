const mongoose = require('mongoose');

const FactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  predefined: {
    type: Boolean,
    default: true,
  },
  stars: {
    type: Number,
    enum: [1, 3],
    default: 1,
  },
  leaderId: {
    type: String,
    ref: 'User',
  },
  viceLeaderIds: [
    {
      type: String,
      ref: 'User',
    },
  ],
  memberIds: [
    {
      type: String,
      ref: 'User',
    },
  ],
  maxMembers: {
    type: Number,
    default: 50,
  },
  createdViaCard: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Faction', FactionSchema);
