const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auralis');

// Routes
app.use('/api/users', require('./routes/user'));
app.use('/api/pokemon', require('./routes/pokemon'));
app.use('/api/pokedex', require('./routes/pokedex'));
app.use('/api/teams', require('./routes/team'));
app.use('/api/factions', require('./routes/faction'));
app.use('/api/raids', require('./routes/raid'));
app.use('/api/gyms', require('./routes/gym'));
app.use('/api/dungeons', require('./routes/dungeon'));
app.use('/api/market', require('./routes/market'));
app.use('/api/mail', require('./routes/mail'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
