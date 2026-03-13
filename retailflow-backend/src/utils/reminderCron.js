import Customer from "../models/Customer.js";
import Shop from "../models/Shop.js";

export const startReminderCron = () => {
  const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

  const runReminders = async () => {
    try {
      const today = new Date();
      today.setHours(23, 59, 59, 999);

      const customersDue = await Customer.find({
        totalUdhaar: { $gt: 0 },
        nextReminderDate: { $lte: today },
      }).populate("shop");

      console.log(
        `\n⏰ RetailFlow Reminder Cron: ${customersDue.length} reminders due today\n`,
      );

      for (const customer of customersDue) {
        const shop = customer.shop;
        if (!shop || !shop.upiId) continue;

        const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);
        const upiLink = `upi://pay?pa=${shop.upiId}&pn=${shop.shopName}&am=${customer.totalUdhaar}&cu=INR`;

        const msg = `Namaste *${customer.name}* 🙏,\nAapka *${shop.shopName}* par ₹${customer.totalUdhaar} ka Udhaar baaki hai.\n\nKripya is link par click karke payment karein:\n${upiLink}\n\nDhanyawad! 🙏`;

        console.log(
          `📱 WhatsApp Reminder for ${customer.name} (${cleanPhone})`,
        );
        console.log(
          `   URL: https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}\n`,
        );

        customer.nextReminderDate = new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        );
        await customer.save();
      }
    } catch (error) {
      console.error("Reminder cron error:", error.message);
    }
  };

  runReminders();
  setInterval(runReminders, TWENTY_FOUR_HOURS);

  console.log("✅ RetailFlow reminder scheduler started");
};
