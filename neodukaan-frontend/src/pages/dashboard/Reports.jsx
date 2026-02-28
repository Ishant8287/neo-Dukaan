import { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell, // FIX: Recharts component import added for custom bar colors
} from "recharts";
import {
  TrendingUp,
  IndianRupee,
  Receipt,
  CreditCard,
  Calendar,
} from "lucide-react";

const Reports = () => {
  const { sales = [] } = useOutletContext();
  const [range, setRange] = useState("30d");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");

  const today = new Date();

  /*FILTER SALES*/
  const filteredSales = useMemo(() => {
    let startDate = new Date(0);
    if (range === "7d") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
    } else if (range === "30d") {
      startDate = new Date();
      startDate.setDate(today.getDate() - 30);
    } else if (range === "6m") {
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 6);
    } else if (range === "1y") {
      startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 1);
    }

    return sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      if (range === "custom" && customStart && customEnd) {
        return (
          saleDate >= new Date(customStart) && saleDate <= new Date(customEnd)
        );
      }
      return saleDate >= startDate;
    });
  }, [range, customStart, customEnd, sales]);

  /*CALCULATIONS*/
  const totalRevenue = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.totalAmount || 0),
    0,
  );
  const totalProfit = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.profit || 0),
    0,
  );
  const totalGST = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.totalTax || 0),
    0,
  );
  const totalUdhaar = filteredSales.reduce(
    (sum, sale) => sum + Number(sale.payments?.udhaar || 0),
    0,
  );

  /*PAYMENT BREAKDOWN*/
  const paymentData = [
    {
      name: "Cash",
      value: filteredSales.reduce(
        (sum, s) => sum + Number(s.payments?.cash || 0),
        0,
      ),
    },
    {
      name: "UPI",
      value: filteredSales.reduce(
        (sum, s) => sum + Number(s.payments?.upi || 0),
        0,
      ),
    },
    {
      name: "Udhaar",
      value: filteredSales.reduce(
        (sum, s) => sum + Number(s.payments?.udhaar || 0),
        0,
      ),
    },
  ];

  /*DAILY DATA*/
  const dailyMap = {};
  filteredSales.forEach((sale) => {
    const day = new Date(sale.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    });
    if (!dailyMap[day]) {
      dailyMap[day] = { date: day, revenue: 0, profit: 0 };
    }
    dailyMap[day].revenue += Number(sale.totalAmount || 0);
    dailyMap[day].profit += Number(sale.profit || 0);
  });
  const dailyData = Object.values(dailyMap);

  const formatCurrency = (num) =>
    `₹${new Intl.NumberFormat("en-IN").format(Number(num || 0))}`;

  return (
    // PERMANENT DARK MODE CLASSES APPLIED
    <div className="text-white space-y-6 bg-transparent min-h-screen pb-20">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Business Reports
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Track your revenue, profit, and taxes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 bg-[#111827] p-1.5 rounded-xl border border-slate-800 shadow-sm w-full md:w-auto">
          {[
            { id: "7d", label: "7 Days" },
            { id: "30d", label: "30 Days" },
            { id: "6m", label: "6 Months" },
            { id: "1y", label: "1 Year" },
            { id: "custom", label: "Custom" },
          ].map((r) => (
            <button
              key={r.id}
              onClick={() => setRange(r.id)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex-1 md:flex-none ${
                range === r.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* CUSTOM DATE */}
      {range === "custom" && (
        <div className="flex flex-col sm:flex-row items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar size={18} className="text-slate-400" />
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="bg-[#111827] border border-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none w-full sm:w-auto shadow-sm text-white"
            />
          </div>
          <span className="text-slate-500 font-bold hidden sm:block">to</span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar size={18} className="text-slate-400" />
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="bg-[#111827] border border-slate-800 px-4 py-2.5 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none w-full sm:w-auto shadow-sm text-white"
            />
          </div>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          title="Total Revenue"
          value={formatCurrency(totalRevenue)}
          icon={IndianRupee}
          color="text-indigo-400"
          bg="bg-indigo-500/10"
        />
        <Card
          title="Net Profit"
          value={formatCurrency(totalProfit)}
          icon={TrendingUp}
          color="text-emerald-400"
          bg="bg-emerald-500/10"
        />
        <Card
          title="GST Collected"
          value={formatCurrency(totalGST)}
          icon={Receipt}
          color="text-amber-400"
          bg="bg-amber-500/10"
        />
        <Card
          title="Udhaar Given"
          value={formatCurrency(totalUdhaar)}
          icon={CreditCard}
          color="text-rose-400"
          bg="bg-rose-500/10"
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          {/* FIX: Conditional rendering logic moved outside the wrapper */}
          {dailyData.length === 0 ? (
            <ChartBox title="Revenue & Profit Trend">
              <EmptyState />
            </ChartBox>
          ) : (
            <ChartBox title="Revenue & Profit Trend">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={dailyData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#4f46e5", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    name="Profit"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartBox>
          )}
        </div>

        <div>
          {paymentData.every((p) => p.value === 0) ? (
            <ChartBox title="Payment Methods">
              <EmptyState />
            </ChartBox>
          ) : (
            <ChartBox title="Payment Methods">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={paymentData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                    opacity={0.2}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `₹${val}`}
                  />
                  <Tooltip
                    cursor={{ fill: "#1e293b", opacity: 0.4 }}
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      border: "none",
                      color: "#fff",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
                    }}
                  />
                  <Bar dataKey="value" name="Amount" radius={[4, 4, 0, 0]}>
                    {paymentData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 0
                            ? "#10b981"
                            : index === 1
                              ? "#4f46e5"
                              : "#f43f5e"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartBox>
          )}
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const Card = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:border-indigo-500/30 transition-colors">
    <div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">
        {title}
      </p>
      <h2 className="text-2xl font-black text-white truncate">{value}</h2>
    </div>
    <div
      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}
    >
      <Icon size={24} />
    </div>
  </div>
);

// FIX: New clean wrapper without built-in ResponsiveContainer logic
const ChartBox = ({ title, children }) => (
  <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm h-full flex flex-col">
    <h2 className="text-sm font-bold mb-6 text-white uppercase tracking-wider">
      {title}
    </h2>
    <div className="flex-1 w-full flex items-center justify-center overflow-hidden min-h-75">
      {children}
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full w-full text-slate-500">
    <Receipt size={48} className="mb-3 opacity-20" />
    <p className="text-sm font-bold">No data available</p>
    <p className="text-xs mt-1">Select a different date range.</p>
  </div>
);

export default Reports;
