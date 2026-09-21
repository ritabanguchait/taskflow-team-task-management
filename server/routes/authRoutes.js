/**
 * Authentication Routes (server/routes/authRoutes.js)
 * 
 * WHY THIS FILE EXISTS:
 * Maps HTTP requests to authentication controller methods.
 * Base path: /api/auth
 */

const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;
