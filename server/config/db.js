/**
 * Database Configuration (server/config/db.js)
 * 
 * WHY THIS FILE EXISTS:
 * Encapsulates the MongoDB connection logic using Mongoose.
 * Keeping database connection separate from server startup (server.js) ensures
 * clean separation of concerns and easier testing or configuration changes.
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow');
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    // Exit process with failure (1) if database cannot connect
    process.exit(1);
  }
};

module.exports = connectDB;
