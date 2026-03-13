import Sale from "../models/Sale.js";
import Item from "../models/Item.js";
import Customer from "../models/Customer.js";

// 👉 YAHAN SE EXPORT HOTA HAI (Ye line miss mat karna!)
export const getDashboardStats = async (req, res, next) => {
  try {
    const shopId = req.shop.id;

    // 1. Get Today's Sales limit
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    // 2. Sari Sales fetch karo (Performance optimized with .lean())
    const allSales = await Sale.find({ shop: shopId })
      .sort({ createdAt: -1 })
      .lean();

    // 3. Aaj ki sales filter karo
    const todaysSales = allSales.filter(
      (sale) => new Date(sale.createdAt) >= startOfToday,
    );

    const todaysRevenue = todaysSales.reduce(
      (acc, sale) => acc + (sale.totalAmount || 0),
      0,
    );

    // 4. Total Outstanding Udhaar (From Customers)
    const customers = await Customer.find({ shop: shopId }).lean();
    const totalUdhaar = customers.reduce(
      (acc, c) => acc + (c.totalDue || 0),
      0,
    );

    // 5. Inventory Value Calculation
    const items = await Item.find({ shop: shopId }).lean();
    const inventoryValue = items.reduce((acc, item) => {
      const itemStock =
        item.batches?.reduce((bAcc, b) => bAcc + (b.quantity || 0), 0) || 0;
      return acc + itemStock * (item.batches?.[0]?.costPrice || 0);
    }, 0);

    // 🚀 LEAD DEV HACK: Frontend ko wahi do jo wo mang raha hai
    const formattedSales = allSales.map((sale) => ({
      ...sale,
      // Agar paymentSplit undefined hai toh default 0 do warna chart blank rahega
      paymentSplit: sale.paymentSplit || {
        cash: sale.totalAmount || 0, // Fallback: agar split nahi hai toh pura cash maan lo
        upi: 0,
        udhaar: 0,
      },
    }));

    // 6. Send Response
    res.status(200).json({
      success: true,
      data: {
        todaysRevenue,
        totalUdhaar,
        inventoryValue,
        totalSalesCount: todaysSales.length,
        sales: formattedSales, // 👈 Ab format hoke jayega
      },
    });
  } catch (error) {
    next(error);
  }
};
