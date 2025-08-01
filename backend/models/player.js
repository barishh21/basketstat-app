const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: [true, 'Oyuncu adı zorunludur'] 
  },
  age: { 
    type: Number, 
    required: true,
    min: [15, 'Yaş 15\'ten küçük olamaz'],
    max: [50, 'Yaş 50\'den büyük olamaz']
  },
  height: { 
    type: String, 
    required: [true, 'Boy bilgisi zorunludur'] 
  },
  position: { 
    type: String, 
    required: true,
    enum: {
      values: ['PG', 'SG', 'SF', 'PF', 'C'],
      message: 'Geçersiz pozisyon'
    }
  },
  jerseyNumber: { 
    type: Number, 
    required: [true, 'Forma numarası zorunludur'],
    min: [0, 'Forma numarası 0\'dan küçük olamaz'],
    max: [99, 'Forma numarası 99\'dan büyük olamaz']
  },
  stats: {
    points: { type: Number, default: 0, min: 0 },
    assists: { type: Number, default: 0, min: 0 },
    rebounds: { type: Number, default: 0, min: 0 },
    steals: { type: Number, default: 0, min: 0 },
    blocks: { type: Number, default: 0, min: 0 }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, { collection: 'players' });

module.exports = mongoose.model('Player', playerSchema);