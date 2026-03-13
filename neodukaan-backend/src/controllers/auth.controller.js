import Shop from "../models/Shop.js";
import nodemailer from "nodemailer";

// @desc    Register a new Shop/Owner
export const register = async (req, res) => {
  try {
    const { ownerName, shopName, email, password, phone } = req.body;
    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Shop with this email already exists",
        });
    }
    const shop = await Shop.create({
      ownerName,
      shopName,
      email,
      password,
      phone,
    });
    if (shop) {
      res.status(201).json({
        success: true,
        message: "Welcome to RetailFlow! Shop registered successfully! 🎉",
        data: { id: shop._id, shopName: shop.shopName, email: shop.email },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🚀 @desc    Step 1: Send OTP for Login (NO GMAIL REQUIRED)
export const sendOtp = async (req, res) => {
  try {
    const { contactMethod, contactValue } = req.body;

    const query =
      contactMethod === "email"
        ? { email: contactValue }
        : { phone: contactValue };
    const shop = await Shop.findOne(query);

    if (!shop) {
      return res
        .status(404)
        .json({ success: false, message: "RetailFlow account not found!" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB (Expires in 10 mins)
    shop.otp = otp;
    shop.otpExpires = Date.now() + 10 * 60 * 1000;
    await shop.save();

    if (contactMethod === "email") {
      // 🚀 LEAD DEV HACK: Ethereal Fake SMTP (Zero Setup)
      // Ye automatic ek test account banayega aur mail bhej dega
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const mailOptions = {
        from: '"RetailFlow Admin" <admin@retailflow.com>', // Fake Sender
        to: shop.email, // Tera register kiya hua email
        subject: "RetailFlow - Your Login OTP",
        html: `<h2>Welcome back to RetailFlow</h2>
               <p>Your login OTP is: <strong style="font-size:24px; color:#4f46e5;">${otp}</strong></p>
               <p>It is valid for 10 minutes.</p>`,
      };

      const info = await transporter.sendMail(mailOptions);

      // 🔗 TERMINAL MEIN JADUI LINK AAYEGA
      console.log(`\n=========================================`);
      console.log(`📧 E-MAIL GENERATED FOR: ${shop.email}`);
      console.log(
        `🔗 CLICK HERE TO VIEW E-MAIL INBOX: ${nodemailer.getTestMessageUrl(info)}`,
      );
      console.log(`=========================================\n`);
    } else {
      // 📱 MOCK SMS
      console.log(`\n=========================================`);
      console.log(`📱 RetailFlow MOCK SMS SENT TO: ${shop.phone}`);
      console.log(`🔐 OTP IS: ${otp}`);
      console.log(`=========================================\n`);
    }

    res
      .status(200)
      .json({
        success: true,
        message: `OTP generated for your ${contactMethod}!`,
      });
  } catch (error) {
    console.error("OTP Send Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to send OTP. Try again." });
  }
};

// 🚀 @desc    Step 2: Verify OTP and Login
export const verifyOtp = async (req, res) => {
  try {
    const { contactMethod, contactValue, otp } = req.body;

    const query =
      contactMethod === "email"
        ? { email: contactValue }
        : { phone: contactValue };
    const shop = await Shop.findOne(query);

    if (!shop)
      return res
        .status(404)
        .json({ success: false, message: "Account not found!" });

    if (shop.otp !== otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP! Please check again." });
    }
    if (shop.otpExpires < Date.now()) {
      return res
        .status(400)
        .json({
          success: false,
          message: "OTP Expired! Please request a new one.",
        });
    }

    // OTP Correct -> Clear it and Login
    shop.otp = null;
    shop.otpExpires = null;
    await shop.save();

    const token = shop.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: "Logged into RetailFlow successfully! 👋",
      data: shop,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in shop profile
export const getMe = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop.id);
    res.status(200).json({ success: true, data: shop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shop profile (Photo included)
export const updateProfile = async (req, res) => {
  try {
    const { password, email, ...updateData } = req.body;
    const shop = await Shop.findByIdAndUpdate(req.shop.id, updateData, {
      new: true,
      runValidators: true,
    });
    res
      .status(200)
      .json({
        success: true,
        message: "RetailFlow Profile updated! ✨",
        data: shop,
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
