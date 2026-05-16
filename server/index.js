const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');
const Letter = require('./models/Letter');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
const letterRoutes = require('./routes/letters');
const memoryRoutes = require('./routes/memories');
const goalRoutes = require('./routes/goals');
const moodRoutes = require('./routes/moods');
const dashboardRoutes = require('./routes/dashboard');

app.use('/api/auth', authRoutes);
app.use('/api/letters', letterRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Cron job to auto-unlock letters daily
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();
    await Letter.updateMany(
      { isUnlocked: false, unlockDate: { $lte: today } },
      { $set: { isUnlocked: true } }
    );
    console.log('Cron job ran: unlocked scheduled letters.');
  } catch (err) {
    console.error('Cron job error:', err);
  }
});

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('DB Connection Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
