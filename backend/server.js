import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Student from "./models/Student.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🟢 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB(cloud) Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// 🟢 Test route
app.get("/", (req, res) => {
  res.send("School Data Manager API is running...");
});


// 🟢 POST — Add new student
app.post("/api/students", async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error("❌ Error adding student:", err);
    res.status(400).json({ error: err.message });
  }
});


// 🟢 GET — All students
app.get("/api/students/:id", async (req, res) => {
  try {
    const className = req.params.id
    console.log(className,"CLASSNAME");
    const query = className==0?{}:{class:className}
    const students = await Student.find(query);
    res.json(students);
    console.log("✅ All students sent to frontend");
  } catch (err) {
    console.error("❌ Error fetching students:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🟢 GET — srNo
app.get("/api/students/update", async(req,res)=>{
  // req came and got the wanted student
  console.log('request detected at update section\n');
    const students = await Student.find();
    const log = req.query.query
    let foundData = false
    let newData =[]
    students.forEach(element => {
      if (element.srNo == log) {
        newData.push(element)
        foundData=true
      }
    });
  foundData?res.send(newData):res.send(0)
  

})


// 🟢 PUT — Update student by ID (or query)
// 🟢 GET — Fetch a single student by ID
app.get("/api/students/singlestudent/:id", async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("❌ Error fetching student:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/api/students/:id", async (req, res) => {
  console.log("put request reached");
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student updated successfully", updated });
  } catch (err) {
    console.error("❌ Error updating student:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// 🟢 (Optional) DELETE — Remove a student
app.delete("/api/students/dl/:id", async (req, res) => {
  console.log('request reached for deletion');
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    // console.log(deleted);
    if (!deleted) return res.status(404).json({ message: "Student not found" });
    res.json({ message: "Student deleted successfully" });
    console.log('student deleted');
  } catch (err) {
    console.error("❌ Error deleting student:", err);
    res.status(500).json({ error: "Server error" });
  }
});
 // password check
 app.get('/api/dlpass/:id', async (req,res)=>{
  console.log('req reached for deletionnnnn');
  try {
    const id = req.params.id
    console.log(id);
    if (id==123321) {
      res.send({message:true})
      console.log('password has arrived and is correct');
    }else{
      res.json({message:false})
      console.log('wrong passworddd');
    }
  } catch (error) {
    console.log(error);
  }
 })


 
// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
