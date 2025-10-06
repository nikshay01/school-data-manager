import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error(err));

// Import model
import Student from "./models/Student.js";

// Routes
app.get("/", (req, res) => {
  res.send("School Data Manager API is running...");
});

// Add new student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
 
// Get all students
app.get("/api/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
  console.log("data sent to frontend");
});
app.post("/api/students/update", async(req,res)=>{
    const students = await Student.find();
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
