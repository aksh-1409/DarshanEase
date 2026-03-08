const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  darshanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Darshan",
    required: true
  },
  darshanName: String,
  templeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Temple"
  },
  templeName: String,
  templeImage: String,
  location: String,
  startTime: String,
  endTime: String,
  description: String,
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organizer"
  },
  organizerName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  ticketType: {
    type: String,
    enum: ['normal', 'vip'],
    default: 'normal'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  darshanDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  bookingId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

// Generate unique booking ID before saving
BookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);
