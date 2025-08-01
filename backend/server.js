const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
console.log("👉 Loaded MONGO_URI =", process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mount user routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Basketstat backend is running 🚀');
});

// Mount player routes
const playerRoutes = require('./routes/players');
app.use('/api/players', playerRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🌐 Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

  app.use(cors({
  origin: 'http://localhost:5173', // Vue sunucu portunuz
  credentials: true
}))