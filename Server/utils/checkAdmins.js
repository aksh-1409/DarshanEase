const mongoose = require('mongoose');

const mongoURI = "mongodb+srv://admin:akan123@darshanease.pfrekz8.mongodb.net/darshanease?appName=DarshanEase";

const AdminSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
}, { collection: 'admins' });

const Admin = mongoose.model('Admin', AdminSchema);

async function checkAdmins() {
  try {
    console.log("Connecting to Atlas...");
    await mongoose.connect(mongoURI);
    console.log("Connected successfully.");

    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admin accounts in database:`);
    admins.forEach((admin, i) => {
      console.log(`${i+1}. Name: ${admin.name}, Email: ${admin.email}, Role: ${admin.role}`);
    });

  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

checkAdmins();
