/**
 * Task Routes (server/routes/taskRoutes.js)
 * 
 * WHY THIS FILE EXISTS:
 * Defines REST endpoints for task creation, retrieval, filtering, updating,
 * and deleting, as well as dashboard aggregated statistics.
 * Base path: /api/tasks
 */

const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// IMPORTANT: Specific static sub-paths must precede parameter routes like `/:id`
router.get('/dashboard/stats', getDashboardStats);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

module.exports = router;
