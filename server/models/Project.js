/**
 * Project Model (server/models/Project.js)
 * 
 * WHY THIS FILE EXISTS:
 * Defines the schema for team projects.
 * Uses Mongoose references (`ref: 'User'`) to link projects to their creator
 * and team members without duplicate data storage.
 */

const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a project name'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must have a creator']
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Project', projectSchema);
