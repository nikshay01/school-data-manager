import express from "express";
import {
  signupUser,
  loginUser,
  completeProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  getCurrentUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.put("/complete-profile", completeProfile);
router.post("/me", getCurrentUser);

// Admin Routes
router.get("/users", getAllUsers);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

export default router;
