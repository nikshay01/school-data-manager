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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
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
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid credentials." });

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials." });

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
    const {
      email,         // Email used to find the user to update
      username,
      schoolId,
      position,
      aadhar,
      fullName,
      address,
      gender,
      phone,
    } = req.body;

    // 1️⃣ Find the user using email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // 2️⃣ Check if username is already taken by someone else
    const nameTaken = await User.findOne({ username, _id: { $ne: user._id } });
    if (nameTaken) {
      return res.status(409).json({ error: "UserName already exists." });
    }

    // 3️⃣ Check if Aadhar number already exists (except current user)
    const adTaken = await User.findOne({ aadhar, _id: { $ne: user._id } });
    if (adTaken) {
      return res.status(409).json({ error: "User Aadhar number already exists." });
    }

    // 4️⃣ Update all profile fields
    user.username = username;
    user.schoolId = schoolId;
    user.position = position;
    user.aadhar = aadhar;
    user.name = fullName;
    user.address = address;
    user.gender = gender;
    user.contact = phone;

    // 5️⃣ Save updated document
    await user.save();

    // Send success response
    return res.status(200).json({
      message: "Profile completed successfully!",
      user,
    });
  } catch (error) {
    console.log(error); // log internal error
    return res.status(500).json({ error: "Internal server error" });
  }
};
