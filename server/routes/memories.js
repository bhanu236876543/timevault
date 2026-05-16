const express = require('express');
const router = express.Router();
const { createMemory, getMemories, deleteMemory } = require('../controllers/memoryController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', authMiddleware, upload.array('photos', 5), createMemory);
router.get('/', authMiddleware, getMemories);
router.delete('/:id', authMiddleware, deleteMemory);

module.exports = router;
