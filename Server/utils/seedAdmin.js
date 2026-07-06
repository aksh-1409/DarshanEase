const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const mongoURI = "mongodb+srv://admin:akan123@darshanease.pfrekz8.mongodb.net/darshanease?appName=DarshanEase";

const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  isActive: { type: Boolean, default: true }
}, { collection: 'admins', timestamps: true });

const Admin = mongoose.model('Admin', AdminSchema);

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoURI);
    console.log("Connected successfully.");

    // 1. Delete all existing admins
    console.log("Cleaning up existing admin accounts...");
    const deleteResult = await Admin.deleteMany({});
    console.log(`Deleted ${deleteResult.deletedCount} old admin accounts.`);

    // 2. Hash password for new master admin
    const password = "AdminPassword123!"; // You can change this
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the single master admin
    const masterAdmin = await Admin.create({
      name: "Master Admin",
      email: "admin@darshanease.com", // You can change this email
      password: hashedPassword,
      role: "admin"
    });

    console.log("\n==========================================");
    console.log("🟢 SUCCESS: Master Admin Account Created!");
    console.log(`Email: ${masterAdmin.email}`);
    console.log(`Password: ${password}`);
    console.log("==========================================\n");

  } catch (error) {
    console.error("❌ Seeding failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

seedAdmin();
