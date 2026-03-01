import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" }, //for debt
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        batchId: { type: mongoose.Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentSplit: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
      udhaar: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Sale", saleSchema);
