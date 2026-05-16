const Letter = require('../models/Letter');
const Memory = require('../models/Memory');
const Goal = require('../models/Goal');
const MoodLog = require('../models/MoodLog');

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user;

    const [letters, memories, goals, moods] = await Promise.all([
      Letter.find({ user: userId }),
      Memory.find({ user: userId }),
      Goal.find({ user: userId }),
      MoodLog.find({ user: userId }).sort({ createdAt: -1 }).limit(10) // Get last 10 moods for trend
    ]);

    const lockedLetters = letters.filter(l => !l.isUnlocked).length;
    const unlockedLetters = letters.length - lockedLetters;

    const lockedMemories = memories.filter(m => !m.isUnlocked).length;
    const unlockedMemories = memories.length - lockedMemories;

    const completedGoals = goals.filter(g => g.status === 'Completed').length;
    const totalGoals = goals.length;

    // Mood trend analysis
    const moodAverage = moods.length > 0 
      ? (moods.reduce((acc, curr) => acc + curr.moodScore, 0) / moods.length).toFixed(1)
      : 0;

    res.json({
      stats: {
        totalLetters: letters.length,
        lockedLetters,
        unlockedLetters,
        totalMemories: memories.length,
        lockedMemories,
        unlockedMemories,
        totalGoals,
        completedGoals,
        moodAverage
      },
      recentMoods: moods
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
