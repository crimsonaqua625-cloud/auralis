const express = require('express');
const router = express.Router();
const Pokedex = require('../models/Pokedex');

// Get all Pokedex entries (paginated)
router.get('/', async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const entries = await Pokedex.find()
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const total = await Pokedex.countDocuments();
    res.json({
      entries,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single Pokedex entry
router.get('/:speciesId', async (req, res) => {
  try {
    const entry = await Pokedex.findOne({ speciesId: req.params.speciesId });
    if (!entry) return res.status(404).json({ error: 'Not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search Pokedex
router.get('/search/:name', async (req, res) => {
  try {
    const results = await Pokedex.find({ name: new RegExp(req.params.name, 'i') });
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
