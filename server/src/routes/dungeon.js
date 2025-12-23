const express = require('express');
const router = express.Router();
const DungeonProgress = require('../models/DungeonProgress');

// Get dungeon progress
router.get('/:telegramId', async (req, res) => {
  try {
    let progress = await DungeonProgress.findOne({ userId: req.params.telegramId });
    if (!progress) {
      progress = new DungeonProgress({ userId: req.params.telegramId });
      await progress.save();
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enter dungeon
router.post('/:telegramId/enter', async (req, res) => {
  try {
    const { teamId } = req.body;
    const progress = await DungeonProgress.findOneAndUpdate(
      { userId: req.params.telegramId },
      { status: 'in-progress', currentFloor: 1 },
      { new: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Battle floor
router.post('/:telegramId/floor/:floorNumber', async (req, res) => {
  try {
    const { won } = req.body;
    const progress = await DungeonProgress.findOne({ userId: req.params.telegramId });

    if (won) {
      progress.currentFloor += 1;
      if (progress.currentFloor % 5 === 0) {
        progress.lastSaveFloor = progress.currentFloor;
      }
    } else {
      progress.currentFloor = progress.lastSaveFloor + 1;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exit dungeon
router.post('/:telegramId/exit', async (req, res) => {
  try {
    const progress = await DungeonProgress.findOneAndUpdate(
      { userId: req.params.telegramId },
      { status: 'paused' },
      { new: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset dungeon
router.post('/:telegramId/reset', async (req, res) => {
  try {
    const progress = await DungeonProgress.findOneAndUpdate(
      { userId: req.params.telegramId },
      { currentFloor: 1, lastSaveFloor: 1, status: 'none' },
      { new: true }
    );
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
