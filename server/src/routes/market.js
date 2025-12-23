const express = require('express');
const router = express.Router();
const MarketListing = require('../models/MarketListing');
const AuctionListing = require('../models/AuctionListing');
const TradeListing = require('../models/TradeListing');
const Pokemon = require('../models/PokemonInstance');
const User = require('../models/User');

// ====== MARKET (BUY/SELL) ======

// Get market listings
router.get('/market', async (req, res) => {
  try {
    const listings = await MarketListing.find({ active: true }).populate('pokemonInstanceId');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// List Pokemon for sale
router.post('/market/list', async (req, res) => {
  try {
    const { sellerId, pokemonInstanceId, price } = req.body;
    const listing = new MarketListing({
      sellerId,
      pokemonInstanceId,
      price,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buy Pokemon from market
router.post('/market/buy/:listingId', async (req, res) => {
  try {
    const { buyerId } = req.body;
    const listing = await MarketListing.findById(req.params.listingId);

    if (!listing.active) return res.status(400).json({ error: 'Listing not active' });

    const buyer = await User.findOne({ telegramId: buyerId });
    if (buyer.currency < listing.price) {
      return res.status(400).json({ error: 'Insufficient currency' });
    }

    const seller = await User.findOne({ telegramId: listing.sellerId });
    const pokemon = await Pokemon.findById(listing.pokemonInstanceId);

    // Transfer currency
    buyer.currency -= listing.price;
    seller.currency += listing.price;

    // Transfer Pokemon
    pokemon.userId = buyerId;

    // Mark listing as sold
    listing.active = false;
    listing.soldAt = new Date();
    listing.soldTo = buyerId;

    await buyer.save();
    await seller.save();
    await pokemon.save();
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====== AUCTION ======

// Get auctions
router.get('/auction', async (req, res) => {
  try {
    const auctions = await AuctionListing.find({ status: 'active' }).populate('pokemonInstanceId');
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create auction
router.post('/auction/create', async (req, res) => {
  try {
    const { sellerId, pokemonInstanceId, startingBid, durationHours } = req.body;
    const endsAt = new Date(Date.now() + durationHours * 3600000);
    const minimumIncrement = Math.ceil(startingBid * 0.05);

    const auction = new AuctionListing({
      sellerId,
      pokemonInstanceId,
      startingBid,
      currentBid: startingBid,
      minimumIncrement,
      endsAt,
    });
    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bid on auction
router.post('/auction/:auctionId/bid', async (req, res) => {
  try {
    const { bidderId, bidAmount } = req.body;
    const auction = await AuctionListing.findById(req.params.auctionId);

    if (auction.status !== 'active') {
      return res.status(400).json({ error: 'Auction not active' });
    }

    const minBid = auction.currentBid + auction.minimumIncrement;
    if (bidAmount < minBid) {
      return res.status(400).json({ error: `Minimum bid: ${minBid}` });
    }

    const bidder = await User.findOne({ telegramId: bidderId });
    if (bidder.currency < bidAmount) {
      return res.status(400).json({ error: 'Insufficient currency' });
    }

    auction.bids.push({
      bidderId,
      amount: bidAmount,
      timestamp: new Date(),
    });
    auction.currentBid = bidAmount;
    auction.currentBidder = bidderId;
    auction.bidLockUntil = new Date(Date.now() + 24 * 3600000);

    await auction.save();
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====== TRADE CENTER ======

// Get trade listings
router.get('/trade', async (req, res) => {
  try {
    const listings = await TradeListing.find({ active: true }).populate('pokemonInstanceId');
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create trade listing
router.post('/trade/list', async (req, res) => {
  try {
    const { sellerId, pokemonInstanceId } = req.body;
    const listing = new TradeListing({
      sellerId,
      pokemonInstanceId,
    });
    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send trade request
router.post('/trade/:listingId/request', async (req, res) => {
  try {
    const { requesterId, requesterPokemonId } = req.body;
    const listing = await TradeListing.findById(req.params.listingId);

    if (!listing.active) return res.status(400).json({ error: 'Listing not active' });

    listing.tradeRequests.push({
      requesterId,
      requesterPokemonId,
      expiresAt: new Date(Date.now() + 24 * 3600000),
      requestedAt: new Date(),
    });

    await listing.save();
    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept trade request
router.post('/trade/:listingId/accept/:requestIndex', async (req, res) => {
  try {
    const listing = await TradeListing.findById(req.params.listingId);
    const tradeRequest = listing.tradeRequests[req.params.requestIndex];

    if (tradeRequest.status !== 'pending') {
      return res.status(400).json({ error: 'Request not pending' });
    }

    const sellerPokemon = await Pokemon.findById(listing.pokemonInstanceId);
    const buyerPokemon = await Pokemon.findById(tradeRequest.requesterPokemonId);

    // Swap owners
    const tempOwner = sellerPokemon.userId;
    sellerPokemon.userId = buyerPokemon.userId;
    buyerPokemon.userId = tempOwner;

    tradeRequest.status = 'accepted';
    listing.active = false;

    await sellerPokemon.save();
    await buyerPokemon.save();
    await listing.save();

    res.json(listing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
