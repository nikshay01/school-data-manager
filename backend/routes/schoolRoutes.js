import express from "express";
import { getSchools, createSchool } from "../controllers/schoolController.js";

const router = express.Router();

router.get("/", getSchools);
router.post("/", createSchool);

export default router;
