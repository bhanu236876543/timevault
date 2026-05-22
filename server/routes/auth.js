const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Setup multer for profile pictures
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.put('/profile', authMiddleware, upload.single('profilePicture'), updateProfile);

module.exports = router;
