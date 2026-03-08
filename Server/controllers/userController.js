const User = require('../models/User');
const Darshan = require('../models/Darshan');
const Booking = require('../models/Booking');
const Feedback = require('../models/Feedback');
const Donation = require('../models/Donation');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { AppError } = require('../utils/errorHandler');

// User Login
exports.ulogin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        const isMatch = await comparePassword(password, user.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(user._id, user.role);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// User Signup
exports.usignup = async (req, res, next) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await hashPassword(password);
        
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address,
            role: 'user'
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get all users (Admin only)
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
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
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// Update user
exports.updateUser = async (req, res, next) => {
    const { name, email, password, phone, address } = req.body;
    try {
        const updateData = { name, email, phone, address };
        
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const updated = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!updated) {
            return next(new AppError('User not found', 404));
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: updated
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
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// Get darshan by ID
exports.getDarshanById = async (req, res, next) => {
    try {
        const darshan = await Darshan.findById(req.params.id)
            .populate('templeId', 'templeName location')
            .populate('organizerId', 'name email');
        
        if (!darshan) {
            return next(new AppError('Darshan not found', 404));
        }

        res.json({
            success: true,
            data: darshan
        });
    } catch (err) {
        next(err);
    }
};

// Create booking
exports.createBooking = async (req, res, next) => {
    try {
        const { darshanId, quantity, ticketType, phone } = req.body;
        
        // Get darshan details
        const darshan = await Darshan.findById(darshanId);
        if (!darshan) {
            return next(new AppError('Darshan not found', 404));
        }

        // Check availability
        if (darshan.availableSeats < quantity) {
            return res.status(400).json({
                success: false,
                message: `Only ${darshan.availableSeats} seats available`
            });
        }

        // Calculate total amount
        const pricePerSeat = ticketType === 'vip' ? darshan.prices.vip : darshan.prices.normal;
        const totalAmount = pricePerSeat * quantity;

        // Get user details
        const user = await User.findById(req.user.id);

        // Create booking
        const booking = await Booking.create({
            userId: req.user.id,
            userName: user.name,
            email: user.email,
            phone: phone || user.phone,
            darshanId: darshan._id,
            darshanName: darshan.darshanName,
            templeId: darshan.templeId,
            templeName: darshan.templeName,
            templeImage: darshan.templeImage,
            location: darshan.location,
            startTime: darshan.startTime,
            endTime: darshan.endTime,
            description: darshan.description,
            organizerId: darshan.organizerId,
            organizerName: darshan.organizerName,
            quantity,
            ticketType,
            totalAmount,
            darshanDate: darshan.date,
            status: 'confirmed',
            paymentStatus: 'completed'
        });

        // Update available seats
        darshan.availableSeats -= quantity;
        await darshan.save();

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// Get user bookings
exports.getBookingsByUser = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId })
            .sort('-createdAt')
            .populate('templeId', 'templeName location')
            .populate('darshanId', 'darshanName date');
        
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .sort('-createdAt')
            .populate('userId', 'name email')
            .populate('templeId', 'templeName')
            .populate('organizerId', 'name');
        
        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (err) {
        next(err);
    }
};

// Cancel/Delete booking
exports.deleteBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        // Restore seats if booking is being cancelled
        if (booking.status === 'confirmed') {
            const darshan = await Darshan.findById(booking.darshanId);
            if (darshan) {
                darshan.availableSeats += booking.quantity;
                await darshan.save();
            }
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully"
        });
    } catch (err) {
        next(err);
    }
};

// Create feedback
exports.createFeedback = async (req, res, next) => {
    try {
        const { templeId, rating, comment, bookingId } = req.body;
        
        const user = await User.findById(req.user.id);
        
        const feedback = await Feedback.create({
            userId: req.user.id,
            userName: user.name,
            templeId,
            rating,
            comment,
            bookingId
        });

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });
    } catch (err) {
        next(err);
    }
};

// Get feedback by temple
exports.getFeedbackByTemple = async (req, res, next) => {
    try {
        const feedback = await Feedback.find({
            templeId: req.params.templeId,
            isApproved: true
        }).populate('userId', 'name').sort('-createdAt');

        res.json({
            success: true,
            count: feedback.length,
            data: feedback
        });
    } catch (err) {
        next(err);
    }
};

// Create donation
exports.createDonation = async (req, res, next) => {
    try {
        const { templeId, amount, purpose, phone } = req.body;
        
        const user = await User.findById(req.user.id);
        
        const donation = await Donation.create({
            userId: req.user.id,
            userName: user.name,
            email: user.email,
            phone: phone || user.phone,
            templeId,
            amount,
            purpose,
            paymentStatus: 'completed',
            transactionId: 'TXN' + Date.now()
        });

        res.status(201).json({
            success: true,
            message: "Donation successful",
            data: donation
        });
    } catch (err) {
        next(err);
    }
};

// Get user donations
exports.getDonationsByUser = async (req, res, next) => {
    try {
        const donations = await Donation.find({ userId: req.params.userId })
            .sort('-createdAt')
            .populate('templeId', 'templeName location');

        res.json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (err) {
        next(err);
    }
};
