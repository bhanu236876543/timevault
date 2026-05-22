const mongoose = require('mongoose');

const letterSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  recipientEmail: { type: String, default: '' },
  moodCategory: { type: String, default: 'Neutral' }, // e.g., Optimistic, Anxious, Happy
  unlockDate: { type: Date, required: true },
  isUnlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Letter', letterSchema);
