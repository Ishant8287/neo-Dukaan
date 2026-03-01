import mongoose from "mongoose";
import Sale from "../models/Sale.js";
import Item from "../models/Item.js";
import Customer from "../models/Customer.js";

// @desc    Create a new Sale (POS Checkout) & Update Khata & Deduct Stock
// @route   POST /api/v1/sales
export const createSale = async (req, res) => {
  // MongoDB Session Start - Error aane par sab kuch Rollback ho jayega
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { customerId, items, paymentSplit } = req.body;
    let totalAmount = 0;

    //Stock Deduction Logic
    for (let orderItem of items) {
      const item = await Item.findOne({
        _id: orderItem.itemId,
        shop: req.shop.id,
      }).session(session);

      const batch = item.batches.id(orderItem.batchId);
      if (!batch || batch.quantity < orderItem.quantity) {
        throw new Error(`Stock kam hai for item: ${item.name}! ⚠️`);
      }

      batch.quantity -= orderItem.quantity;
      await item.save({ session });

      totalAmount += orderItem.sellingPrice * orderItem.quantity;
    }
    // Payment Split Validation
    const totalPaid =
      paymentSplit.cash + paymentSplit.upi + paymentSplit.udhaar;
    if (totalPaid !== totalAmount) {
      throw new Error("Payment mismatch! Total calculation check karo.");
    }

    // Create Invoice (Bill)
    const sale = await Sale.create(
      [
        {
          shop: req.shop.id,
          customer: customerId || null,
          items,
          totalAmount,
          paymentSplit,
        },
      ],
      { session },
    );

    //Khata (Udhaar) Update Logic
    if (paymentSplit.udhaar > 0) {
      if (!customerId)
        throw new Error("Udhaar ke liye Customer select karna padega!");

      const customer = await Customer.findById(customerId).session(session);
      customer.totalUdhaar += paymentSplit.udhaar;
      customer.khataHistory.push({
        transactionType: "GIVEN_UDHAAR",
        amount: paymentSplit.udhaar,
        description: `Invoice ID: ${sale[0]._id}`,
      });
      await customer.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Sale successful! Invoice ban gayi! 🧾",
      data: sale[0],
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ success: false, message: error.message });
  }
};
