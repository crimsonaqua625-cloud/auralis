const mongoose = require('mongoose');

const TradeListingSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  pokemonInstanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pokemon',
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  tradeRequests: [
    {
      requesterId: String,
      requesterPokemonId: mongoose.Schema.Types.ObjectId,
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'expired'],
        default: 'pending',
      },
      expiresAt: Date,
      requestedAt: Date,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TradeListing', TradeListingSchema);
