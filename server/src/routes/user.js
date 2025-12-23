const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:telegramId', async (req, res) => {
  try {
    console.log('Fetching user:', req.params.telegramId);
    let user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      console.log('User not found, creating new user');
      user = new User({ telegramId: req.params.telegramId });
      await user.save();
    }
    console.log('Returning user:', user);
    res.json(user);
  } catch (error) {
    console.error('Error in user route:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user data
router.put('/:telegramId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      req.body,
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add currency
router.post('/:telegramId/currency', async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      { $inc: { currency: amount } },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
