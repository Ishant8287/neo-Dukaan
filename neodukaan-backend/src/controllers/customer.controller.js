import Customer from "../models/Customer.js";

// @desc    Add a new customer
// @route   POST /api/v1/customers
export const addCustomer = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const existingCustomer = await Customer.findOne({
      phone,
      shop: req.shop.id,
    });
    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: "Customer with this phone already exists!",
      });
    }

    const customer = await Customer.create({
      shop: req.shop.id,
      name,
      phone,
    });

    res
      .status(201)
      .json({ success: true, data: customer, message: "Customer added! 👤" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all customers for the shop
// @route   GET /api/v1/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ shop: req.shop.id }).sort(
      "-createdAt",
    );
    res
      .status(200)
      .json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
