import Shop from "../models/Shop.js";
import Staff from "../models/Staff.js";
import bcrypt from "bcryptjs";

const sanitizeShop = (shop) => {
  const obj = shop.toObject ? shop.toObject() : { ...shop };
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpires;
  delete obj.__v;
  return obj;
};

export const register = async (req, res) => {
  try {
    const { ownerName, shopName, email, password, phone } = req.body;

    if (!ownerName || !shopName || !email || !password || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }

    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const shop = await Shop.create({
      ownerName,
      shopName,
      email,
      password,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "RetailFlow account created successfully! Please login. 🎉",
      data: { id: shop._id, shopName: shop.shopName, email: shop.email },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { contactMethod, contactValue } = req.body;

    const query =
      contactMethod === "email"
        ? { email: contactValue }
        : { phone: contactValue };
    const shop = await Shop.findOne(query);

    if (!shop) {
      return res.status(404).json({
        success: false,
        message: "No RetailFlow account found with this detail.",
      });
    }

    // OTP Generation
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcrypt.genSalt(10);
    shop.otp = await bcrypt.hash(rawOtp, salt);
    shop.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins
    await shop.save();

   
    console.log(`\n=========================================`);
    console.log(`🔑 RETAILFLOW DEMO LOGIN OTP`);
    console.log(`👤 For: ${contactValue}`);
    console.log(`🔢 OTP: ${rawOtp}`);
    console.log(`=========================================\n`);

    res
      .status(200)
      .json({
        success: true,
        message: `OTP sent to your ${contactMethod}! (Check Logs)`,
      });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again." });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { contactMethod, contactValue, otp } = req.body;

    const query =
      contactMethod === "email"
        ? { email: contactValue }
        : { phone: contactValue };
    const shop = await Shop.findOne(query);

    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });
    }

    if (!shop.otp || !shop.otpExpires) {
      return res.status(400).json({
        success: false,
        message: "No OTP requested. Please request a new one.",
      });
    }

    if (shop.otpExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    const isMatch = await bcrypt.compare(otp, shop.otp);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please check and try again.",
      });
    }

    shop.otp = null;
    shop.otpExpires = null;
    await shop.save();

    const token = shop.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: "Welcome back to RetailFlow! 👋",
      data: sanitizeShop(shop),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const staffLogin = async (req, res) => {
  try {
    const { phone, pin } = req.body;

    const staff = await Staff.findOne({ phone }).select("+pin");
    if (!staff) {
      return res
        .status(404)
        .json({ success: false, message: "Staff account not found." });
    }

    if (!staff.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated. Contact the owner.",
      });
    }

    const isMatch = await bcrypt.compare(pin, staff.pin);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid PIN." });
    }

    const token = staff.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: `Welcome, ${staff.name}!`,
      data: {
        _id: staff._id,
        name: staff.name,
        role: staff.role,
        shopId: staff.shop,
        phone: staff.phone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop.id);
    res.status(200).json({ success: true, data: sanitizeShop(shop) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { password, email, otp, otpExpires, ...updateData } = req.body;

    const shop = await Shop.findByIdAndUpdate(req.shop.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "RetailFlow profile updated!",
      data: sanitizeShop(shop),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
