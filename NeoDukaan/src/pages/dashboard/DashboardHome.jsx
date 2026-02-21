import StateCard from "../../components/common/StateCard";
import { useOutletContext } from "react-router-dom";

const DashboardHome = () => {
  //From dashboard layout
  const { sales, items, setSales, setItems } = useOutletContext();

  //Converting date to yyyymmdd format
  const todayDate = new Date().toISOString().slice(0, 10);

  //Filter Today's Sale
  const filteredSales = sales.filter(
    (sale) => todayDate === sale.date.slice(0, 10),
  );

  //Today's Revenue
  const Revenue = filteredSales.reduce((sum, sale) => {
    return (sum += sale.totalAmount);
  }, 0);

  //Today's Profit
  const todaysProfit = filteredSales.reduce((sum, sale) => {
    return sum + sale.totalProfit;
  }, 0);

  //Inventory Value
  const Inventoryvalue = items.reduce((sum, item) => {
    return (sum += item.costPrice * item.stock);
  }, 0);

  //Low Stock count
  const stockLength = items.filter(
    (item) => item.stock > 0 && item.stock < item.lowStockThreshold,
  ).length;

  //Real Stats Array
  const stats = [
    { title: "Today's Sales", value: `₹${Revenue}` },
    { title: "Net Profit", value: `₹${todaysProfit}` },
    { title: "Low Stock Items", value: stockLength },
    { title: "Inventory Value", value: `₹${Inventoryvalue}` },
  ];

  console.log("Home Sales:", sales);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-semibold mb-6 tracking-tight">Overview</h1>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, index) => (
          <StateCard key={index} title={item.title} value={item.value} />
        ))}
      </div>

      {stockLength > 0 && (
        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
          ⚠ {stockLength} items are low in stock. Please restock soon.
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
