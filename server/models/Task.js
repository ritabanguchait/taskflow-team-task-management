/**
 * Task Model (server/models/Task.js)
 * 
 * WHY THIS FILE EXISTS:
 * Defines the schema for tasks within projects.
 * Holds references to the associated Project, the User it is assigned to,
 * and the User who created it.
 */

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      maxlength: [120, 'Task title cannot exceed 120 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project']
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String,
      enum: ['Todo', 'In Progress', 'Completed'],
      default: 'Todo'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    dueDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexing for high-performance filtering and queries
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ assignedTo: 1 });

module.exports = mongoose.model('Task', taskSchema);
