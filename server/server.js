/**
 * Server Entry Point (server/server.js)
 * 
 * WHY THIS FILE EXISTS:
 * Loads environment variables, establishes connection with MongoDB,
 * and boots up the HTTP server on the configured port.
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start listening
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 TaskFlow Backend Server running on: http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();
