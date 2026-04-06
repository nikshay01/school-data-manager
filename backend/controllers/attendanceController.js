import asyncHandler from "express-async-handler";
import Attendance from "../models/Attendance.js";
import Student from "../models/Student.js";

// @desc    Bulk mark attendance for a class on a specific date
// @route   POST /api/attendance
// @access  Private
export const markAttendance = asyncHandler(async (req, res) => {
  const { date, className, records } = req.body;
  // records is array of { studentId, status }

  if (!date || !className || !records || !Array.isArray(records)) {
    res.status(400);
    throw new Error("Please provide date, className, and records array");
  }

  // Set time of date to midnight to store normalized dates
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // Get school from request user
  const schoolId = req.user.school;

  // Process each record
  const operations = records.map((record) => {
    return {
      updateOne: {
        filter: { 
          student: record.studentId, 
          date: normalizedDate 
        },
        update: {
          $set: {
            student: record.studentId,
            class: className,
            date: normalizedDate,
            status: record.status,
            school: schoolId,
          }
        },
        upsert: true // Insert if it doesn't exist, update if it does
      }
    };
  });

  if (operations.length > 0) {
    await Attendance.bulkWrite(operations);
  }

  res.json({ message: "Attendance saved successfully" });
});

// @desc    Get attendance for a specific class and date
// @route   GET /api/attendance/:className/:date
// @access  Private
export const getAttendance = asyncHandler(async (req, res) => {
  const { className, date } = req.params;
  
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  // First get all students in that class for the school
  const students = await Student.find({ 
    class: className,
    school: req.user.school,
    leftSchool: false 
  }).select('_id studentName rollNumber');

  // Then get existing attendance records for that day
  const attendances = await Attendance.find({
    class: className,
    date: normalizedDate,
    school: req.user.school
  });

  // Map to a comprehensive list
  const result = students.map(student => {
    const record = attendances.find(a => a.student.toString() === student._id.toString());
    return {
      studentId: student._id,
      studentName: student.studentName,
      rollNumber: student.rollNumber,
      status: record ? record.status : "Present" // Default to Present if not marked
    };
  });

  // Sort by roll number or name
  result.sort((a, b) => {
    if (a.rollNumber && b.rollNumber) return a.rollNumber.localeCompare(b.rollNumber);
    return a.studentName.localeCompare(b.studentName);
  });

  res.json(result);
});
