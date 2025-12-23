const express = require('express');
const router = express.Router();
const Pokemon = require('../models/PokemonInstance');
const User = require('../models/User');

// Get all Pokemon for a user
router.get('/user/:telegramId', async (req, res) => {
  try {
    const pokemons = await Pokemon.find({ userId: req.params.telegramId });
    res.json(pokemons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single Pokemon instance
router.get('/:instanceId', async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.instanceId);
    if (!pokemon) return res.status(404).json({ error: 'Not found' });
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new Pokemon instance
router.post('/', async (req, res) => {
  try {
    const pokemon = new Pokemon(req.body);
    await pokemon.save();
    res.status(201).json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Pokemon
router.put('/:instanceId', async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(
      req.params.instanceId,
      req.body,
      { new: true }
    );
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Heal Pokemon
router.post('/:instanceId/heal', async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(
      req.params.instanceId,
      { currentHp: '$baseStats.hp', status: null },
      { new: true }
    );
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
