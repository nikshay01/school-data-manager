import Student from "../models/Student.js";
import Log from "../models/Log.js";
import asyncHandler from "express-async-handler";

const createLog = async (
  action,
  entity,
  entityId,
  details,
  changes,
  user,
  ip
) => {
  try {
    await Log.create({
      action,
      entity,
      entityId,
      details,
      changes,
      user: user ? user.email : "System",
      ip,
    });
  } catch (error) {
    console.error("Logging failed:", error);
  }
};

// @desc    Add a new student
// @route   POST /api/students
// @access  Private
export const addStudent = asyncHandler(async (req, res) => {
  const { studentName, class: className } = req.body;

  if (!studentName || !className) {
    res.status(400);
    throw new Error("Student Name and Class are required");
  }

  const student = new Student({
    ...req.body,
    school: req.user.school, // Enforce school from token
  });

  await student.save();

  await createLog(
    "CREATE",
    "Student",
    student._id,
    `Created student ${student.studentName}`,
    { after: student.toObject() },
    req.user,
    req.ip
  );

  res.status(201).json(student);
});
// @desc    Get all students (scoped to school)
// @route   GET /api/students/class/:id
// @access  Private
export const getStudents = asyncHandler(async (req, res) => {
  const className = req.params.id;
  const query = { school: req.user.school }; // Scope to school

  if (className != 0) {
    query.class = className;
  }

  const students = await Student.find(query).sort({ studentName: 1 });
  res.json(students);
});

export const srNoSearch = asyncHandler(async (req, res) => {
  const search = req.query.query;
  const students = await Student.find({
    school: req.user.school,
    srNo: { $regex: search, $options: "i" },
  });
  res.json(students.length ? students : 0);
});

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    _id: req.params.id,
    school: req.user.school,
  });

  if (student) {
    res.json(student);
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
export const updateStudent = asyncHandler(async (req, res) => {
  const oldStudent = await Student.findOne({
    _id: req.params.id,
    school: req.user.school,
  });

  if (!oldStudent) {
    res.status(404);
    throw new Error("Student not found");
  }

  const updated = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  await createLog(
    "UPDATE",
    "Student",
    updated._id,
    `Updated student ${updated.studentName}`,
    {
      before: oldStudent.toObject(),
      after: updated.toObject(),
    },
    req.user,
    req.ip
  );

  res.json({ message: "Updated", updated });
});

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
export const deleteStudent = asyncHandler(async (req, res) => {
  const student = await Student.findOne({
    _id: req.params.id,
    school: req.user.school,
  });

  if (!student) {
    res.status(404);
    throw new Error("Student not found");
  }

  await student.deleteOne();

  await createLog(
    "DELETE",
    "Student",
    student._id,
    `Deleted student ${student.studentName}`,
    { before: student.toObject() },
    req.user,
    req.ip
  );

  res.json({ message: "Deleted" });
});

// @desc    Check password (deprecated, handled by auth middleware now)
// @route   GET /api/students/password/:id
// @access  Public (should be removed or protected)
export const passwordCheck = (req, res) => {
  const pw = req.params.id;
  res.json({ message: pw == 123321 });
};
