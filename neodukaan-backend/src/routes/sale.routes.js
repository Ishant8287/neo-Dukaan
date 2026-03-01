import express from "express";
import { createSale } from "../controllers/sale.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(protect);

router.route("/").post(createSale);

export default router;
