import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
export const signupUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    username: email.split("@")[0] + Math.floor(Math.random() * 1000), // Temp username
    school: "675c613045339d675628676d", // Placeholder, should be dynamic or handled in completeProfile
    name: "New User", // Placeholder
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");

  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.accountStatus !== "active") {
      res.status(403);
      throw new Error("Account is not active");
    }

    user.lastLogin = Date.now();
    user.failedLoginAttempts = 0;
    await user.save();

    res.json({
      _id: user._id,
      email: user.email,
      username: user.username,
      position: user.position,
      school: user.school,
      profileCompleted: user.profileCompleted,
      token: generateToken(user._id),
    });
  } else {
    if (user) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();
    }
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Complete user profile
// @route   POST /api/auth/complete-profile
// @access  Private
export const completeProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;
    user.name = req.body.fullName || user.name;
    user.school = req.body.school || user.school;
    user.position = req.body.position || user.position;
    user.aadhar = req.body.aadhar || user.aadhar;
    user.address = req.body.address || user.address;
    user.gender = req.body.gender || user.gender;
    user.contact = req.body.phone || user.contact;
    user.profileCompleted = true;

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      profileCompleted: updatedUser.profileCompleted,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate(
    "school",
    "name code"
  );

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Get all users
// @route   GET /api/auth/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate("school", "name code");
  res.json(users);
});

// @desc    Update user
// @route   PUT /api/auth/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.position = req.body.position || user.position;
    user.accountStatus = req.body.accountStatus || user.accountStatus;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Delete user
// @route   DELETE /api/auth/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});
