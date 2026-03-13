import express from "express";
import {
  register,
  sendOtp, // 👈 Added
  verifyOtp, // 👈 Added
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);

// 🚀 Naye RetailFlow Login Routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
