import Sale from "../models/Sale.js";
import Item from "../models/Item.js";
import Customer from "../models/Customer.js";
import Expense from "../models/Expense.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const shopId = req.shop.id;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const allSales = await Sale.find({ shop: shopId })
      .sort({ createdAt: -1 })
      .lean();
    const todaysSales = allSales.filter(
      (s) => new Date(s.createdAt) >= startOfToday,
    );
    const monthSales = allSales.filter(
      (s) => new Date(s.createdAt) >= startOfMonth,
    );

    const todaysRevenue = todaysSales.reduce(
      (acc, s) => acc + (s.totalAmount || 0),
      0,
    );
    const todaysProfit = todaysSales.reduce(
      (acc, s) => acc + (s.profit || 0),
      0,
    );
    const monthRevenue = monthSales.reduce(
      (acc, s) => acc + (s.totalAmount || 0),
      0,
    );
    const monthProfit = monthSales.reduce((acc, s) => acc + (s.profit || 0), 0);

    const customers = await Customer.find({ shop: shopId }).lean();
    const totalUdhaar = customers.reduce(
      (acc, c) => acc + (c.totalUdhaar || 0),
      0,
    );

    const items = await Item.find({ shop: shopId }).lean();
    const inventoryValue = items.reduce((acc, item) => {
      const val =
        item.batches?.reduce(
          (s, b) => s + (b.purchasePrice || 0) * (b.quantity || 0),
          0,
        ) || 0;
      return acc + val;
    }, 0);

    // Month expenses for true net profit
    const expenses = await Expense.find({
      shop: shopId,
      date: { $gte: startOfMonth },
    }).lean();
    const monthExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
    const netProfit = monthProfit - monthExpenses;

    res.status(200).json({
      success: true,
      data: {
        todaysRevenue,
        todaysProfit,
        monthRevenue,
        monthProfit,
        netProfit,
        totalUdhaar,
        inventoryValue,
        totalSalesCount: todaysSales.length,
        sales: allSales,
      },
    });
  } catch (error) {
    next(error);
  }
};
