const express = require('express');
const router = express.Router();
const Faction = require('../models/Faction');
const User = require('../models/User');

// Get all factions
router.get('/', async (req, res) => {
  try {
    const factions = await Faction.find();
    res.json(factions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single faction
router.get('/:factionId', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.factionId);
    if (!faction) return res.status(404).json({ error: 'Faction not found' });
    res.json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create faction (requires card)
router.post('/', async (req, res) => {
  try {
    const { name, leaderId, card } = req.body;
    if (!card) return res.status(400).json({ error: 'Faction card required' });

    const faction = new Faction({
      name,
      leaderId,
      memberIds: [leaderId],
      createdViaCard: true,
    });
    await faction.save();

    // Update user
    await User.findOneAndUpdate(
      { telegramId: leaderId },
      { faction: faction._id, factionRole: 'Leader' }
    );

    res.status(201).json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply to faction
router.post('/:factionId/apply/:telegramId', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.factionId);
    if (!faction) return res.status(404).json({ error: 'Faction not found' });

    if (faction.memberIds.includes(req.params.telegramId)) {
      return res.status(400).json({ error: 'Already a member' });
    }

    if (faction.memberIds.length >= faction.maxMembers) {
      return res.status(400).json({ error: 'Faction is full' });
    }

    faction.memberIds.push(req.params.telegramId);
    await faction.save();

    await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      { faction: faction._id, factionRole: 'Member' }
    );

    res.json(faction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Leave faction
router.post('/:factionId/leave/:telegramId', async (req, res) => {
  try {
    const faction = await Faction.findById(req.params.factionId);
    faction.memberIds.pull(req.params.telegramId);
    await faction.save();

    await User.findOneAndUpdate(
      { telegramId: req.params.telegramId },
      { faction: null, factionRole: null }
    );

    res.json({ message: 'Left faction' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
