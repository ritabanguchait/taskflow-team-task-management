/**
 * Project Service (server/services/projectService.js)
 * 
 * WHY THIS FILE EXISTS:
 * Encapsulates reusable business logic and database queries for Projects.
 * Keeping this logic out of controllers ensures controllers remain thin,
 * focused solely on HTTP request/response parsing, and easy to unit-test.
 */

const Project = require('../models/Project');
const Task = require('../models/Task');

/**
 * Get all projects where the user is either the creator or a team member.
 */
const getProjectsForUser = async (userId) => {
  return await Project.find({
    $or: [{ createdBy: userId }, { members: userId }]
  })
    .populate('createdBy', 'name email')
    .populate('members', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Get a single project by ID and calculate task statistics (total, todo, in progress, completed).
 */
const getProjectWithStats = async (projectId) => {
  const project = await Project.findById(projectId)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');

  if (!project) return null;

  // Aggregate task counts for this project
  const tasks = await Task.find({ project: projectId });
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  return {
    ...project.toObject(),
    stats: {
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    }
  };
};

/**
 * Delete a project and automatically cascade delete all tasks belonging to it.
 */
const deleteProjectAndTasks = async (projectId) => {
  const project = await Project.findById(projectId);
  if (!project) return null;

  // Cascade delete all tasks associated with this project
  await Task.deleteMany({ project: projectId });
  await Project.findByIdAndDelete(projectId);

  return project;
};

module.exports = {
  getProjectsForUser,
  getProjectWithStats,
  deleteProjectAndTasks
};
