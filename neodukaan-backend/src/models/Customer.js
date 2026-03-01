import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    totalUdhaar: {
      type: Number,
      default: 0, // Initial debt
    },

    khataHistory: [
      {
        transactionType: {
          type: String,
          enum: ["GIVEN_UDHAAR", "PAYMENT_RECEIVED"],
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Customer", customerSchema);
