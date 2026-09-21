/**
 * User Controller (server/controllers/userController.js)
 * 
 * WHY THIS FILE EXISTS:
 * Handles user profile retrieval, profile updates, and listing available team members
 * for assignment to projects and tasks.
 */

const User = require('../models/User');

/**
 * @desc    Get all users (for team member assignment)
 * @route   GET /api/users
 * @access  Private
 */
const getUsers = async (req, res, next) => {
  try {
    // Return all users with basic public info
    const users = await User.find({}).select('name email role createdAt').sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update name if provided
    if (req.body.name) {
      user.name = req.body.name;
    }

    // Update password if provided
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters'
        });
      }
      user.password = req.body.password; // pre-save hook will hash this
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        createdAt: updatedUser.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  updateProfile
};
