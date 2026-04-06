import express from "express";
import {
  getStaff,
  addStaff,
  updateStaff,
  generatePayroll,
  getPayrollHistory,
} from "../controllers/staffController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getStaff).post(addStaff);
router.route("/:id").put(updateStaff);

router.route("/payroll").get(getPayrollHistory).post(generatePayroll);

export default router;
