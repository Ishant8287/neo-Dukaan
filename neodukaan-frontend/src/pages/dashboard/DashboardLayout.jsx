import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

const DashboardLayout = ({
  items,
  setItems,
  sales,
  setSales,
  shopProfile,
  setShopProfile,
  customers,
  setCustomers,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0b1120] text-white overflow-hidden">
      <div className="h-full print:hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="print:hidden">
          <Topbar setSidebarOpen={setSidebarOpen} />
        </div>

        {/* FIXED: Removed transition-colors and light mode bg */}
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
