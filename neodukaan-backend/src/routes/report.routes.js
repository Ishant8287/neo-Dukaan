import express from "express";
import { getDashboardStats } from "../controllers/report.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🛡️ Middleware: Dashboard ka data sirf logged-in dukaandaar dekh paye
router.use(protect);

// @route   GET /api/v1/reports/dashboard
// @desc    Get dashboard analytics (Revenue, Udhaar, Stock Value)
router.get("/dashboard", getDashboardStats);

export default router;
