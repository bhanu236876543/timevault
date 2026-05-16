const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moodScore: { type: Number, required: true, min: 1, max: 10 }, // 1 = very sad, 10 = extremely happy
  emotion: { type: String, required: true }, // e.g., Joyful, Stressed, Calm
  note: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MoodLog', moodLogSchema);
