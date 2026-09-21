/**
 * User Routes (server/routes/userRoutes.js)
 * 
 * WHY THIS FILE EXISTS:
 * Defines endpoints for retrieving user list and updating profile.
 * Base path: /api/users
 */

const express = require('express');
const router = express.Router();
const { getUsers, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(protect);

router.get('/', getUsers);
router.put('/profile', updateProfile);

module.exports = router;
