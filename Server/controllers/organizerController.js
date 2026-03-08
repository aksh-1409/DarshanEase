const Organizer = require('../models/Organizer');
const Temple = require('../models/Temple');
const Darshan = require('../models/Darshan');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { AppError } = require('../utils/errorHandler');

// Organizer Login
exports.ologin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const organizer = await Organizer.findOne({ email });
        
        if (!organizer) {
            return res.status(404).json({
                success: false,
                message: "Organizer not found"
            });
        }

        if (!organizer.isActive) {
            return res.status(403).json({
                success: false,
                message: "Account is deactivated"
            });
        }

        if (!organizer.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Account is pending approval"
            });
        }

        const isMatch = await comparePassword(password, organizer.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = generateToken(organizer._id, organizer.role);

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: organizer._id,
                name: organizer.name,
                email: organizer.email,
                role: organizer.role,
                isApproved: organizer.isApproved
            }
        });
    } catch (err) {
        next(err);
    }
};

// Organizer Signup
exports.osignup = async (req, res, next) => {
    const { name, email, password, phone } = req.body;
    try {
        const existing = await Organizer.findOne({ email });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Email already registered"
            });
        }

        const hashedPassword = await hashPassword(password);
        
        const organizer = await Organizer.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'organizer',
            isApproved: false
        });

        res.status(201).json({
            success: true,
            message: "Account created successfully. Waiting for admin approval.",
            user: {
                id: organizer._id,
                name: organizer.name,
                email: organizer.email,
                isApproved: organizer.isApproved
            }
        });
    } catch (err) {
        next(err);
    }
};

// Get organizer profile
exports.getOrganizerProfile = async (req, res, next) => {
    try {
        const organizer = await Organizer.findById(req.user.id).select('-password');
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

// Update organizer profile
exports.updateOrganizerProfile = async (req, res, next) => {
    try {
        const { name, email, phone, password } = req.body;
        
        const updateData = { name, email, phone };
        if (password) {
            updateData.password = await hashPassword(password);
        }

        const organizer = await Organizer.findByIdAndUpdate(
            req.user.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        if (!organizer) {
            return next(new AppError('Organizer not found', 404));
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: organizer
        });
    } catch (err) {
        next(err);
    }
};

// ============ TEMPLE MANAGEMENT ============

// Create temple
exports.createTemple = async (req, res, next) => {
    try {
        const { templeName, location, description, darshanStartTime, darshanEndTime, facilities } = req.body;
        const templeImage = req.file?.path;

        if (!templeImage) {
            return res.status(400).json({
                success: false,
                message: "Temple image is required"
            });
        }

        const organizer = await Organizer.findById(req.user.id);

        const temple = await Temple.create({
            organizerId: req.user.id,
            organizerName: organizer.name,
            templeName,
            location,
            description,
            darshanStartTime,
            darshanEndTime,
            templeImage,
            facilities: facilities ? facilities.split(',').map(f => f.trim()) : []
        });

        res.status(201).json({
            success: true,
            message: "Temple created successfully",
            data: temple
        });
    } catch (err) {
        next(err);
    }
};

// Get temples by organizer
exports.getTemplesByOrganizer = async (req, res, next) => {
    try {
        const temples = await Temple.find({ organizerId: req.user.id }).sort('-createdAt');
        res.json({
            success: true,
            count: temples.length,
            data: temples
        });
    } catch (err) {
        next(err);
    }
};

// Get all temples (public)
exports.getAllTemples = async (req, res, next) => {
    try {
        const temples = await Temple.find({ isActive: true })
            .populate('organizerId', 'name')
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

// Get temple by ID
exports.getTempleById = async (req, res, next) => {
    try {
        const temple = await Temple.findById(req.params.id)
            .populate('organizerId', 'name email phone');
        
        if (!temple) {
            return next(new AppError('Temple not found', 404));
        }

        res.json({
            success: true,
            data: temple
        });
    } catch (err) {
        next(err);
    }
};

// Update temple
exports.updateTemple = async (req, res, next) => {
    try {
        const { templeName, location, description, darshanStartTime, darshanEndTime, facilities, isActive } = req.body;
        
        const temple = await Temple.findById(req.params.id);
        
        if (!temple) {
            return next(new AppError('Temple not found', 404));
        }

        // Check ownership
        if (temple.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to update this temple', 403));
        }

        const updateData = {
            templeName,
            location,
            description,
            darshanStartTime,
            darshanEndTime,
            isActive
        };

        if (facilities) {
            updateData.facilities = facilities.split(',').map(f => f.trim());
        }

        if (req.file) {
            updateData.templeImage = req.file.path;
        }

        const updatedTemple = await Temple.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Temple updated successfully",
            data: updatedTemple
        });
    } catch (err) {
        next(err);
    }
};

// Delete temple
exports.deleteTemple = async (req, res, next) => {
    try {
        const temple = await Temple.findById(req.params.id);
        
        if (!temple) {
            return next(new AppError('Temple not found', 404));
        }

        // Check ownership
        if (temple.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to delete this temple', 403));
        }

        await Temple.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Temple deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ DARSHAN MANAGEMENT ============

// Create darshan slot
exports.createDarshan = async (req, res, next) => {
    try {
        const {
            darshanName,
            templeId,
            date,
            startTime,
            endTime,
            description,
            totalSeats,
            normalPrice,
            vipPrice
        } = req.body;

        const temple = await Temple.findById(templeId);
        
        if (!temple) {
            return next(new AppError('Temple not found', 404));
        }

        // Check ownership
        if (temple.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to create darshan for this temple', 403));
        }

        const darshan = await Darshan.create({
            darshanName,
            templeId,
            templeName: temple.templeName,
            templeImage: temple.templeImage,
            location: temple.location,
            date,
            startTime,
            endTime,
            description,
            totalSeats,
            availableSeats: totalSeats,
            prices: {
                normal: normalPrice || 0,
                vip: vipPrice || 0
            },
            organizerId: req.user.id,
            organizerName: temple.organizerName
        });

        res.status(201).json({
            success: true,
            message: "Darshan slot created successfully",
            data: darshan
        });
    } catch (err) {
        next(err);
    }
};

// Get darshans by organizer
exports.getDarshansByOrganizer = async (req, res, next) => {
    try {
        const darshans = await Darshan.find({ organizerId: req.user.id })
            .populate('templeId', 'templeName location')
            .sort('-date');
        
        res.json({
            success: true,
            count: darshans.length,
            data: darshans
        });
    } catch (err) {
        next(err);
    }
};

// Get all darshans (public)
exports.getAllDarshans = async (req, res, next) => {
    try {
        const { templeId, date } = req.query;
        
        const filter = { isActive: true };
        if (templeId) filter.templeId = templeId;
        if (date) filter.date = { $gte: new Date(date) };

        const darshans = await Darshan.find(filter)
            .populate('templeId', 'templeName location templeImage')
            .sort('date');
        
        res.json({
            success: true,
            count: darshans.length,
            data: darshans
        });
    } catch (err) {
        next(err);
    }
};

// Update darshan
exports.updateDarshan = async (req, res, next) => {
    try {
        const darshan = await Darshan.findById(req.params.id);
        
        if (!darshan) {
            return next(new AppError('Darshan not found', 404));
        }

        // Check ownership
        if (darshan.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to update this darshan', 403));
        }

        const updatedDarshan = await Darshan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Darshan updated successfully",
            data: updatedDarshan
        });
    } catch (err) {
        next(err);
    }
};

// Delete darshan
exports.deleteDarshan = async (req, res, next) => {
    try {
        const darshan = await Darshan.findById(req.params.id);
        
        if (!darshan) {
            return next(new AppError('Darshan not found', 404));
        }

        // Check ownership
        if (darshan.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to delete this darshan', 403));
        }

        await Darshan.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Darshan deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ BOOKING MANAGEMENT ============

// Get bookings for organizer's temples
exports.getOrganizerBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ organizerId: req.user.id })
            .populate('userId', 'name email phone')
            .populate('templeId', 'templeName')
            .populate('darshanId', 'darshanName date')
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

// Update booking status
exports.updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return next(new AppError('Booking not found', 404));
        }

        // Check ownership
        if (booking.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to update this booking', 403));
        }

        booking.status = status;
        await booking.save();

        res.json({
            success: true,
            message: "Booking status updated successfully",
            data: booking
        });
    } catch (err) {
        next(err);
    }
};

