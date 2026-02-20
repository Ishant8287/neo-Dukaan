import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

const DashboardLayout = () => {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("neo_inventory");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("neo_inventory", JSON.stringify(items));
  }, [items]);

  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <Outlet context={{ items, setItems }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
