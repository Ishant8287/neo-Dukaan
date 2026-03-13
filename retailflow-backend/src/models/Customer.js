import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    shop: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, default: "" },

    totalUdhaar: { type: Number, default: 0 },

    //Credit limit — 0 means no limit enforced
    creditLimit: { type: Number, default: 0 },

    //For WhatsApp reminder scheduling
    nextReminderDate: { type: Date, default: null },

    khataHistory: [
      {
        transactionType: {
          type: String,
          enum: ["GIVEN_UDHAAR", "PAYMENT_RECEIVED"],
          required: true,
        },
        amount: { type: Number, required: true },
        description: String,
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Customer", customerSchema);
