import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import School from "../models/School.js";

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://realUser:vestige5586@task-manager.84cf9tg.mongodb.net/schoolDH?retryWrites=true&w=majority"
    );
    console.log("✅ MongoDB Connected");

    // 1. Create or Find School
    let school = await School.findOne({ code: "GW001" });
    if (!school) {
      school = new School({
        name: "Greenwood High School",
        address: "123 Education Lane, Knowledge City",
        code: "GW001",
        contactEmail: "info@greenwood.edu",
        contactPhone: "9876543210",
      });
      await school.save();
      console.log("🏫 School created: Greenwood High School");
    } else {
      console.log("🏫 School already exists: Greenwood High School");
    }

    // 2. Update All Existing Users
    const updateResult = await User.updateMany(
      {},
      { $set: { school: school._id } }
    );
    console.log(
      `👥 Updated ${updateResult.modifiedCount} users with school ID.`
    );

    // 3. Create Admin User
    const adminEmail = "admin@school.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin = new User({
        email: adminEmail,
        password: hashedPassword,
        username: "admin_master",
        school: school._id,
        position: "admin",
        access: "owner",
        name: "Super Admin",
        address: "Admin Office",
        gender: "other",
        contact: "9999999999",
        profileCompleted: true,
        accountStatus: "active",
      });
      await admin.save();
      console.log(
        "👑 Admin user created (email: admin@school.com, pass: admin123)"
      );
    } else {
      console.log("👑 Admin user already exists");
    }

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();
