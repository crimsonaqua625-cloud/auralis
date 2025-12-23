const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all teams for a user
router.get('/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId }).populate('teams');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      mainTeamId: user.mainTeamId,
      teams: user.teams,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single team
router.get('/:telegramId/:teamId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId }).populate(
      `teams.${req.params.teamId}`
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user.teams.get(req.params.teamId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update team
router.put('/:telegramId/:teamId', async (req, res) => {
  try {
    const { pokemonIds } = req.body;
    const user = await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      { $set: { [`teams.${req.params.teamId}`]: pokemonIds } },
      { new: true }
    );
    res.json(user.teams.get(req.params.teamId));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set main team
router.post('/:telegramId/main/:teamId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      { mainTeamId: req.params.teamId },
      { new: true }
    );
    res.json({ mainTeamId: user.mainTeamId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle favorite
router.post('/:telegramId/favorite/:pokemonId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId });
    if (user.favorites.includes(req.params.pokemonId)) {
      user.favorites.pull(req.params.pokemonId);
    } else {
      user.favorites.push(req.params.pokemonId);
    }
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
