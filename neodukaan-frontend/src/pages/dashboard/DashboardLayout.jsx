import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import API from "../../api/axiosInstance"; // 👈 API Gateway imported
import { toast } from "sonner";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 🚀 Global State: Ab ye backend se aayega, LocalStorage se nahi!
  const [items, setItems] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [shopProfile, setShopProfile] = useState({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Promise.all se hum saari APIs ek sath fast fetch kar sakte hain
        const [itemsRes, custRes, salesRes] = await Promise.all([
          API.get("/items").catch(() => ({ data: { data: [] } })),
          API.get("/customers").catch(() => ({ data: { data: [] } })),
          // Agar GET /sales backend mein nahi hai, toh ye empty array dega crash hone ki jagah
          API.get("/sales").catch(() => ({ data: { data: [] } })),
        ]);

        setItems(itemsRes.data.data || []);
        setCustomers(custRes.data.data || []);
        setSales(salesRes.data.data || []);

        // Optional: Get shop info from local storage saved during login
        const savedShop = localStorage.getItem("neodukaan_shop");
        if (savedShop) setShopProfile(JSON.parse(savedShop));
      } catch (error) {
        toast.error("🚨 Failed to sync with server!" , error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // 🛡️ Loading Screen jab tak backend se data aa raha hai
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0b1120] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-slate-400 tracking-widest uppercase text-sm">
          Syncing Dukaan...
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0b1120] text-white overflow-hidden">
      <div className="h-full print:hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="print:hidden">
          <Topbar setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#0b1120]">
          <Outlet
            context={{
              items,
              setItems,
              sales,
              setSales,
              shopProfile,
              setShopProfile,
              customers,
              setCustomers,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
