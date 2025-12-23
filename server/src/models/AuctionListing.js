const mongoose = require('mongoose');

const AuctionListingSchema = new mongoose.Schema({
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
  startingBid: {
    type: Number,
    required: true,
  },
  currentBid: Number,
  currentBidder: String,
  minimumIncrement: {
    type: Number,
    required: true,
  },
  endsAt: {
    type: Date,
    required: true,
  },
  bidLockUntil: Date,
  bids: [
    {
      bidderId: String,
      amount: Number,
      timestamp: Date,
    },
  ],
  status: {
    type: String,
    enum: ['active', 'locked', 'sold', 'cancelled'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('AuctionListing', AuctionListingSchema);
