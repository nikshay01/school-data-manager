import express from "express";
import {
  signupUser,
  loginUser,
  completeProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
  searchUsers,
  assignUserToSchool,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

// Protected Routes
router.put("/complete-profile", protect, completeProfile);
router.get("/me", protect, getCurrentUser);

// Search Users for Assignment
router.get("/search-users", protect, authorize("admin", "principal"), searchUsers);
router.put("/users/:id/assign-school", protect, authorize("admin", "principal"), assignUserToSchool);

// Admin Routes
router.get("/users", protect, authorize("admin"), getAllUsers);
router.put("/users/:id", protect, authorize("admin"), updateUser);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

export default router;
