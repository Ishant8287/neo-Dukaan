import Customer from "../models/Customer.js";
import Sale from "../models/Sale.js";


export const addCustomer = async (req, res) => {
  try {
    const { name, phone, address, creditLimit } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ success: false, message: "Name and phone are required." });
    }

    const existing = await Customer.findOne({ phone, shop: req.shop.id });
    if (existing) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Customer with this phone already exists.",
        });
    }

    const customer = await Customer.create({
      shop: req.shop.id,
      name,
      phone,
      address: address || "",
      creditLimit: creditLimit || 0, // 0 means no limit
    });

    res
      .status(201)
      .json({ success: true, data: customer, message: "Customer added! 👤" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


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


export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      shop: req.shop.id,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    }

    const {
      totalUdhaar,
      name,
      phone,
      address,
      creditLimit,
      paymentAmount,
      paymentNote,
    } = req.body;

    // Handle payment received (updates khata history automatically)
    if (paymentAmount && paymentAmount > 0) {
      if (paymentAmount > customer.totalUdhaar) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Payment exceeds outstanding due amount.",
          });
      }
      customer.totalUdhaar -= paymentAmount;
      customer.khataHistory.push({
        transactionType: "PAYMENT_RECEIVED",
        amount: paymentAmount,
        description: paymentNote || "Manual payment received",
      });
    }

    // Handle direct totalUdhaar update (for sync purposes)
    if (totalUdhaar !== undefined && paymentAmount === undefined) {
      customer.totalUdhaar = totalUdhaar;
    }

    if (name) customer.name = name;
    if (phone) customer.phone = phone;
    if (address !== undefined) customer.address = address;
    if (creditLimit !== undefined) customer.creditLimit = creditLimit;

    await customer.save();

    res
      .status(200)
      .json({ success: true, data: customer, message: "Customer updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getCustomerHistory = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      shop: req.shop.id,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    }

    // Get all sales linked to this customer
    const sales = await Sale.find({
      shop: req.shop.id,
      customer: req.params.id,
    })
      .sort("-createdAt")
      .limit(50);

    // Build purchase frequency map
    const itemFrequency = {};
    sales.forEach((sale) => {
      sale.items.forEach((item) => {
        const key = item.itemId.toString();
        if (!itemFrequency[key]) {
          itemFrequency[key] = {
            name: item.name || "Unknown",
            quantity: 0,
            times: 0,
          };
        }
        itemFrequency[key].quantity += item.quantity;
        itemFrequency[key].times += 1;
      });
    });

    const topItems = Object.values(itemFrequency)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    res.status(200).json({
      success: true,
      data: {
        customer,
        sales,
        topItems,
        totalSpent: sales.reduce((sum, s) => sum + s.totalAmount, 0),
        totalVisits: sales.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const scheduleReminder = async (req, res) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      shop: req.shop.id,
    });

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    }

    const { scheduledDate } = req.body;

    customer.nextReminderDate = scheduledDate
      ? new Date(scheduledDate)
      : new Date(Date.now() + 24 * 60 * 60 * 1000);
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Reminder scheduled!",
      data: { nextReminderDate: customer.nextReminderDate },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getRemindersDue = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    const customers = await Customer.find({
      shop: req.shop.id,
      totalUdhaar: { $gt: 0 },
      nextReminderDate: { $lte: today },
    });

    res
      .status(200)
      .json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
