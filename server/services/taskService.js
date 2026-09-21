/**
 * Task Service (server/services/taskService.js)
 * 
 * WHY THIS FILE EXISTS:
 * Contains query-building and aggregation logic for tasks.
 * Makes it simple to filter by status, priority, project, assignedTo,
 * and search task titles, as well as generate dashboard metrics.
 */

const Task = require('../models/Task');
const Project = require('../models/Project');

/**
 * Filter and search tasks based on query parameters.
 */
const queryTasks = async (userId, queryParams) => {
  const { status, priority, project, assignedTo, search } = queryParams;

  // Find projects the user has access to (creator or member)
  const userProjects = await Project.find({
    $or: [{ createdBy: userId }, { members: userId }]
  }).select('_id');

  const allowedProjectIds = userProjects.map((p) => p._id);

  // Build query filter
  const filter = {
    project: { $in: allowedProjectIds }
  };

  // Specific project filter (if requested and user has access)
  if (project && allowedProjectIds.some((pId) => pId.toString() === project)) {
    filter.project = project;
  }

  // Filter by status ('Todo' | 'In Progress' | 'Completed')
  if (status) {
    filter.status = status;
  }

  // Filter by priority ('Low' | 'Medium' | 'High')
  if (priority) {
    filter.priority = priority;
  }

  // Filter by assigned user
  if (assignedTo) {
    filter.assignedTo = assignedTo;
  }

  // Search by title (case-insensitive regex)
  if (search && search.trim() !== '') {
    filter.title = { $regex: search.trim(), $options: 'i' };
  }

  return await Task.find(filter)
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });
};

/**
 * Get dashboard metrics and recent tasks for the authenticated user.
 */
const getDashboardStats = async (userId) => {
  // Find projects user has access to
  const userProjects = await Project.find({
    $or: [{ createdBy: userId }, { members: userId }]
  }).select('_id');

  const projectIds = userProjects.map((p) => p._id);

  // Get all tasks across accessible projects
  const tasks = await Task.find({ project: { $in: projectIds } })
    .populate('project', 'name')
    .populate('assignedTo', 'name email')
    .sort({ createdAt: -1 });

  const totalProjects = userProjects.length;
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((t) => t.status === 'Todo').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const pendingTasks = todoTasks + inProgressTasks;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;

  // Recent 5 tasks
  const recentTasks = tasks.slice(0, 5);

  return {
    totalProjects,
    totalTasks,
    todoTasks,
    inProgressTasks,
    pendingTasks,
    completedTasks,
    recentTasks
  };
};

module.exports = {
  queryTasks,
  getDashboardStats
};
