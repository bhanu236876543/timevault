const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Personal', 'Career', 'Fitness', 'Relationships', 'Travel'],
    default: 'Personal'
  },
  photos: [{ type: String }], // Array of image paths/URLs
  unlockDate: { type: Date, required: true },
  isUnlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Memory', memorySchema);
