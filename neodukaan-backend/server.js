import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./src/config/db.js";

// Routes Import
import authRoutes from "./src/routes/auth.routes.js";
import itemRoutes from "./src/routes/item.routes.js";
import customerRoutes from "./src/routes/customer.routes.js";
import saleRoutes from "./src/routes/sale.routes.js";

// Secrets
dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/sales", saleRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("NeoDukaan API is running perfectly! 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
