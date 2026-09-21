/**
 * Express Application Setup (server/app.js)
 * 
 * WHY THIS FILE EXISTS:
 * Configures the Express app, middleware pipeline, and route mounting.
 * Separating `app.js` from `server.js` is a professional best practice because
 * it allows testing API endpoints with Supertest without actually binding to a network port.
 */

const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Standard Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'TaskFlow API is operating smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// Fallback & Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;
