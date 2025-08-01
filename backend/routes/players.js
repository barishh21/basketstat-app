const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {

  try {
    console.log('Oyuncu oluşturma isteği:', {
      body: req.body,
      user: req.user
    });

    const player = new Player({
      userId: req.user.userId,
      ...req.body
    });

    const savedPlayer = await player.save();
    
    res.status(201).json({
      success: true,
      player: savedPlayer
    });

  } catch (err) {
    console.error('Oyuncu oluşturma hatası:', err);
    
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ 
        success: false,
        error: 'Validasyon hatası',
        details: errors 
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

router.get('/my-players', auth, async (req, res) => {
  try {
    const players = await Player.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      players
    });

  } catch (err) {
    console.error('Oyuncuları listeleme hatası:', err);
    res.status(500).json({
      success: false,
      error: 'Sunucu hatası'
    });
  }
});

module.exports = router;