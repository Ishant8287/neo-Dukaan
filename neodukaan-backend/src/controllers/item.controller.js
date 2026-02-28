import Item from "../models/Item.js";

// @desc    Add a new item to inventory
// @route   POST /api/v1/items
// @access  Private
export const addItem = async (req, res) => {
  try {
    const { name, category, unit, batches, alertQuantity } = req.body;

    const item = await Item.create({
      shop: req.shop.id,
      name,
      category,
      unit,
      batches,
      alertQuantity,
    });

    res.status(201).json({
      success: true,
      data: item,
      message: "Item added to inventory! 📦",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all items for the logged-in shop
// @route   GET /api/v1/items
// @access  Private
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ shop: req.shop.id });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Inventory Statistics (Low Stock, Total Items)
// @route   GET /api/v1/items/stats
// @access  Private
export const getInventoryStats = async (req, res) => {
  try {
    const items = await Item.find({ shop: req.shop.id });

    const totalItems = items.length;

    const lowStockItems = items.filter((item) => {
      const totalQty = item.batches.reduce((acc, b) => acc + b.quantity, 0);
      return totalQty <= item.alertQuantity;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        lowStockCount: lowStockItems.length,
        lowStockDetails: lowStockItems,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
