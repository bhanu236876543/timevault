const Memory = require('../models/Memory');

exports.createMemory = async (req, res) => {
  try {
    const { title, description, category, unlockDate } = req.body;
    let photos = [];

    if (req.files && req.files.length > 0) {
      photos = req.files.map(file => `/uploads/${file.filename}`);
    }

    const newMemory = new Memory({
      user: req.user,
      title,
      description,
      category,
      unlockDate: new Date(unlockDate),
      photos
    });

    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMemories = async (req, res) => {
  try {
    const memories = await Memory.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const memory = await Memory.findOne({ _id: req.params.id, user: req.user });
    if (!memory) return res.status(404).json({ error: 'Memory not found' });

    await memory.deleteOne();
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
