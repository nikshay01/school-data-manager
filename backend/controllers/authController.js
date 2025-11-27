import User from "../models/User.js";
import bcrypt from "bcrypt";

// --------------------------------------
// SIGNUP CONTROLLER
// --------------------------------------
export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract email and password from request body

    // Validate required fields
    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    // Validate email format with regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email))
      return res.status(400).json({ error: "Invalid email format." });

    // Validate password length
    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters." });

    // Check if the user already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "User already exists." });

    // Hash the password for safe storage
    const hashed = await bcrypt.hash(password, 10);

    // Create new user document
    const user = new User({ email, password: hashed });

    // Save to database
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err); // Log server errors
    res.status(500).json({ error: "Internal server error" });
  }
};

// --------------------------------------
// LOGIN CONTROLLER
// --------------------------------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body; // Extract login credentials

    // Find the user by email
    // We need to explicitly select password because it's set to select: false in schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    // Check account status
    if (user.accountStatus !== "active") {
      return res.status(403).json({ error: "Account is not active." });
    }

    if (user.isDeleted) {
      return res.status(403).json({ error: "Account has been deleted." });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts (optional feature implementation)
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      await user.save();
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Reset failed login attempts on successful login
    user.failedLoginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    // Successful login (token creation can be added later)
    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err); // Log server errors
    res.status(500).json({ error: "Internal server error" });
  }
};

// --------------------------------------
// COMPLETE PROFILE CONTROLLER
// --------------------------------------
export const completeProfile = async (req, res) => {
  try {
    // Extract profile fields from request body
    console.log("request reached at completeprofile controller");

    const {
      email, // Email used to find the user to update
      username,
      school, // Changed from schoolId to school (ObjectId)
      position,
      aadhar,
      fullName, // Maps to 'name' in schema
      address,
      gender,
      phone, // Maps to 'contact' in schema
      access, // New field
    } = req.body;

    // 1️⃣ Find the user using email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2️⃣ Validate Username
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: "Username can only contain letters, numbers, and underscores.",
      });
    }
    const nameTaken = await User.findOne({ username, _id: { $ne: user._id } });
    if (nameTaken) {
      return res.status(409).json({ error: "UserName already exists." });
    }

    // 3️⃣ Validate Aadhar (12 digits)
    if (aadhar && !/^\d{12}$/.test(aadhar)) {
      return res
        .status(400)
        .json({ error: "Aadhar number must be exactly 12 digits." });
    }
    const adTaken = await User.findOne({ aadhar, _id: { $ne: user._id } });
    if (adTaken) {
      return res
        .status(409)
        .json({ error: "User Aadhar number already exists." });
    }

    // 4️⃣ Validate Contact (10 digits)
    if (phone && !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ error: "Contact number must be exactly 10 digits." });
    }

    // 5️⃣ Update all profile fields
    user.username = username;
    user.school = school; // Expecting ObjectId
    user.position = position;
    user.aadhar = aadhar;
    user.name = fullName;
    user.address = address;
    user.gender = gender;
    user.contact = phone;
    user.access = access || "employee"; // Default to employee if not provided
    user.profileCompleted = true;

    // 6️⃣ Save updated document
    await user.save();

    // Send success response
    return res.status(200).json({
      message: "Profile completed successfully!",
      user,
    });
  } catch (error) {
    console.log(error); // log internal error
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

// --------------------------------------
// ADMIN: GET ALL USERS
// --------------------------------------
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("school", "name code");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------
// ADMIN: UPDATE USER
// --------------------------------------
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------
// GET CURRENT USER
// --------------------------------------
export const getCurrentUser = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOne({ email }).populate("school", "name code");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// --------------------------------------
// ADMIN: DELETE USER
// --------------------------------------
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
