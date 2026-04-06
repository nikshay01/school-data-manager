import express from "express";
import { markAttendance, getAttendance } from "../controllers/attendanceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/")
  .post(protect, markAttendance);

router.route("/:className/:date")
  .get(protect, getAttendance);

export default router;
