const express = require('express');
const router = express.Router();
const Raid = require('../models/Raid');
const User = require('../models/User');

// Get active raids
router.get('/', async (req, res) => {
  try {
    const raids = await Raid.find({ status: { $in: ['waiting', 'in-progress'] } });
    res.json(raids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get specific raid
router.get('/:raidId', async (req, res) => {
  try {
    const raid = await Raid.findById(req.params.raidId);
    if (!raid) return res.status(404).json({ error: 'Raid not found' });
    res.json(raid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new raid
router.post('/', async (req, res) => {
  try {
    const { tier, bossPokemon, maxPlayers } = req.body;
    const raid = new Raid({
      tier,
      bossPokemon,
      maxPlayers: maxPlayers || 10,
      totalBossHp: bossPokemon.stats.hp * 2,
      bossHp: bossPokemon.stats.hp * 2,
    });
    await raid.save();
    res.status(201).json(raid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Join raid
router.post('/:raidId/join', async (req, res) => {
  try {
    const { telegramId, pokemonInstanceId } = req.body;
    const raid = await Raid.findById(req.params.raidId);

    if (!raid) return res.status(404).json({ error: 'Raid not found' });
    if (raid.status !== 'waiting' && raid.status !== 'in-progress') {
      return res.status(400).json({ error: 'Raid not joinable' });
    }

    const user = await User.findOne({ telegramId });
    if (user.raidTickets < 1) {
      return res.status(400).json({ error: 'No raid tickets' });
    }

    raid.players.push({
      userId: telegramId,
      pokemonInstanceId,
      turnsUsed: 0,
      damageDealt: 0,
    });
    raid.currentPlayers += 1;
    await raid.save();

    user.raidTickets -= 1;
    await user.save();

    res.json(raid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deal damage in raid
router.post('/:raidId/attack', async (req, res) => {
  try {
    const { userId, damage, turnsUsed } = req.body;
    const raid = await Raid.findById(req.params.raidId);

    const player = raid.players.find((p) => p.userId === userId);
    if (!player) return res.status(404).json({ error: 'Not in raid' });

    player.damageDealt += damage;
    player.turnsUsed += turnsUsed;
    raid.bossHp -= damage;

    if (raid.bossHp <= 0) {
      raid.bossHp = 0;
      raid.status = 'completed';
    }

    await raid.save();
    res.json(raid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
