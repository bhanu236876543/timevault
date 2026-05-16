const express = require('express');
const router = express.Router();
const { createLetter, getLetters, deleteLetter } = require('../controllers/letterController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createLetter);
router.get('/', authMiddleware, getLetters);
router.delete('/:id', authMiddleware, deleteLetter);

module.exports = router;
