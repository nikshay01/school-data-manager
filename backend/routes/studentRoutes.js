import express from "express";
import {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  passwordCheck,
  srNoSearch,
} from "../controllers/studentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addStudent);
router.get("/:id", protect, getStudents); // class filter
router.get("/single/:id", protect, getStudentById);
router.put("/:id", protect, updateStudent);
router.delete("/dl/:id", protect, deleteStudent);
router.get("/update", protect, srNoSearch); // Note: URL path is /update but controller is srNoSearch? Weird naming but keeping logic.
router.get("/pass/:id", passwordCheck); // Public for now as requested by user previously, but should be protected.

export default router;
