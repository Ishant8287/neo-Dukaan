import express from "express";
import {
  addCustomer,
  getCustomers,
} from "../controllers/customer.controller.js";
import { protect } from "../middlewares/auth.middlewares.js"; // Tumhara banaya hua Bouncer

const router = express.Router();

router.use(protect); 

router.route("/").post(addCustomer).get(getCustomers);

export default router;
