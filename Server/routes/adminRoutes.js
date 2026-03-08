const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { userValidation } = require('../utils/validators');

// ============ PUBLIC ROUTES ============
// Authentication
router.post('/login', userValidation.login, adminController.alogin);
router.post('/signup', userValidation.signup, adminController.asignup);

// ============ PROTECTED ADMIN ROUTES ============
// All routes below require admin authentication
router.use(protect);
router.use(authorize('admin'));

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/user/:id', adminController.getUserById);
router.put('/user/:id', adminController.updateUser);
router.delete('/user/:id', adminController.deleteUser);

// Organizer Management
router.get('/organizers', adminController.getAllOrganizers);
router.get('/organizer/:id', adminController.getOrganizerById);
router.put('/organizer/:id', adminController.updateOrganizer);
router.delete('/organizer/:id', adminController.deleteOrganizer);
router.put('/organizer/:id/approve', adminController.approveOrganizer);

// Temple Management
router.get('/temples', adminController.getAllTemples);
router.delete('/temple/:id', adminController.deleteTemple);

// Darshan Management
router.get('/darshans', adminController.getAllDarshans);
router.delete('/darshan/:id', adminController.deleteDarshan);

// Booking Management
router.get('/bookings', adminController.getAllBookings);

// Feedback Management
router.get('/feedback', adminController.getAllFeedback);
router.put('/feedback/:id/status', adminController.updateFeedbackStatus);
router.delete('/feedback/:id', adminController.deleteFeedback);

// Donation Management
router.get('/donations', adminController.getAllDonations);

// Event Management
router.get('/events', adminController.getAllEvents);
router.delete('/event/:id', adminController.deleteEvent);

// Analytics & Reports
router.get('/dashboard/stats', adminController.getDashboardStats);
router.get('/analytics/bookings', adminController.getBookingAnalytics);
router.get('/analytics/popular-temples', adminController.getPopularTemples);
router.get('/analytics/demographics', adminController.getDevoteeDemographics);
router.get('/analytics/booking-trends', adminController.getBookingTrends);

module.exports = router;
