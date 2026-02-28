import express from "express";
import {
  addItem,
  getItems,
  getInventoryStats,
} from "../controllers/item.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getInventoryStats);

router.route("/").get(getItems).post(addItem);

export default router;
