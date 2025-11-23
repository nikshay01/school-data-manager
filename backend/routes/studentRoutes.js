import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  passwordCheck,
  srNoSearch
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/", addStudent);
router.get("/:id", getStudents);            // class filter
router.get("/single/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/dl/:id", deleteStudent);
router.get("/update", srNoSearch);
router.get("/pass/:id", passwordCheck);

export default router;
