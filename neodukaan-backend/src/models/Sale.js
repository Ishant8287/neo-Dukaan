import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false, // 👈 Cash sales ke liye optional rakha hai
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Item",
          required: true,
        },
        batchId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        quantity: { type: Number, required: true },
        sellingPrice: { type: Number, required: true },
        purchasePrice: { type: Number, required: true }, // 👈 Profit nikalne ke liye zaroori hai
      },
    ],
    totalAmount: { type: Number, required: true },
    totalPurchasePrice: { type: Number, required: true }, // 👈 (Sum of item purchasePrice * quantity)
    paymentSplit: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
      udhaar: { type: Number, default: 0 },
    },
    invoiceNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

// Pre-save hook to generate a simple invoice number if not provided
saleSchema.pre("save", function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  }
  next();
});

export default mongoose.model("Sale", saleSchema);
