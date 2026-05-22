const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const cron = require('node-cron');
const Letter = require('./models/Letter');
const sendEmail = require('./utils/sendEmail');

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

// Cron job to auto-unlock letters and memories daily
cron.schedule('* * * * *', async () => {
  try {
    const today = new Date();
    
    // 1. Unlock Letters
    const lettersToUnlock = await Letter.find({
      isUnlocked: false,
      unlockDate: { $lte: today }
    });

    for (const letter of lettersToUnlock) {
      letter.isUnlocked = true;
      await letter.save();

      // If there is an email, send the letter!
      if (letter.recipientEmail) {
        try {
          await sendEmail({
            email: letter.recipientEmail,
            subject: `TimeVault: Your Letter "${letter.title}" Has Unlocked!`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #8b5cf6;">TimeVault</h2>
                <p>A message from the past has just unlocked.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <h3 style="margin-bottom: 5px;">${letter.title}</h3>
                <p style="font-size: 12px; color: #888; margin-top: 0;">Written on: ${new Date(letter.createdAt).toLocaleDateString()}</p>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px; white-space: pre-wrap; color: #333;">
                  ${letter.content}
                </div>
                <p style="margin-top: 30px; font-size: 14px; color: #666;">
                  View your full vault in the TimeVault App.
                </p>
              </div>
            `
          });
          console.log(`Email sent for letter: ${letter._id}`);
        } catch (emailErr) {
          console.error(`Failed to send email for letter ${letter._id}:`, emailErr);
        }
      }
    }

    // 2. Unlock Memories (No email notification for memories, just unlock them in the app)
    const Memory = require('./models/Memory');
    const memoriesToUnlock = await Memory.find({
      isUnlocked: false,
      unlockDate: { $lte: today }
    });
    for (const memory of memoriesToUnlock) {
      memory.isUnlocked = true;
      await memory.save();
      console.log(`Memory unlocked: ${memory._id}`);
    }

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
