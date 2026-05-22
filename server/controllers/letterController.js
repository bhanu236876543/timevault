const Letter = require('../models/Letter');

exports.createLetter = async (req, res) => {
  try {
    const { title, content, recipientEmail, moodCategory, unlockDate } = req.body;
    const newLetter = new Letter({
      user: req.user,
      title,
      content,
      recipientEmail,
      moodCategory,
      unlockDate: new Date(unlockDate)
    });
    await newLetter.save();
    res.status(201).json(newLetter);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getLetters = async (req, res) => {
  try {
    const letters = await Letter.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(letters);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteLetter = async (req, res) => {
  try {
    const letter = await Letter.findOne({ _id: req.params.id, user: req.user });
    if (!letter) return res.status(404).json({ error: 'Letter not found' });
    
    if (letter.isUnlocked) return res.status(400).json({ error: 'Cannot delete unlocked letter' });

    await letter.deleteOne();
    res.json({ message: 'Letter deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
