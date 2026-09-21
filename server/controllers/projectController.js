/**
 * Project Controller (server/controllers/projectController.js)
 * 
 * WHY THIS FILE EXISTS:
 * Handles HTTP requests for project operations (Create, Read, Update, Delete).
 * Delegates business calculations to `projectService.js`.
 */

const Project = require('../models/Project');
const projectService = require('../services/projectService');

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const { name, description, members } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }

    // Ensure the project creator is automatically included in the members list
    const memberSet = new Set(members || []);
    memberSet.add(req.user._id.toString());
    const memberArray = Array.from(memberSet);

    const project = await Project.create({
      name,
      description: description || '',
      createdBy: req.user._id,
      members: memberArray
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: populatedProject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects user belongs to
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await projectService.getProjectsForUser(req.user._id);

    res.status(200).json({
      success: true,
      count: projects.length,
      projects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single project with its task statistics
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await projectService.getProjectWithStats(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.status(200).json({
      success: true,
      project
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project details or members
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Only project creator or admin can update project
    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this project'
      });
    }

    const { name, description, members } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (members) {
      // Ensure creator is always preserved in members
      const memberSet = new Set(members);
      memberSet.add(project.createdBy.toString());
      project.members = Array.from(memberSet);
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email');

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project and its tasks
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check authorization: creator or admin
    if (
      project.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project'
      });
    }

    await projectService.deleteProjectAndTasks(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Project and all associated tasks deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject
};
