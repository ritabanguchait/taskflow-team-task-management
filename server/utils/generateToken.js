/**
 * JWT Token Generator (server/utils/generateToken.js)
 * 
 * WHY THIS FILE EXISTS:
 * Generates signed JSON Web Tokens (JWT) containing the user's MongoDB `_id` as the payload.
 * When the user logs in or registers, the server sends this token to the client.
 * The client stores it and attaches it to subsequent requests in the `Authorization` header.
 */

const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_jwt_secret_fallback', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

module.exports = generateToken;
