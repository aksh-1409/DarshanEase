const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { userValidation, bookingValidation, feedbackValidation, donationValidation } = require('../utils/validators');

// ============ PUBLIC ROUTES ============
// Authentication
router.post('/login', userValidation.login, userController.ulogin);
router.post('/signup', userValidation.signup, userController.usignup);

// ============ PROTECTED ROUTES ============
// Profile management
router.get('/profile/:id', protect, userController.getUserById);
router.put('/profile/:id', protect, userValidation.update, userController.updateUser);

// Darshan
router.get('/darshan/:id', userController.getDarshanById);

// Bookings
router.post('/booking', protect, authorize('user'), bookingValidation.create, userController.createBooking);
router.get('/bookings/:userId', protect, userController.getBookingsByUser);
router.delete('/booking/:id', protect, userController.deleteBooking);

// Feedback
router.post('/feedback', protect, authorize('user'), feedbackValidation.create, userController.createFeedback);
router.get('/feedback/temple/:templeId', userController.getFeedbackByTemple);

// Donations
router.post('/donation', protect, authorize('user'), donationValidation.create, userController.createDonation);
router.get('/donations/:userId', protect, userController.getDonationsByUser);

// ============ ADMIN ONLY ROUTES ============
router.get('/all', protect, authorize('admin'), userController.getUsers);
router.get('/bookings', protect, authorize('admin'), userController.getAllBookings);
router.delete('/:id', protect, authorize('admin'), userController.deleteUser);

module.exports = router;
