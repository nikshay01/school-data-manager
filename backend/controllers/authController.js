import User from "../models/User.js";
import bcrypt from "bcrypt";

export const signupUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ error: "Email and password are required." });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: "Invalid email format." });

    if (password.length < 8)
      return res
        .status(400)
        .json({ error: "Password must be at least 8 characters." });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: "User already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashed });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials." });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const {
      username,
      schoolId,
      position,
      aadhar,
      fullName,
      address,
      gender,
      phone,
    } = req.body;
    const nameTaken = await User.findOne(username);
    const adTaken = await User.findOne(aadhar);
    console.log(nameTaken);
    if (nameTaken) {
      return res.status(409).json({ error: "UserName already exists." });
    } else if (adTaken) {
      return res.status(409).json({ error: "User Aadhar number already exists." });
    }

  } catch (error) {
    console.log(error);
  }
};
