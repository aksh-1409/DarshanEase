/**
 * DarshanEase — Local → Atlas Data Migration
 * ============================================
 * Copies all collections from local MongoDB to Atlas MongoDB.
 * The local DB already has Cloudinary URLs (from the image migration).
 *
 * Run once from Server/ directory:
 *   node scripts/migrateToAtlas.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// ── Connection URIs ───────────────────────────────────────────────────────────
const LOCAL_URI  = 'mongodb://127.0.0.1:27017/darshanease';
const ATLAS_URI  = 'mongodb+srv://admin:akan123@darshanease.pfrekz8.mongodb.net/darshanease?appName=DarshanEase';

// ── Collections to migrate ───────────────────────────────────────────────────
const COLLECTIONS = [
    'temples',
    'organizers',
    'users',
    'admins',
    'darshans',
    'bookings',
    'events',
    'feedbacks',
    'donations'
];

async function migrate() {
    console.log('\n🚀 DarshanEase — Local → Atlas Migration\n');
    console.log('━'.repeat(55));

    // ── Connect to both DBs ───────────────────────────────────────────────────
    console.log('\n📦 Connecting to Local MongoDB...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('   ✓ Local connected');

    console.log('☁️  Connecting to Atlas...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('   ✓ Atlas connected\n');

    const localDb = localConn.db;
    const atlasDb = atlasConn.db;

    let totalMigrated = 0;
    let totalSkipped  = 0;

    // ── Migrate each collection ───────────────────────────────────────────────
    for (const collectionName of COLLECTIONS) {
        process.stdout.write(`📂 Migrating '${collectionName}' ... `);

        try {
            // Fetch all documents from local
            const docs = await localDb.collection(collectionName).find({}).toArray();

            if (docs.length === 0) {
                console.log('(empty, skipped)');
                totalSkipped++;
                continue;
            }

            // Drop existing data on Atlas for this collection (clean slate)
            await atlasDb.collection(collectionName).deleteMany({});

            // Insert all docs into Atlas
            await atlasDb.collection(collectionName).insertMany(docs, { ordered: false });

            console.log(`✓  ${docs.length} documents migrated`);
            totalMigrated += docs.length;

        } catch (err) {
            console.log(`✗  Error: ${err.message}`);
        }
    }

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('\n' + '━'.repeat(55));
    console.log('✅  MIGRATION COMPLETE');
    console.log('━'.repeat(55));
    console.log(`   Total documents migrated : ${totalMigrated}`);
    console.log(`   Collections skipped      : ${totalSkipped} (were empty)`);
    console.log('\n🌐 Your Atlas database now has all your local data!');
    console.log('   Temple images → already pointing to Cloudinary ✅');
    console.log('━'.repeat(55) + '\n');

    await localConn.close();
    await atlasConn.close();
}

migrate().catch(err => {
    console.error('\n❌ Migration failed:', err.message);
    process.exit(1);
});
