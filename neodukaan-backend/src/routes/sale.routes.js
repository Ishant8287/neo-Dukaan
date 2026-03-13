import express from "express";
import { createSale } from "../controllers/sale.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createSale);

export default router;
