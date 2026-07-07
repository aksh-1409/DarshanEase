/**
 * DarshanEase — One-Time Cloudinary Migration Script
 * ====================================================
 * 1. Uploads all images in Server/uploads/ to Cloudinary
 * 2. Updates MongoDB Temple & Event documents to use Cloudinary URLs
 * 3. Uploads Client/public/temple1-4.jpg to Cloudinary and prints new URLs
 *    (you'll paste those URLs into LandingPage.jsx)
 *
 * Run once from Server/ directory:
 *   node scripts/uploadToCloudinary.js
 */

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// ── Mongoose models (inline to avoid import complexity) ───────────────────────
const TempleSchema = new mongoose.Schema({ templeImage: String }, { strict: false });
const EventSchema  = new mongoose.Schema({ eventImage:  String }, { strict: false });
const Temple = mongoose.model('Temple', TempleSchema);
const Event  = mongoose.model('Event',  EventSchema);

// ── Paths ─────────────────────────────────────────────────────────────────────
const UPLOADS_DIR  = path.join(__dirname, '..', 'uploads');
const PUBLIC_DIR   = path.join(__dirname, '..', '..', 'Client', 'public');
const LANDING_IMGS = ['temple1.jpg', 'temple2.jpg', 'temple3.jpg', 'temple4.jpg'];

// ── Helpers ───────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function uploadFile(filePath, folder) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            use_filename: false,
            unique_filename: true,
            overwrite: false,
            transformation: [
                { width: 1200, crop: 'limit', quality: 'auto', fetch_format: 'auto' }
            ]
        });
        return result.secure_url;
    } catch (err) {
        console.error(`  ✗ Failed to upload ${filePath}:`, err.message);
        return null;
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
    console.log('\n🚀 DarshanEase — Cloudinary Migration\n');
    console.log('Cloud:', process.env.CLOUDINARY_CLOUD_NAME);

    // ── 1. Connect to MongoDB ─────────────────────────────────────────────────
    console.log('\n📦 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('   Connected ✓');

    // ── 2. Upload uploads/ folder images ─────────────────────────────────────
    console.log('\n📂 Scanning Server/uploads/ ...');
    const uploadFiles = fs.readdirSync(UPLOADS_DIR).filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    console.log(`   Found ${uploadFiles.length} images to migrate`);

    // Build a map: originalRelativePath → cloudinaryUrl
    const urlMap = {}; // e.g. 'uploads/abc.jpg' → 'https://res.cloudinary.com/...'
    let uploadedCount = 0;
    let failedCount   = 0;

    for (let i = 0; i < uploadFiles.length; i++) {
        const filename   = uploadFiles[i];
        const localPath  = path.join(UPLOADS_DIR, filename);
        const relPath    = `uploads/${filename}`;          // how it's stored in MongoDB
        const altRelPath = `uploads\\${filename}`;         // Windows backslash variant

        process.stdout.write(`   [${i + 1}/${uploadFiles.length}] Uploading ${filename} ... `);
        const url = await uploadFile(localPath, 'darshanease/uploads');
        if (url) {
            urlMap[relPath]    = url;
            urlMap[altRelPath] = url;
            uploadedCount++;
            console.log('✓');
        } else {
            failedCount++;
        }

        // Small delay to be kind to Cloudinary API rate limits
        if (i < uploadFiles.length - 1) await sleep(300);
    }

    // ── 3. Update MongoDB Temple records ─────────────────────────────────────
    console.log('\n🗄️  Updating Temple records in MongoDB...');
    const temples = await Temple.find({});
    let templeUpdated = 0;

    for (const temple of temples) {
        if (!temple.templeImage) continue;

        const newUrl = urlMap[temple.templeImage];
        if (newUrl && newUrl !== temple.templeImage) {
            await Temple.updateOne({ _id: temple._id }, { templeImage: newUrl });
            console.log(`   ✓ Temple "${temple.templeName || temple._id}": updated image URL`);
            templeUpdated++;
        } else if (!newUrl && !temple.templeImage.startsWith('http')) {
            console.log(`   ⚠ Temple "${temple.templeName || temple._id}": no Cloudinary URL found for "${temple.templeImage}"`);
        }
    }
    console.log(`   ${templeUpdated} temple records updated`);

    // ── 4. Update MongoDB Event records ──────────────────────────────────────
    console.log('\n🗄️  Updating Event records in MongoDB...');
    const events = await Event.find({});
    let eventUpdated = 0;

    for (const event of events) {
        if (!event.eventImage) continue;

        const newUrl = urlMap[event.eventImage];
        if (newUrl && newUrl !== event.eventImage) {
            await Event.updateOne({ _id: event._id }, { eventImage: newUrl });
            console.log(`   ✓ Event "${event.eventName || event._id}": updated image URL`);
            eventUpdated++;
        } else if (!newUrl && !event.eventImage.startsWith('http')) {
            console.log(`   ⚠ Event "${event.eventName || event._id}": no Cloudinary URL found for "${event.eventImage}"`);
        }
    }
    console.log(`   ${eventUpdated} event records updated`);

    // ── 5. Upload landing page images (temple1–4.jpg) ─────────────────────────
    console.log('\n🏛️  Uploading landing page temple images...');
    const landingUrls = {};

    for (const imgName of LANDING_IMGS) {
        const imgPath = path.join(PUBLIC_DIR, imgName);
        if (!fs.existsSync(imgPath)) {
            console.log(`   ⚠ ${imgName} not found at ${imgPath}`);
            continue;
        }
        process.stdout.write(`   Uploading ${imgName} ... `);
        const url = await uploadFile(imgPath, 'darshanease/landing');
        if (url) {
            landingUrls[imgName] = url;
            console.log('✓');
        }
        await sleep(300);
    }

    // ── 6. Summary ────────────────────────────────────────────────────────────
    console.log('\n' + '═'.repeat(60));
    console.log('✅ MIGRATION COMPLETE');
    console.log('═'.repeat(60));
    console.log(`   Uploads folder: ${uploadedCount} uploaded, ${failedCount} failed`);
    console.log(`   Temple records: ${templeUpdated} updated`);
    console.log(`   Event records:  ${eventUpdated} updated`);

    console.log('\n📋 Landing page Cloudinary URLs (copy these):');
    Object.entries(landingUrls).forEach(([name, url]) => {
        console.log(`   ${name}: ${url}`);
    });

    // Write landing URLs to a JSON file for easy reference
    const outputPath = path.join(__dirname, 'landing_cloudinary_urls.json');
    fs.writeFileSync(outputPath, JSON.stringify(landingUrls, null, 2));
    console.log(`\n💾 URLs also saved to: scripts/landing_cloudinary_urls.json`);
    console.log('═'.repeat(60) + '\n');

    await mongoose.disconnect();
}

main().catch(err => {
    console.error('\n❌ Migration failed:', err.message);
    mongoose.disconnect();
    process.exit(1);
});
