import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Package,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Banknote,
  Smartphone,
  BookUser,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DashboardHome = () => {
  const { sales = [], items = [], customers = [] } = useOutletContext();
  const navigate = useNavigate();

  const [chartRange, setChartRange] = useState("7D");

  // 🔥 FIX: Detect Old Browsers that crash on ResponsiveContainer
  const [isOldBrowser, setIsOldBrowser] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.ResizeObserver) {
      setIsOldBrowser(true); // Purane phone ka detection
    }
  }, []);

  const today = new Date();
  const todayDate = today.toISOString().slice(0, 10);

  // Kal (Yesterday) ki date nikaalna
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = yesterday.toISOString().slice(0, 10);

  /*TODAY'S DATA*/
  const todaysSales = sales.filter(
    (sale) => sale.date.slice(0, 10) === todayDate,
  );
  const todayRevenue = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.totalAmount || 0),
    0,
  );
  const todayProfit = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.profit || 0),
    0,
  );
  const todayCash = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.payments?.cash || 0),
    0,
  );
  const todayUpi = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.payments?.upi || 0),
    0,
  );
  const todayUdhaar = todaysSales.reduce(
    (sum, sale) => sum + Number(sale.payments?.udhaar || 0),
    0,
  );

  /*YESTERDAY'S DATA (For Dynamic Trends)*/
  const yesterdaySales = sales.filter(
    (sale) => sale.date.slice(0, 10) === yesterdayDate,
  );
  const yesterdayRevenue = yesterdaySales.reduce(
    (sum, sale) => sum + Number(sale.totalAmount || 0),
    0,
  );
  const yesterdayProfit = yesterdaySales.reduce(
    (sum, sale) => sum + Number(sale.profit || 0),
    0,
  );

  /*TREND CALCULATION LOGIC*/
  const calculateTrend = (todayValue, yesterdayValue) => {
    if (yesterdayValue === 0 && todayValue === 0)
      return { trend: "0%", up: true };
    if (yesterdayValue === 0) return { trend: "+100%", up: true };

    const percentageChange =
      ((todayValue - yesterdayValue) / yesterdayValue) * 100;
    const isUp = percentageChange >= 0;

    return {
      trend: `${isUp ? "+" : ""}${percentageChange.toFixed(1)}%`,
      up: isUp,
    };
  };

  const revenueTrend = calculateTrend(todayRevenue, yesterdayRevenue);
  const profitTrend = calculateTrend(todayProfit, yesterdayProfit);

  /*OUTSTANDING*/
  const totalOutstanding = customers.reduce((sum, cust) => {
    const balance =
      cust.ledger?.reduce((ledgerSum, entry) => {
        return entry.type === "debit"
          ? ledgerSum + entry.amount
          : ledgerSum - entry.amount;
      }, 0) || 0;
    return sum + (balance > 0 ? balance : 0);
  }, 0);

  /*INVENTORY VALUE*/
  const inventoryValue = items.reduce((total, product) => {
    const productValue =
      product.batches?.reduce(
        (sum, batch) => sum + batch.costPrice * batch.quantity,
        0,
      ) || 0;
    return total + productValue;
  }, 0);

  /*DYNAMIC CHART DATA*/
  const generateChartData = (days) => {
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const formatted = date.toISOString().slice(0, 10);
      const daySales = sales.filter(
        (sale) => sale.date.slice(0, 10) === formatted,
      );

      data.push({
        date: date.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        }),
        revenue: daySales.reduce(
          (sum, sale) => sum + Number(sale.totalAmount || 0),
          0,
        ),
        profit: daySales.reduce(
          (sum, sale) => sum + Number(sale.profit || 0),
          0,
        ),
      });
    }
    return data;
  };

  const chartData = generateChartData(chartRange === "7D" ? 7 : 30);

  /*TOP SELLING*/
  const itemSalesMap = {};
  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      itemSalesMap[item.name] = (itemSalesMap[item.name] || 0) + item.quantity;
    });
  });

  const topSellingData = Object.entries(itemSalesMap)
    .map(([name, quantity]) => {
      const product = items.find((i) => i.name === name);
      const rev = product ? product.sellingPrice * quantity : 0;
      return { name, quantity, revenue: rev };
    })
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const formatCurrency = (num) =>
    `₹${new Intl.NumberFormat("en-IN").format(num)}`;

  /* COMMON CHART INTERNALS TO AVOID REPETITION */
  const chartInternals = (
    <>
      <defs>
        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid
        strokeDasharray="3 3"
        stroke="#334155"
        vertical={false}
        opacity={0.3}
      />
      <XAxis
        dataKey="date"
        stroke="#94a3b8"
        tickLine={false}
        axisLine={false}
        dy={10}
        fontSize={10}
      />
      <YAxis
        stroke="#94a3b8"
        tickLine={false}
        axisLine={false}
        fontSize={10}
        tickFormatter={(val) => `₹${val}`}
      />
      <Tooltip
        contentStyle={{
          backgroundColor: "#1e293b",
          borderColor: "#334155",
          borderRadius: "12px",
          color: "#fff",
        }}
      />
      <Area
        type="monotone"
        dataKey="revenue"
        name="Revenue"
        stroke="#4f46e5"
        strokeWidth={3}
        fill="url(#colorRev)"
      />
      <Area
        type="monotone"
        dataKey="profit"
        name="Profit"
        stroke="#10b981"
        strokeWidth={3}
        fill="url(#colorProf)"
      />
    </>
  );

  return (
    <div className="text-white space-y-6 bg-transparent min-h-full pb-20">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Summary Dashboard
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Welcome back! Here is your business overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        <KPICard
          title="Today's Revenue"
          value={formatCurrency(todayRevenue)}
          trend={revenueTrend.trend}
          trendUp={revenueTrend.up}
          subtitle="vs yesterday"
        />
        <KPICard
          title="Today's Profit"
          value={formatCurrency(todayProfit)}
          trend={profitTrend.trend}
          trendUp={profitTrend.up}
          subtitle="vs yesterday"
        />
        <KPICard
          title="Inventory Value"
          value={formatCurrency(inventoryValue)}
          trend="Live"
          trendUp={true}
          subtitle="current stock"
        />
        <KPICard
          title="Outstanding Udhaar"
          value={formatCurrency(totalOutstanding)}
          trend="Total"
          trendUp={false}
          subtitle="needs recovery"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <MiniCard
          title="Cash Collected Today"
          value={todayCash}
          icon={Banknote}
          color="text-emerald-400"
          bg="bg-emerald-500/20"
        />
        <MiniCard
          title="UPI Received Today"
          value={todayUpi}
          icon={Smartphone}
          color="text-indigo-400"
          bg="bg-indigo-500/20"
        />
        <MiniCard
          title="Udhaar Given Today"
          value={todayUdhaar}
          icon={BookUser}
          color="text-rose-400"
          bg="bg-rose-500/20"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold">Sales Analytics</h2>
              <div className="flex gap-2 mt-3 bg-slate-800/50 p-1.5 rounded-xl w-fit border border-slate-700/50">
                {["7D", "30D"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setChartRange(t)}
                    className={`text-xs px-4 py-1.5 rounded-lg font-bold transition-all ${chartRange === t ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    {t === "7D" ? "Last 7 Days" : "Last 30 Days"}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-2xl font-black text-indigo-400">
                {formatCurrency(
                  chartData.reduce((sum, d) => sum + d.revenue, 0),
                )}
              </p>
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mt-1">
                Total in {chartRange}
              </p>
            </div>
          </div>

          <div className="w-full mt-4 overflow-x-auto hide-scrollbar">
            {isOldBrowser ? (
              <div style={{ width: "600px", height: "300px" }}>
                <AreaChart
                  width={600}
                  height={300}
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  {chartInternals}
                </AreaChart>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  {chartInternals}
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <RecentSalesCard
          sales={sales}
          onNavigate={() => navigate("/dashboard/reports")}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TopSellingCard data={topSellingData} />
        </div>
        <div className="xl:col-span-1">
          <DueCustomersCard
            customers={customers}
            onNavigate={() => navigate("/dashboard/khata")}
          />
        </div>
      </div>
    </div>
  );
};

/*COMPONENTS*/
const getInitials = (name) => name.substring(0, 2).toUpperCase();

const KPICard = ({ title, value, trend, trendUp, subtitle }) => (
  <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 shadow-sm relative overflow-hidden transition-all hover:border-indigo-500/30">
    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
      {title}
    </p>
    <h3 className="text-3xl font-black text-white">{value}</h3>
    <div className="flex items-center gap-2 mt-4">
      <span
        className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-md border ${trendUp ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"}`}
      >
        {trendUp ? (
          <ArrowUpRight size={14} className="mr-0.5" />
        ) : (
          <ArrowDownRight size={14} className="mr-0.5" />
        )}{" "}
        {trend}
      </span>
      <span className="text-slate-500 text-xs font-medium">{subtitle}</span>
    </div>
  </div>
);

const MiniCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-sm">
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </p>
      <p className={`text-xl font-black ${color}`}>
        ₹{new Intl.NumberFormat("en-IN").format(value)}
      </p>
    </div>
    <div
      className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg} ${color}`}
    >
      <Icon size={20} />
    </div>
  </div>
);

const RecentSalesCard = ({ sales, onNavigate }) => {
  const recent = [...sales]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);
  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Recent Orders</h2>
        <button
          onClick={onNavigate}
          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-sm font-bold bg-indigo-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className="space-y-4 flex-1">
        {recent.map((sale) => (
          <div
            key={sale.id}
            className="flex justify-between items-center group cursor-pointer hover:bg-slate-800/50 p-2 -mx-2 rounded-xl transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-slate-300">
                {getInitials(sale.invoiceNumber.replace("INV-", ""))}
              </div>
              <div>
                <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                  {sale.invoiceNumber}
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  {new Date(sale.date).toLocaleDateString("en-IN")} •{" "}
                  {sale.items.length} items
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-black text-white">₹{sale.totalAmount}</p>
              <p className="text-[10px] text-emerald-400 font-bold uppercase">
                Paid
              </p>
            </div>
          </div>
        ))}
        {recent.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-70">
            <p className="text-sm font-bold">No recent sales</p>
          </div>
        )}
      </div>
    </div>
  );
};

const TopSellingCard = ({ data }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm h-full">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-bold">Top Selling Products</h2>
    </div>
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex justify-between items-center border-b border-slate-800/60 pb-4 last:border-0 last:pb-0"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Package size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{item.name}</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {item.quantity} units sold
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-emerald-400">
              ₹{new Intl.NumberFormat("en-IN").format(item.revenue)}
            </p>
          </div>
        </div>
      ))}
      {data.length === 0 && (
        <p className="text-slate-500 text-sm text-center py-4 font-medium">
          Not enough data to show top products.
        </p>
      )}
    </div>
  </div>
);

const DueCustomersCard = ({ customers, onNavigate }) => {
  const dues = customers
    .map((cust) => {
      const balance =
        cust.ledger?.reduce(
          (sum, entry) =>
            entry.type === "debit" ? sum + entry.amount : sum - entry.amount,
          0,
        ) || 0;
      return { ...cust, balance };
    })
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Due Payments</h2>
        <button
          onClick={onNavigate}
          className="text-rose-400 hover:text-rose-300 flex items-center gap-1 text-sm font-bold bg-rose-500/10 px-3 py-1.5 rounded-lg transition-colors"
        >
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className="space-y-4 flex-1">
        {dues.map((cust) => (
          <div key={cust.id} className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-black text-slate-300">
                {getInitials(cust.name)}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{cust.name}</p>
                <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider mt-0.5">
                  Needs Recovery
                </p>
              </div>
            </div>
            <div className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-lg">
              <p className="text-xs font-black">
                ₹{new Intl.NumberFormat("en-IN").format(cust.balance)}
              </p>
            </div>
          </div>
        ))}
        {dues.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-emerald-500 opacity-80">
            <p className="text-sm font-bold">All dues cleared! 🎉</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
