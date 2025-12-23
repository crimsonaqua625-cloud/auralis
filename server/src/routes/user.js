const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user profile
router.get('/:telegramId', async (req, res) => {
  try {
    let user = await User.findOne({ telegramId: req.params.telegramId });
    if (!user) {
      user = new User({ telegramId: req.params.telegramId });
      await user.save();
    }
    res.json(user);
  } catch (error) {
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
