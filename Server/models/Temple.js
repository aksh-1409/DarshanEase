const mongoose = require('mongoose');

const TempleSchema = new mongoose.Schema({
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  templeName: {
    type: String,
    required: [true, 'Temple name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required']
  },
  darshanStartTime: {
    type: String,
    required: true
  },
  darshanEndTime: {
    type: String,
    required: true
  },
  templeImage: {
    type: String,
    required: true
  },
  facilities: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Temple', TempleSchema);
