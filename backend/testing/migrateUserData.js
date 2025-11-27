import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const migrateUserData = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://realUser:vestige5586@task-manager.84cf9tg.mongodb.net/schoolDH?retryWrites=true&w=majority"
    );
    console.log("✅ MongoDB Connected");

    // Get all users
    const users = await User.find().select("+password");
    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      let updated = false;

      // Fix aadhar: remove spaces and validate
      if (user.aadhar) {
        const cleanAadhar = user.aadhar.replace(/\s/g, "");
        if (cleanAadhar.length === 12 && /^\d{12}$/.test(cleanAadhar)) {
          user.aadhar = cleanAadhar;
          updated = true;
        } else {
          // Invalid aadhar, set to null
          user.aadhar = null;
          updated = true;
        }
      }

      // Fix gender: convert boolean to enum
      if (user.gender === "true" || user.gender === true) {
        user.gender = "male";
        updated = true;
      } else if (user.gender === "false" || user.gender === false) {
        user.gender = "female";
        updated = true;
      } else if (
        user.gender &&
        !["male", "female", "other"].includes(user.gender)
      ) {
        user.gender = null;
        updated = true;
      }

      if (updated) {
        await user.save({ validateBeforeSave: false });
        console.log(`✅ Migrated user: ${user.email}`);
      }
    }

    console.log("✅ Migration completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

migrateUserData();
