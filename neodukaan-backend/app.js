import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// 🚪 Routes Import
import authRoutes from "./src/routes/auth.routes.js";
import itemRoutes from "./src/routes/item.routes.js";
import customerRoutes from "./src/routes/customer.routes.js";
import saleRoutes from "./src/routes/sale.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import reportRoutes from "./src/routes/report.routes.js"; // 👈 New: Dashboard Analytics

// 🛡️ Middleware Import
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { apiLimiter } from "./src/middlewares/rateLimiter.js"; // 👈 New: DDoS Shield

const app = express();

// ==========================================
// 1. GLOBAL MIDDLEWARES
// ==========================================
app.use(helmet()); // Secure HTTP headers [cite: 31]
app.use(cors()); // Cross-Origin Resource Sharing [cite: 31]
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Parse incoming JSON body
app.use(morgan("dev")); // Terminal logger

// Apply Rate Limiter to all /api routes to prevent API abuse
app.use("/api", apiLimiter);

// ==========================================
// 2. API ROUTES (MVC Architecture)
// ==========================================
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/items", itemRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/sales", saleRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/reports", reportRoutes); // 👈 New: Route connected!

// Test Route
app.get("/", (req, res) => {
  res
    .status(200)
    .json({ success: true, message: "NeoDukaan App Engine is live! 🚀" });
});

// ==========================================
// 3. GLOBAL ERROR HANDLER
// ==========================================
app.use(errorHandler); // Intercepts all errors safely [cite: 36]

export default app; // 👈 Exporting for server.js
