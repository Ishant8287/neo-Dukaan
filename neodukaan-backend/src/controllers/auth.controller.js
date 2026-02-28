import Shop from "../models/Shop.js";

// @desc    Register a new Shop/Owner
// @route   POST /api/v1/auth/register
export const register = async (req, res) => {
  try {
    const { ownerName, shopName, email, password, phone } = req.body;

    const shopExists = await Shop.findOne({ email });
    if (shopExists) {
      return res.status(400).json({
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
        message: "Shop registered successfully! 🎉",
        data: {
          id: shop._id,
          shopName: shop.shopName,
          email: shop.email,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login Shop/Owner
// @route   POST /api/v1/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    const shop = await Shop.findOne({ email }).select("+password");
    if (!shop) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await shop.matchPassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = shop.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      message: "Logged in successfully! 👋",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in shop profile
// @route   GET /api/v1/auth/me
// @access  Private (Needs Token)
export const getMe = async (req, res) => {
  try {
    const shop = await Shop.findById(req.shop.id);

    res.status(200).json({
      success: true,
      data: shop,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
