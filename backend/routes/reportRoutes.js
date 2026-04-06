import express from "express";
import { getDashboardStats, getDetailedReports } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Currently applying 'protect' middleware ensures logged-in users only
router.route("/dashboard").get(protect, getDashboardStats);
router.route("/full").get(protect, getDetailedReports);

export default router;
