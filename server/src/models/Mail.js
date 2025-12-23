const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    ref: 'User',
  },
  subject: String,
  message: String,
  sender: {
    type: String,
    default: 'System',
  },
  contents: [
    {
      type: String, // Item name or Pokemon instance ID
      quantity: Number,
    },
  ],
  read: {
    type: Boolean,
    default: false,
  },
  claimed: {
    type: Boolean,
    default: false,
  },
  expiresAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Mail', MailSchema);
