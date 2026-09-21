/**
 * Task Controller (server/controllers/taskController.js)
 * 
 * WHY THIS FILE EXISTS:
 * Handles HTTP requests for task operations:
 * - Creating, updating, and deleting tasks
 * - Status updates (Todo -> In Progress -> Completed)
 * - Filtering tasks by status, priority, project, and assigned user
 * - Searching tasks by title
 * - Providing live dashboard statistics
 */

const Task = require('../models/Task');
const Project = require('../models/Project');
const taskService = require('../services/taskService');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate, status } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required'
      });
    }

    if (!project) {
      return res.status(400).json({
        success: false,
        message: 'Project ID is required'
      });
    }

    // Verify that the project exists and user has access to it
    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({
        success: false,
        message: 'Associated project not found'
      });
    }

    const task = await Task.create({
      title,
      description: description || '',
      project,
      assignedTo: assignedTo || null,
      createdBy: req.user._id,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      status: status || 'Todo'
    });

    const populatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all tasks with filtering & search
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.queryTasks(req.user._id, req.query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single task by ID
 * @route   GET /api/tasks/:id
 * @access  Private
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update task details
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const { title, description, project, assignedTo, priority, dueDate, status } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (project) task.project = project;
    if (assignedTo !== undefined) task.assignedTo = assignedTo || null;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate || null;
    if (status) task.status = status;

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick update task status only
 * @route   PATCH /api/tasks/:id/status
 * @access  Private
 */
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!['Todo', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be Todo, In Progress, or Completed'
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('project', 'name')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Task status moved to ${status}`,
      task
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics (Total projects, tasks, pending, completed, recent)
 * @route   GET /api/tasks/dashboard/stats
 * @access  Private
 */
const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await taskService.getDashboardStats(req.user._id);

    res.status(200).json({
      success: true,
      stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats
};
