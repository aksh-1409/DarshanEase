/**
 * DarshanEase — Seed data for Atlas production DB
 * Seeds all temples, organizers, darshans, etc. directly into Atlas.
 * 
 * This file exports the seed handler — called once via a temporary API route.
 */

const mongoose = require('mongoose');

// ── All seeded Cloudinary image URLs (already migrated) ──────────────────────
const ORGANIZERS = [
    {
        _id: new mongoose.Types.ObjectId(),
        name: "Temple Trust Admin",
        email: "trust@darshanease.com",
        password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LPVImJ2QBSm", // "password123"
        phone: "9876543210",
        role: "organizer",
        isApproved: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

const TEMPLES = [
    {
        organizerName: "Temple Trust Admin",
        templeName: "Golden Temple",
        description: "The Golden Temple, also known as Harmandir Sahib, is the holiest Gurdwara of Sikhism. It is located in Amritsar, Punjab, India. The temple is built on a 67-ft square platform in the middle of the sacred tank.",
        location: "Amritsar, Punjab",
        darshanStartTime: "04:00",
        darshanEndTime: "22:00",
        templeImage: "https://res.cloudinary.com/obpfeoqo/image/upload/v1783441275/darshanease/landing/hveofpzwqogeqpwulpaa.jpg",
        facilities: ["Prasad Counter", "Langar Hall", "Cloak Room", "Medical Aid"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        organizerName: "Temple Trust Admin",
        templeName: "Kashi Vishwanath Temple",
        description: "One of the most famous Hindu temples dedicated to Lord Shiva. Kashi Vishwanath Temple is located in Varanasi, Uttar Pradesh, India. It is one of the twelve Jyotirlingas, the holiest of Shiva temples.",
        location: "Varanasi, Uttar Pradesh",
        darshanStartTime: "03:00",
        darshanEndTime: "23:00",
        templeImage: "https://res.cloudinary.com/obpfeoqo/image/upload/v1783441278/darshanease/landing/oibrwih6ocxlke5cpj6r.jpg",
        facilities: ["Prasad Shop", "Locker Facility", "Wheelchair Access", "Parking"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        organizerName: "Temple Trust Admin",
        templeName: "Kedarnath Temple",
        description: "Kedarnath Temple is a Hindu temple dedicated to Lord Shiva. It is one of the twelve Jyotirlingas. Located in the Rudraprayag district of Uttarakhand, it is surrounded by the Himalayan ranges.",
        location: "Kedarnath, Uttarakhand",
        darshanStartTime: "06:00",
        darshanEndTime: "21:00",
        templeImage: "https://res.cloudinary.com/obpfeoqo/image/upload/v1783441280/darshanease/landing/nb6xi82zuhs3b0neebzc.jpg",
        facilities: ["Helicopter Service", "Lodging", "Medical Aid", "Prasad Counter"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        organizerName: "Temple Trust Admin",
        templeName: "Tirupati Balaji Temple",
        description: "Sri Venkateswara Temple is a Hindu temple situated in Tirumala, Tirupati. Dedicated to Lord Venkateswara, it is one of the most visited pilgrimage centres in the world.",
        location: "Tirupati, Andhra Pradesh",
        darshanStartTime: "05:00",
        darshanEndTime: "23:00",
        templeImage: "https://res.cloudinary.com/obpfeoqo/image/upload/v1783441281/darshanease/landing/vfnwddjbumd5r9lcfwpp.jpg",
        facilities: ["Prasad Counter", "Cloak Room", "Accommodation", "Medical Center", "Parking"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        organizerName: "Temple Trust Admin",
        templeName: "Somnath Temple",
        description: "Somnath Temple is one of the most sacred pilgrimage sites in India. It is the first among the twelve Jyotirlinga shrines of Shiva. Located on the western coast of Gujarat at Prabhas Patan near Veraval.",
        location: "Veraval, Gujarat",
        darshanStartTime: "06:00",
        darshanEndTime: "22:00",
        templeImage: "https://res.cloudinary.com/obpfeoqo/image/upload/v1783441275/darshanease/landing/hveofpzwqogeqpwulpaa.jpg",
        facilities: ["Prasad Shop", "Cloak Room", "Parking", "Sound & Light Show"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        organizerName: "Temple Trust Admin",
        templeName: "Ramanathaswamy Temple",
        description: "Ramanathaswamy Temple is a Hindu temple dedicated to Lord Shiva located on Rameswaram island. It is one of the twelve Jyotirlingas and also considered one of the Char Dhams.",
        location: "Rameswaram, Tamil Nadu",
        darshanStartTime: "05:00",
        darshanEndTime: "21:00",
        templeImage: "https://res.cloudinary.com/obpfeoqo/image/upload/v1783441278/darshanease/landing/oibrwih6ocxlke5cpj6r.jpg",
        facilities: ["Sacred Theerthas", "Prasad Counter", "Accommodation", "Parking"],
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

async function seedDatabase(req, res) {
    try {
        const db = mongoose.connection.db;

        // ── Wipe existing data ────────────────────────────────────────────────
        await db.collection('temples').deleteMany({});
        await db.collection('organizers').deleteMany({});

        // ── Insert organizer, link temples ────────────────────────────────────
        const orgResult = await db.collection('organizers').insertOne(ORGANIZERS[0]);
        const organizerId = orgResult.insertedId;

        // Attach organizerId to each temple
        const templesWithOrg = TEMPLES.map(t => ({
            ...t,
            organizerId,
            _id: new mongoose.Types.ObjectId()
        }));

        const templeResult = await db.collection('temples').insertMany(templesWithOrg);

        return res.json({
            success: true,
            message: `✅ Seeded successfully! ${Object.keys(templeResult.insertedIds).length} temples + 1 organizer inserted into Atlas.`,
            temples: templesWithOrg.map(t => t.templeName)
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { seedDatabase };
