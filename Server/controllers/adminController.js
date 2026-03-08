const Admin = require('../models/Admin');
const User = require('../models/User');
const Organizer = require('../models/Organizer');
const Temple = require('../models/Temple');
const Darshan = require('../models/Darshan');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const Donation = require('../models/Donation');
const Event = require('../models/Event');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { AppError } = require('../utils/errorHandler');

// Admin Login
exports.alogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found"
            });
        }

        const isMatch = await comparePassword(password, admin.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(admin._id, admin.role);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// Admin Signup
exports.asignup = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const existing = await Admin.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await hashPassword(password);
        
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        const token = generateToken(admin._id, admin.role);

        res.status(201).json({
            success: true,
            message: "Admin account created successfully",
            token,
            user: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// ============ USER MANAGEMENT ============

// Get all users
exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (err) {
        next(err);
    }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// Update user
exports.updateUser = async (req, res, next) => {
    try {
        const { name, email, phone, address, isActive } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, address, isActive },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }
        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ ORGANIZER MANAGEMENT ============

// Get all organizers
exports.getAllOrganizers = async (req, res, next) => {
    try {
        const organizers = await Organizer.find().select('-password').sort('-createdAt');
        res.json({
            success: true,
            count: organizers.length,
            data: organizers
        });
    } catch (err) {
        next(err);
    }
};

// Get organizer by ID
exports.getOrganizerById = async (req, res, next) => {
    try {
        const organizer = await Organizer.findById(req.params.id).select('-password');
        if (!organizer) {
            return next(new AppError('Organizer not found', 404));
        }
        res.json({
            success: true,
            data: organizer
        });
    } catch (err) {
        next(err);
    }
};

// Update organizer
exports.updateOrganizer = async (req, res, next) => {
    try {
        const { name, email, phone, isActive, isApproved } = req.body;
        
        const organizer = await Organizer.findByIdAndUpdate(
            req.params.id,
            { name, email, phone, isActive, isApproved },
            { new: true, runValidators: true }
        ).select('-password');

        if (!organizer) {
            return next(new AppError('Organizer not found', 404));
        }

        res.json({
            success: true,
            message: "Organizer updated successfully",
            data: organizer
        });
    } catch (err) {
        next(err);
    }
};

// Delete organizer
exports.deleteOrganizer = async (req, res, next) => {
    try {
        const organizer = await Organizer.findByIdAndDelete(req.params.id);
        if (!organizer) {
            return next(new AppError('Organizer not found', 404));
        }
        res.json({
            success: true,
            message: "Organizer deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// Approve organizer
exports.approveOrganizer = async (req, res, next) => {
    try {
        const organizer = await Organizer.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        ).select('-password');

        if (!organizer) {
            return next(new AppError('Organizer not found', 404));
        }

        res.json({
            success: true,
            message: "Organizer approved successfully",
            data: organizer
        });
    } catch (err) {
        next(err);
    }
};

// ============ TEMPLE MANAGEMENT ============

// Get all temples
exports.getAllTemples = async (req, res, next) => {
    try {
        const temples = await Temple.find()
            .populate('organizerId', 'name email')
            .sort('-createdAt');
        res.json({
            success: true,
            count: temples.length,
            data: temples
        });
    } catch (err) {
        next(err);
    }
};

// Delete temple
exports.deleteTemple = async (req, res, next) => {
    try {
        const temple = await Temple.findByIdAndDelete(req.params.id);
        if (!temple) {
            return next(new AppError('Temple not found', 404));
        }
        res.json({
            success: true,
            message: "Temple deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ DARSHAN MANAGEMENT ============

// Get all darshans
exports.getAllDarshans = async (req, res, next) => {
    try {
        const darshans = await Darshan.find()
            .populate('templeId', 'templeName location')
            .populate('organizerId', 'name')
            .sort('-createdAt');
        res.json({
            success: true,
            count: darshans.length,
            data: darshans
        });
    } catch (err) {
        next(err);
    }
};

// Delete darshan
exports.deleteDarshan = async (req, res, next) => {
    try {
        const darshan = await Darshan.findByIdAndDelete(req.params.id);
        if (!darshan) {
            return next(new AppError('Darshan not found', 404));
        }
        res.json({
            success: true,
            message: "Darshan deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ BOOKING MANAGEMENT ============

// Get all bookings
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('templeId', 'templeName')
            .populate('organizerId', 'name')
            .sort('-createdAt');
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// ============ FEEDBACK MANAGEMENT ============

// Get all feedback
exports.getAllFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.find()
            .populate('userId', 'name')
            .populate('templeId', 'templeName')
            .sort('-createdAt');
        res.json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (err) {
        next(err);
    }
};

// Approve/Reject feedback
exports.updateFeedbackStatus = async (req, res, next) => {
    try {
        const { isApproved } = req.body;
        
        const feedback = await Feedback.findByIdAndUpdate(
            req.params.id,
            { isApproved },
            { new: true }
        );

        if (!feedback) {
            return next(new AppError('Feedback not found', 404));
        }

        res.json({
            success: true,
            message: `Feedback ${isApproved ? 'approved' : 'rejected'} successfully`,
            data: feedback
        });
    } catch (err) {
        next(err);
    }
};

// Delete feedback
exports.deleteFeedback = async (req, res, next) => {
    try {
        const feedback = await Feedback.findByIdAndDelete(req.params.id);
        if (!feedback) {
            return next(new AppError('Feedback not found', 404));
        }
        res.json({
            success: true,
            message: "Feedback deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ DONATION MANAGEMENT ============

// Get all donations
exports.getAllDonations = async (req, res, next) => {
    try {
        const donations = await Donation.find()
            .populate('userId', 'name email')
            .populate('templeId', 'templeName')
            .sort('-createdAt');
        res.json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        next(err);
    }
};

// ============ EVENT MANAGEMENT ============

// Get all events
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find()
            .populate('templeId', 'templeName')
            .populate('organizerId', 'name')
            .sort('-eventDate');
        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (err) {
        next(err);
    }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return next(new AppError('Event not found', 404));
        }
        res.json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ ANALYTICS & REPORTS ============

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalOrganizers,
            totalTemples,
            totalBookings,
            totalDonations,
            recentBookings,
            popularTemples
        ] = await Promise.all([
            User.countDocuments(),
            Organizer.countDocuments(),
            Temple.countDocuments(),
            Booking.countDocuments(),
            Donation.aggregate([
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]),
            Booking.find().sort('-createdAt').limit(10)
                .populate('userId', 'name')
                .populate('templeId', 'templeName'),
            Booking.aggregate([
                { $group: { _id: '$templeId', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalOrganizers,
                totalTemples,
                totalBookings,
                totalDonations: totalDonations[0]?.total || 0,
                recentBookings,
                popularTemples
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get booking analytics
exports.getBookingAnalytics = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.query;
        
        const matchStage = {};
        if (startDate && endDate) {
            matchStage.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const analytics = await Booking.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } }
        ]);

        res.json({
            success: true,
            data: analytics
        });
    } catch (err) {
        next(err);
    }
};

// Get popular temples analytics
exports.getPopularTemples = async (req, res, next) => {
    try {
        const popularTemples = await Booking.aggregate([
            {
                $group: {
                    _id: '$templeId',
                    bookingCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { bookingCount: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'temples',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'templeInfo'
                }
            },
            { $unwind: '$templeInfo' },
            {
                $project: {
                    templeName: '$templeInfo.templeName',
                    location: '$templeInfo.location',
                    bookingCount: 1,
                    totalRevenue: 1
                }
            }
        ]);

        res.json({
            success: true,
            data: popularTemples
        });
    } catch (err) {
        next(err);
    }
};

// Get devotee demographics
exports.getDevoteeDemographics = async (req, res, next) => {
    try {
        const [
            genderDistribution,
            ageDistribution,
            locationDistribution,
            activeUsers
        ] = await Promise.all([
            User.aggregate([
                {
                    $group: {
                        _id: '$gender',
                        count: { $sum: 1 }
                    }
                }
            ]),
            User.aggregate([
                {
                    $project: {
                        ageGroup: {
                            $switch: {
                                branches: [
                                    { case: { $lt: ['$age', 18] }, then: 'Under 18' },
                                    { case: { $and: [{ $gte: ['$age', 18] }, { $lt: ['$age', 30] }] }, then: '18-29' },
                                    { case: { $and: [{ $gte: ['$age', 30] }, { $lt: ['$age', 45] }] }, then: '30-44' },
                                    { case: { $and: [{ $gte: ['$age', 45] }, { $lt: ['$age', 60] }] }, then: '45-59' }
                                ],
                                default: '60+'
                            }
                        }
                    }
                },
                {
                    $group: {
                        _id: '$ageGroup',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            User.aggregate([
                {
                    $group: {
                        _id: '$address',
                        count: { $sum: 1 }
                    }
                },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            User.countDocuments({ isActive: true })
        ]);

        res.json({
            success: true,
            data: {
                genderDistribution,
                ageDistribution,
                locationDistribution,
                activeUsers,
                totalUsers: await User.countDocuments()
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get booking trends
exports.getBookingTrends = async (req, res, next) => {
    try {
        const last6Months = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const statusDistribution = await Booking.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                monthlyTrends: last6Months,
                statusDistribution
            }
        });
    } catch (err) {
        next(err);
    }
};
