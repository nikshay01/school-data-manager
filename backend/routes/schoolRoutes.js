import express from "express";
import { getSchools, createSchool, updateSchool } from "../controllers/schoolController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getSchools); // Public for now, needed for signup/login
router.post("/", protect, authorize("admin"), createSchool);
router.put("/:id", protect, authorize("admin"), updateSchool);

export default router;
