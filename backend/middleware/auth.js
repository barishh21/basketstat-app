const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    
    const authHeader = req.header('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        error: 'Yetkilendirme hatası: Token bulunamadı'
      });
    }

    const token = authHeader.split(' ')[1]; 
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Kullanıcı bulunamadı'
      });
    }

    req.user = {
      userId: user._id,
      username: user.username
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Oturum süresi doldu. Lütfen tekrar giriş yapın.'
      });
    }
    
    res.status(401).json({
      success: false,
      error: 'Geçersiz yetkilendirme'
    });
  }
};