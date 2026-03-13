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
    // 🚀 DHYAN DO: req.body se totalPurchasePrice aur customer nikal liya hai
    const { customer, items, paymentSplit, totalPurchasePrice } = req.body;
    let totalAmount = 0;
    let calculatedPurchasePrice = 0; // Fallback ke liye

    // Stock Deduction Logic
    for (let orderItem of items) {
      const item = await Item.findOne({
        _id: orderItem.itemId,
        shop: req.shop.id,
      }).session(session);

      if (!item) {
        throw new Error(`Item ID ${orderItem.itemId} not found!`);
      }

      const batch = item.batches.id(orderItem.batchId);
      if (!batch || batch.quantity < orderItem.quantity) {
        throw new Error(`Stock kam hai for item: ${item.name}! ⚠️`);
      }

      batch.quantity -= orderItem.quantity;
      await item.save({ session });

      totalAmount += orderItem.sellingPrice * orderItem.quantity;

      // Calculate total purchase price if frontend fails to send it
      const costPrice = orderItem.purchasePrice || batch.purchasePrice || 0;
      calculatedPurchasePrice += costPrice * orderItem.quantity;
    }

    // Payment Split Validation
    const totalPaid =
      paymentSplit.cash + paymentSplit.upi + paymentSplit.udhaar;
    // Math.round lagaya taaki javascript ke floating point errors se bacha ja sake
    if (Math.round(totalPaid) !== Math.round(totalAmount)) {
      throw new Error("Payment mismatch! Total calculation check karo.");
    }

    // Create Invoice (Bill)
    const finalTotalPurchasePrice = totalPurchasePrice
      ? totalPurchasePrice
      : calculatedPurchasePrice;

    // 🚀 Update: DB save karte time saari required fields add kar di hain
    const sale = await Sale.create(
      [
        {
          shop: req.shop.id,
          customer: customer || null, // 👈 'customerId' nahi, 'customer' hai backend model/payload mein
          items: items.map((i) => ({
            itemId: i.itemId,
            batchId: i.batchId,
            quantity: i.quantity,
            sellingPrice: i.sellingPrice,
            purchasePrice: i.purchasePrice || 0, // 👈 Required in Sale Model
          })),
          totalAmount,
          totalPurchasePrice: finalTotalPurchasePrice, // 👈 Required in Sale Model
          paymentSplit,
        },
      ],
      { session },
    );

    // Khata (Udhaar) Update Logic
    if (paymentSplit.udhaar > 0) {
      if (!customer)
        throw new Error("Udhaar ke liye Customer select karna padega!");

      const dbCustomer = await Customer.findById(customer).session(session);
      if (!dbCustomer) {
        throw new Error(
          "Udhaar ke liye Diya gaya Customer ID database mein nahi mila!",
        );
      }

      dbCustomer.totalUdhaar += paymentSplit.udhaar;
      dbCustomer.khataHistory.push({
        transactionType: "GIVEN_UDHAAR",
        amount: paymentSplit.udhaar,
        description: `Invoice ID: ${sale[0]._id}`,
      });
      await dbCustomer.save({ session });
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
    console.error("Sale Creation Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
