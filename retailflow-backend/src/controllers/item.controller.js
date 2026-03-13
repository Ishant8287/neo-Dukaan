import Item from "../models/Item.js";

// @desc    Add a new item
// @route   POST /api/v1/items
export const addItem = async (req, res) => {
  try {
    const { name, category, unit, batches, alertQuantity, taxPercent, hsn } =
      req.body;

    const item = await Item.create({
      shop: req.shop.id,
      name,
      category,
      unit,
      batches,
      alertQuantity,
      taxPercent: taxPercent || 0,
      hsn: hsn || "",
    });

    res
      .status(201)
      .json({ success: true, data: item, message: "Item added! 📦" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all items
// @route   GET /api/v1/items
export const getItems = async (req, res) => {
  try {
    const items = await Item.find({ shop: req.shop.id }).sort("-createdAt");
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update an item
// @route   PUT /api/v1/items/:id
export const updateItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, shop: req.shop.id });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found." });
    }

    const { name, unit, batches, alertQuantity, taxPercent, hsn, adjustments } =
      req.body;

    if (name) item.name = name;
    if (unit) item.unit = unit;
    if (batches) item.batches = batches;
    if (alertQuantity !== undefined) item.alertQuantity = alertQuantity;
    if (taxPercent !== undefined) item.taxPercent = taxPercent;
    if (hsn !== undefined) item.hsn = hsn;
    if (adjustments) item.adjustments = adjustments;

    await item.save();

    res
      .status(200)
      .json({ success: true, data: item, message: "Item updated!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an item
// @route   DELETE /api/v1/items/:id
export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, shop: req.shop.id });

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found." });
    }

    await item.deleteOne();

    res.status(200).json({ success: true, message: "Item deleted." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inventory stats
// @route   GET /api/v1/items/stats
export const getInventoryStats = async (req, res) => {
  try {
    const items = await Item.find({ shop: req.shop.id });

    const totalItems = items.length;
    const lowStockItems = items.filter((item) => {
      const totalQty = item.batches.reduce((acc, b) => acc + b.quantity, 0);
      return totalQty <= item.alertQuantity;
    });

    const outOfStock = items.filter((item) => {
      return item.batches.reduce((acc, b) => acc + b.quantity, 0) === 0;
    });

    res.status(200).json({
      success: true,
      stats: {
        totalItems,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStock.length,
        lowStockDetails: lowStockItems,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
