import jwt from "jsonwebtoken";
import Shop from "../models/Shop.js";
import Staff from "../models/Staff.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized. Please login." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (decoded.role && decoded.role !== "owner") {
      const staff = await Staff.findById(decoded.id).select("-pin");
      if (!staff || !staff.isActive) {
        return res
          .status(401)
          .json({
            success: false,
            message: "Staff account not found or deactivated.",
          });
      }
      
      req.shop = { id: staff.shop.toString() };
      req.staff = staff;
      req.role = staff.role;
    } else {
      const shop = await Shop.findById(decoded.id);
      if (!shop) {
        return res
          .status(401)
          .json({ success: false, message: "Account not found." });
      }
      req.shop = shop;
      req.role = "owner";
    }

    next();
  } catch (err) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Token is invalid or expired. Please login again.",
      });
  }
};

// Role-based access control middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${req.role} role cannot perform this action.`,
      });
    }
    next();
  };
};
