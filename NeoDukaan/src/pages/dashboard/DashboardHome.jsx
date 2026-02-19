import StateCard from "../../components/common/StateCard";

const DashboardHome = () => {
  // Stats Data (Scalable Structure)
  const stats = [
    { title: "Today's Sales", value: "₹12,450" },
    { title: "Cash Collected", value: "₹8,200" },
    { title: "UPI Collected", value: "₹4,250" },
    { title: "Net Profit", value: "₹3,800" },
    { title: "Inventory Value", value: "₹3,20,500" },
  ];

  return (
    <div className="text-white">
      {/* Page Heading */}
      <h1 className="text-2xl font-semibold mb-6 tracking-tight">Overview</h1>

      {/* Stats Cards */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((item, index) => (
          <StateCard key={index} title={item.title} value={item.value} />
        ))}
      </div>

      {/*Low Stock Alert */}
      <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
        ⚠ 3 items are low in stock. Please restock soon.
      </div>

      {/* 📈 Analytics Section */}
      <div className="grid gap-6 mt-8 lg:grid-cols-3">
        {/* Left Large Section */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-4">Sales Analytics</h3>

          <div className="h-64 bg-white/5 rounded-xl flex items-center justify-center text-white/50">
            Chart Placeholder
          </div>
        </div>

        {/* Right Small Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>

          <div className="space-y-3 text-white/70 text-sm">
            <div className="flex justify-between">
              <span>Shampoo</span>
              <span>₹4,750</span>
            </div>

            <div className="flex justify-between">
              <span>Rice Bag</span>
              <span>₹3,200</span>
            </div>

            <div className="flex justify-between">
              <span>Cooking Oil</span>
              <span>₹2,100</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
