const mongoose = require('mongoose');

const MarketListingSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
    ref: 'User',
  },
  pokemonInstanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pokemon',
  },
  price: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  soldAt: Date,
  soldTo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('MarketListing', MarketListingSchema);
