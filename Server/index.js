const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const { errorHandler } = require('./utils/errorHandler');

// Import routes
const userRoutes = require('./routes/userRoutes');
const organizerRoutes = require('./routes/organizerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["POST", "GET", "DELETE", "PUT", "PATCH"],
  credentials: true
}));

// Note: Static file serving removed — images are hosted on Cloudinary

// API Routes
app.use('/api/user', userRoutes);
app.use('/api/organizer', organizerRoutes);
app.use('/api/admin', adminRoutes);

// Temporary Admin Seeding Route (To be deleted after running)
app.get('/api/seed-admin', async (req, res) => {
  try {
    const Admin = require('./models/Admin');
    const bcrypt = require('bcryptjs');
    
    // Delete all existing admins
    const deleteResult = await Admin.deleteMany({});
    
    // Create one master admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("AdminPassword123!", salt);
    
    const masterAdmin = await Admin.create({
      name: "Master Admin",
      email: "admin@darshanease.com",
      password: hashedPassword,
      role: "admin"
    });
    
    res.json({
      success: true,
      message: `Deleted ${deleteResult.deletedCount} old admins. Created master admin successfully!`,
      email: masterAdmin.email,
      password: "AdminPassword123!"
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'DarshanEase API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
