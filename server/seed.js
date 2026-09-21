/**
 * Database Seeder Script (server/seed.js)
 * 
 * WHY THIS FILE EXISTS:
 * Automatically populates sample users, projects, and tasks in MongoDB.
 * Perfect for freshers demoing the application in an interview or testing features
 * without having to manually type in dozens of records.
 * 
 * RUN VIA:
 * npm run seed
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow');
    console.log('[Seeder] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();
    console.log('[Seeder] Cleared old data.');

    // 1. Create Users
    // Passwords will be hashed automatically by userSchema.pre('save')
    const user1 = await User.create({
      name: 'Alex Morgan',
      email: 'alex@example.com',
      password: 'password123',
      role: 'admin'
    });

    const user2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'member'
    });

    const user3 = await User.create({
      name: 'Rohan Sharma',
      email: 'rohan@example.com',
      password: 'password123',
      role: 'member'
    });

    console.log('[Seeder] Created 3 Users (Password for all: password123)');

    // 2. Create Projects
    const project1 = await Project.create({
      name: 'Website Redesign',
      description: 'Revamping the company landing page and user dashboard with modern UI/UX principles.',
      createdBy: user1._id,
      members: [user1._id, user2._id, user3._id]
    });

    const project2 = await Project.create({
      name: 'Mobile App Launch',
      description: 'Preparing the iOS & Android cross-platform mobile app for public release.',
      createdBy: user2._id,
      members: [user2._id, user3._id]
    });

    const project3 = await Project.create({
      name: 'Payment Gateway Integration',
      description: 'Integrate Stripe and PayPal for seamless subscription checkout.',
      createdBy: user1._id,
      members: [user1._id, user2._id]
    });

    console.log('[Seeder] Created 3 Projects.');

    // 3. Create Tasks
    const now = new Date();
    const addDays = (days) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    await Task.create([
      {
        title: 'Design Hero Section Mockup',
        description: 'Create Figma wireframes and high-fidelity prototype for the new homepage hero section.',
        project: project1._id,
        assignedTo: user2._id,
        createdBy: user1._id,
        status: 'Completed',
        priority: 'High',
        dueDate: addDays(2)
      },
      {
        title: 'Develop Responsive Navigation Bar',
        description: 'Implement responsive mobile navigation bar with dropdown menus and accessibility support.',
        project: project1._id,
        assignedTo: user3._id,
        createdBy: user1._id,
        status: 'In Progress',
        priority: 'Medium',
        dueDate: addDays(5)
      },
      {
        title: 'Audit Lighthouse Performance Scores',
        description: 'Analyze Core Web Vitals, optimize image compression, and defer non-critical JS.',
        project: project1._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: 'Todo',
        priority: 'Low',
        dueDate: addDays(7)
      },
      {
        title: 'Push Build to TestFlight',
        description: 'Configure Xcode signing certificates and generate staging release for internal QA testing.',
        project: project2._id,
        assignedTo: user2._id,
        createdBy: user2._id,
        status: 'In Progress',
        priority: 'High',
        dueDate: addDays(3)
      },
      {
        title: 'Draft App Store Screenshots',
        description: 'Export 6.5-inch and 5.5-inch marketing graphics with multilingual captions.',
        project: project2._id,
        assignedTo: user3._id,
        createdBy: user2._id,
        status: 'Todo',
        priority: 'Medium',
        dueDate: addDays(10)
      },
      {
        title: 'Implement Webhook Listener for Stripe',
        description: 'Handle charge.succeeded and invoice.payment_failed events securely with signature verification.',
        project: project3._id,
        assignedTo: user1._id,
        createdBy: user1._id,
        status: 'Completed',
        priority: 'High',
        dueDate: addDays(1)
      }
    ]);

    console.log('[Seeder] Created 6 Tasks.');
    console.log('✅ [Seeder] Database seeding completed successfully!');
    console.log('----------------------------------------------------');
    console.log('Demo Login Credentials:');
    console.log('Email: alex@example.com     Password: password123');
    console.log('Email: sarah@example.com    Password: password123');
    console.log('Email: rohan@example.com    Password: password123');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedData();
