/**
 * DarshanEase — Local to Atlas HTTP Data Pusher
 * ===============================================
 * Reads all collections from local MongoDB and pushes them
 * to the deployed Render server via HTTP POST.
 *
 * This bypasses the port 27017 outbound firewall block.
 *
 * Run from Server/ directory:
 *   node scripts/pushLocalToAtlas.js
 */

const mongoose = require('mongoose');

// local connection
const LOCAL_URI = 'mongodb://127.0.0.1:27017/darshanease';
// deployed server URL
const DEPLOYED_SERVER_URL = 'https://darshanease-i0ch.onrender.com/api/migrate-data';

const COLLECTIONS = [
    'users',
    'organizers',
    'admins',
    'temples',
    'darshans',
    'bookings',
    'events',
    'feedbacks',
    'donations'
];

async function run() {
    console.log('\n🚀 Starting Local to Atlas HTTP Push...');
    console.log('Connecting to local MongoDB...');
    const conn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✓ Connected to local database');

    const db = conn.db;

    for (const name of COLLECTIONS) {
        console.log(`\n📦 Processing collection: ${name}`);
        const docs = await db.collection(name).find({}).toArray();

        if (docs.length === 0) {
            console.log(`   (No documents found, skipping)`);
            continue;
        }

        console.log(`   Found ${docs.length} documents. Sending to Render...`);

        try {
            const response = await fetch(DEPLOYED_SERVER_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    collectionName: name,
                    documents: docs
                })
            });

            const result = await response.json();
            if (response.ok && result.success) {
                console.log(`   ✓ Successfully migrated ${result.count} documents to Atlas!`);
            } else {
                console.error(`   ✗ Failed:`, result.message || 'Unknown error');
            }
        } catch (err) {
            console.error(`   ✗ Request failed:`, err.message);
        }
    }

    console.log('\n✅ Push finished!');
    await conn.close();
}

run().catch(err => {
    console.error('Fatal error:', err);
});
