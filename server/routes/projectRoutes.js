/**
 * Project Routes (server/routes/projectRoutes.js)
 * 
 * WHY THIS FILE EXISTS:
 * Defines REST endpoints for project management.
 * Base path: /api/projects
 */

const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');

// All project routes require authentication
router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

module.exports = router;
