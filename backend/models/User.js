import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // ─────────────────────────────
    // AUTHENTICATION
    // ─────────────────────────────
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Prevent password from being returned in queries
    },

    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 30,
      trim: true,
      match: /^[a-zA-Z0-9_]+$/, // only letters, numbers, underscores
    },

    // ─────────────────────────────
    // ORGANIZATION / SCHOOL
    // ─────────────────────────────
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School", // Best practice: reference School collection
      required: true,
    },

    position: {
      type: String,
      enum: ["teacher", "admin", "clerk", "staff", "principal"],
      default: "staff",
      required: true,
    },

    access: {
      type: String,
      enum: ["owner", "operator", "employee"],
      default: "employee",
    },

    // ─────────────────────────────
    // PERSONAL DETAILS
    // ─────────────────────────────
    aadhar: {
      type: String,
      match: /^\d{12}$/, // 12-digit validation
      required: false,
    },

    name: {
      type: String,
      required: true,
      maxlength: 100,
      trim: true,
    },

    address: {
      type: String,
      maxlength: 200,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: false,
    },

    contact: {
      type: String,
      match: /^\d{10}$/, // 10-digit validation
      required: false,
    },

    // ─────────────────────────────
    // ACCOUNT / SECURITY
    // ─────────────────────────────
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    accountStatus: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
    },

    accountLockedUntil: {
      type: Date,
      default: null,
    },

    refreshToken: {
      type: String, // For JWT refresh tokens
      select: false,
    },

    // ─────────────────────────────
    // SYSTEM CONTROL
    // ─────────────────────────────
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete: no data is actually removed
    },

    lastLogin: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
