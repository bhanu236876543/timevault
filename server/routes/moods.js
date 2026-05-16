const express = require('express');
const router = express.Router();
const { createMoodLog, getMoodLogs, deleteMoodLog } = require('../controllers/moodController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createMoodLog);
router.get('/', authMiddleware, getMoodLogs);
router.delete('/:id', authMiddleware, deleteMoodLog);

module.exports = router;
