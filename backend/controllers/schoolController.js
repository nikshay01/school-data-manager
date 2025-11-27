import School from "../models/School.js";

export const getSchools = async (req, res) => {
  try {
    const schools = await School.find({}, "name _id code"); // Fetch name, id, and code
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createSchool = async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    res.status(201).json(school);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
