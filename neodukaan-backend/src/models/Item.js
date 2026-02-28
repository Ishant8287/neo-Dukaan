import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "General",
    },
    unit: {
      type: String,
      required: true,
    },
    batches: [
      {
        batchNumber: String,
        purchasePrice: Number, // Cost Price
        sellingPrice: Number, // Sales Price
        quantity: Number,
        expiryDate: Date,
      },
    ],
    alertQuantity: {
      type: Number,
      default: 10, // Low stock alert
    },
  },
  { timestamps: true },
);

const Item = mongoose.model("Item", itemSchema);
export default Item;
