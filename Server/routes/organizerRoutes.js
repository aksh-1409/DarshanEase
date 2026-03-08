const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { protect, authorize } = require('../middleware/auth');
const { userValidation, templeValidation, darshanValidation } = require('../utils/validators');
const multer = require('multer');
const path = require('path');

// Multer storage setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// ============ PUBLIC ROUTES ============
// Authentication
router.post('/login', userValidation.login, organizerController.ologin);
router.post('/signup', userValidation.signup, organizerController.osignup);

// Public temple and darshan listings
router.get('/temples', organizerController.getAllTemples);
router.get('/temple/:id', organizerController.getTempleById);
router.get('/darshans', organizerController.getAllDarshans);
router.get('/events', organizerController.getAllEvents);

// ============ PROTECTED ORGANIZER ROUTES ============
// Profile
router.get('/profile', protect, authorize('organizer'), organizerController.getOrganizerProfile);
router.put('/profile', protect, authorize('organizer'), organizerController.updateOrganizerProfile);

// Temple Management
router.post('/temple', protect, authorize('organizer'), upload.single('templeImage'), templeValidation.create, organizerController.createTemple);
router.get('/my-temples', protect, authorize('organizer'), organizerController.getTemplesByOrganizer);
router.put('/temple/:id', protect, authorize('organizer'), upload.single('templeImage'), organizerController.updateTemple);
router.delete('/temple/:id', protect, authorize('organizer'), organizerController.deleteTemple);

// Darshan Management
router.post('/darshan', protect, authorize('organizer'), darshanValidation.create, organizerController.createDarshan);
router.get('/my-darshans', protect, authorize('organizer'), organizerController.getDarshansByOrganizer);
router.put('/darshan/:id', protect, authorize('organizer'), organizerController.updateDarshan);
router.delete('/darshan/:id', protect, authorize('organizer'), organizerController.deleteDarshan);

// Booking Management
router.get('/bookings', protect, authorize('organizer'), organizerController.getOrganizerBookings);
router.put('/booking/:id/status', protect, authorize('organizer'), organizerController.updateBookingStatus);

// Event Management
router.post('/event', protect, authorize('organizer'), upload.single('eventImage'), organizerController.createEvent);
router.get('/my-events', protect, authorize('organizer'), organizerController.getEventsByOrganizer);
router.put('/event/:id', protect, authorize('organizer'), upload.single('eventImage'), organizerController.updateEvent);
router.delete('/event/:id', protect, authorize('organizer'), organizerController.deleteEvent);

// Analytics
router.get('/stats', protect, authorize('organizer'), organizerController.getOrganizerStats);

module.exports = router;
