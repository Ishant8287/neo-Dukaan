import express from "express";
import ImageKit from "imagekit";
import {
  register,
  sendOtp,
  verifyOtp,
  staffLogin,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// IMAGEKIT AUTH ROUTE
router.get("/imagekit-auth", (req, res) => {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });

    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.json(authenticationParameters);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Existing Routes...
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/staff-login", staffLogin);

router.get("/me", protect, getMe);
router.put("/profile", protect, updateProfile);

export default router;
