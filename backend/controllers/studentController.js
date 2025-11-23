import Student from "../models/Student.js";

export const addStudent = async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const className = req.params.id;
    const query = className == 0 ? {} : { class: className };
    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const srNoSearch = async (req, res) => {
  try {
    const search = req.query.query;
    const students = await Student.find({ srNo: search });
    res.json(students.length ? students : 0);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const s = await Student.findById(req.params.id);
    if (!s) return res.status(404).json({ message: "Not found" });
    res.json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Updated", updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const passwordCheck = (req, res) => {
  const pw = req.params.id;
  res.json({ message: pw == 123321 });
};
