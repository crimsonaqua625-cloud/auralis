const express = require('express');
const router = express.Router();
const Mail = require('../models/Mail');

// Get mail for user
router.get('/:telegramId', async (req, res) => {
  try {
    const mail = await Mail.find({ userId: req.params.telegramId });
    res.json(mail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark mail as read
router.put('/:mailId/read', async (req, res) => {
  try {
    const mail = await Mail.findByIdAndUpdate(
      req.params.mailId,
      { read: true },
      { new: true }
    );
    res.json(mail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Claim mail contents
router.post('/:mailId/claim', async (req, res) => {
  try {
    const mail = await Mail.findByIdAndUpdate(
      req.params.mailId,
      { claimed: true },
      { new: true }
    );
    res.json(mail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Send mail (system)
router.post('/', async (req, res) => {
  try {
    const { userId, subject, message, contents } = req.body;
    const expiresAt = new Date(Date.now() + 14 * 24 * 3600000); // 14 days

    const mail = new Mail({
      userId,
      subject,
      message,
      contents,
      expiresAt,
    });
    await mail.save();
    res.status(201).json(mail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
