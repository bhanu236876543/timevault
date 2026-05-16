const Goal = require('../models/Goal');

exports.createGoal = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const newGoal = new Goal({
      user: req.user,
      title,
      description,
      deadline: deadline ? new Date(deadline) : null
    });
    await newGoal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateGoal = async (req, res) => {
  try {
    const { progress, status, reflectionNotes } = req.body;
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { $set: { progress, status, reflectionNotes } },
      { new: true }
    );
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.user });
    if (!goal) return res.status(404).json({ error: 'Goal not found' });
    
    await goal.deleteOne();
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
