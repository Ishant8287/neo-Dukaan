import express from "express";
import { imagekit } from "../utils/imagekit.js";

const router = express.Router();

// GET API to generate authentication parameters for frontend
router.get("/auth", (req, res, next) => {
  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authenticationParameters);
  } catch (error) {
    next(error);
  }
});

export default router;
