const MoodLog = require('../models/MoodLog');

exports.createMoodLog = async (req, res) => {
  try {
    const { moodScore, emotion, note } = req.body;
    const newMoodLog = new MoodLog({
      user: req.user,
      moodScore,
      emotion,
      note
    });
    await newMoodLog.save();
    res.status(201).json(newMoodLog);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMoodLogs = async (req, res) => {
  try {
    const moods = await MoodLog.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(moods);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMoodLog = async (req, res) => {
  try {
    const mood = await MoodLog.findOne({ _id: req.params.id, user: req.user });
    if (!mood) return res.status(404).json({ error: 'Mood log not found' });
    
    await mood.deleteOne();
    res.json({ message: 'Mood log deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
