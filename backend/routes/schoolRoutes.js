import express from "express";
import { getSchools, createSchool } from "../controllers/schoolController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSchools); // Public for now, needed for signup/login
router.post("/", protect, authorize("admin"), createSchool);

export default router;
