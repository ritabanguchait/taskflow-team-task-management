/**
 * User Model (server/models/User.js)
 * 
 * WHY THIS FILE EXISTS:
 * Defines the schema structure and validation rules for users stored in MongoDB.
 * Includes hooks for secure password hashing and methods for password verification.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false // Exclude password field from query results by default for security
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member'
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

// Pre-save hook: Hash password before saving to MongoDB
userSchema.pre('save', async function (next) {
  // Only hash password if it was modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method: Verify entered password matches hashed password in DB
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
