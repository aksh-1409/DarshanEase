const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Temple image storage — organized in darshanease/temples/
const templeStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'darshanease/temples',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

// Event image storage — organized in darshanease/events/
const eventStorage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'darshanease/events',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [
            { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
        ]
    }
});

const uploadTemple = multer({ storage: templeStorage });
const uploadEvent = multer({ storage: eventStorage });

// Keep a generic 'upload' export for backward compatibility
const upload = multer({ storage: templeStorage });

module.exports = { cloudinary, upload, uploadTemple, uploadEvent };
