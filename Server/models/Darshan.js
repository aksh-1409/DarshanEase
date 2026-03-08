const mongoose = require('mongoose');

const DarshanSchema = new mongoose.Schema({
  darshanName: {
    type: String,
    required: [true, 'Darshan name is required'],
    trim: true
  },
  templeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple",
    required: true
  },
  templeName: {
    type: String,
    required: true
  },
  templeImage: String,
  location: String,
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  description: String,
  totalSeats: {
    type: Number,
    required: true,
    default: 100
  },
  availableSeats: {
    type: Number,
    required: true
  },
  prices: {
    normal: {
      type: Number,
      required: true,
      default: 0
    },
    vip: {
      type: Number,
      default: 0
    }
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer",
    required: true
  },
  organizerName: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Darshan', DarshanSchema);