// ============ EVENT MANAGEMENT ============

// Create event
exports.createEvent = async (req, res, next) => {
    try {
        const { templeId, eventName, description, eventDate, startTime, endTime } = req.body;
        const eventImage = req.file?.path;

        const temple = await Temple.findById(templeId);
        
        if (!temple) {
            return next(new AppError('Temple not found', 404));
        }

        // Check ownership
        if (temple.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to create event for this temple', 403));
        }

        const event = await Event.create({
            templeId,
            templeName: temple.templeName,
            organizerId: req.user.id,
            eventName,
            description,
            eventDate,
            startTime,
            endTime,
            eventImage
        });

        res.status(201).json({
            success: true,
            message: "Event created successfully",
            data: event
        });
    } catch (err) {
        next(err);
    }
};

// Get events by organizer
exports.getEventsByOrganizer = async (req, res, next) => {
    try {
        const events = await Event.find({ organizerId: req.user.id })
            .populate('templeId', 'templeName location')
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

// Get all events (public)
exports.getAllEvents = async (req, res, next) => {
    try {
        const events = await Event.find({ isActive: true })
            .populate('templeId', 'templeName location templeImage')
            .sort('eventDate');
        
        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (err) {
        next(err);
    }
};

// Update event
exports.updateEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return next(new AppError('Event not found', 404));
        }

        // Check ownership
        if (event.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to update this event', 403));
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.eventImage = req.file.path;
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: "Event updated successfully",
            data: updatedEvent
        });
    } catch (err) {
        next(err);
    }
};

// Delete event
exports.deleteEvent = async (req, res, next) => {
    try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
            return next(new AppError('Event not found', 404));
        }

        // Check ownership
        if (event.organizerId.toString() !== req.user.id) {
            return next(new AppError('Not authorized to delete this event', 403));
        }

        await Event.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Event deleted successfully"
        });
    } catch (err) {
        next(err);
    }
};

// ============ ANALYTICS ============

// Get organizer dashboard stats
exports.getOrganizerStats = async (req, res, next) => {
    try {
        const [
            totalTemples,
            totalDarshans,
            totalBookings,
            totalRevenue,
            recentBookings
        ] = await Promise.all([
            Temple.countDocuments({ organizerId: req.user.id }),
            Darshan.countDocuments({ organizerId: req.user.id }),
            Booking.countDocuments({ organizerId: req.user.id }),
            Booking.aggregate([
                { $match: { organizerId: req.user.id } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.find({ organizerId: req.user.id })
                .sort('-createdAt')
                .limit(10)
                .populate('userId', 'name')
                .populate('templeId', 'templeName')
        ]);

        res.json({
            success: true,
            data: {
                totalTemples,
                totalDarshans,
                totalBookings,
                totalRevenue: totalRevenue[0]?.total || 0,
                recentBookings
            }
        });
    } catch (err) {
        next(err);
    }
};
