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

// Temporary seed endpoint for Atlas DB
const { seedDatabase } = require('./scripts/seedProduction');
app.get('/api/seed', seedDatabase);

// Temporary HTTP migration endpoint
app.post('/api/migrate-data', async (req, res) => {
  const { collectionName, documents } = req.body;
  try {
    if (!collectionName || !Array.isArray(documents)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    
    // Clear the existing collection
    await db.collection(collectionName).deleteMany({});
    
    // Convert string IDs, ObjectIds, and date fields back to MongoDB types
    const preparedDocs = documents.map(doc => {
      const newDoc = { ...doc };
      
      if (newDoc._id) {
        newDoc._id = new mongoose.Types.ObjectId(newDoc._id);
      }
      
      const refFields = ['organizerId', 'userId', 'templeId', 'darshanId'];
      refFields.forEach(field => {
        if (newDoc[field] && typeof newDoc[field] === 'string' && newDoc[field].length === 24) {
          newDoc[field] = new mongoose.Types.ObjectId(newDoc[field]);
        }
      });
      
      const dateFields = ['createdAt', 'updatedAt', 'date', 'darshanDate', 'eventDate'];
      dateFields.forEach(field => {
        if (newDoc[field] && typeof newDoc[field] === 'string') {
          const parsedDate = Date.parse(newDoc[field]);
          if (!isNaN(parsedDate)) {
            newDoc[field] = new Date(parsedDate);
          }
        }
      });

      return newDoc;
    });

    if (preparedDocs.length > 0) {
      await db.collection(collectionName).insertMany(preparedDocs);
    }

    res.json({ success: true, count: preparedDocs.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
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
