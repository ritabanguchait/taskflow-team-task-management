/**
 * Authentication Middleware (server/middleware/authMiddleware.js)
 * 
 * WHY THIS FILE EXISTS:
 * Protects private API routes from unauthorized access.
 * 
 * HOW IT WORKS (Interview Explanation):
 * 1. Checks incoming HTTP request headers for 'Authorization' header.
 * 2. Validates that the header starts with 'Bearer '.
 * 3. Extracts the token string.
 * 4. Verifies the token using `jwt.verify()` with our secret key.
 * 5. If valid, extracts the user ID from the decoded payload and queries MongoDB.
 * 6. Attaches the user object (excluding the password) to `req.user`.
 * 7. Calls `next()` to hand off control to the controller.
 * 8. If invalid or missing, immediately responds with 401 Unauthorized.
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header: "Bearer <token>"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token string by splitting "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify token signature and expiration
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_jwt_secret_fallback'
      );

      // Find user by ID in token payload, exclude password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User belonging to this token no longer exists'
        });
      }

      // Proceed to next middleware or controller
      next();
    } catch (error) {
      console.error('[Auth Middleware Error]:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed verification or expired'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }
};

module.exports = { protect };
