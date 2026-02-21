import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";

//Local Storage
const DashboardLayout = ({ items, setItems, sales, setSales }) => {
  console.log("Layout Sales:", sales);
  
  return (
    <div className="flex min-h-screen bg-[#0b1120]">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="flex-1 p-6">
          <Outlet context={{ items, setItems, sales, setSales }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
