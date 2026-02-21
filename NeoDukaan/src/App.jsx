import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Navbar from "./components/layout/Navbar";

import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Inventory from "./pages/dashboard/Inventory";
import POS from "./pages/dashboard/POS";

const App = () => {
  //Load inventory
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("neo_inventory");
    return saved ? JSON.parse(saved) : [];
  });

  //Load sales
  const [sales, setSales] = useState(() => {
    const savedSales = localStorage.getItem("neo_sales");
    return savedSales ? JSON.parse(savedSales) : [];
  });

  //Persist inventory
  useEffect(() => {
    localStorage.setItem("neo_inventory", JSON.stringify(items));
  }, [items]);

  //Persist sales
  useEffect(() => {
    localStorage.setItem("neo_sales", JSON.stringify(sales));
  }, [sales]);

  return (
    <div className="relative min-h-screen bg-[#0b1120] overflow-x-hidden selection:bg-blue-600/30">
      <div
        className="absolute -top-60 left-1/2 -translate-x-1/2 
                 w-225 h-100 
                 bg-blue-600/15 
                 rounded-full 
                 blur-[160px] 
                 pointer-events-none"
      />

      <div className="relative z-10">
        <Routes>
          {/* Landing */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <LandingPage />
              </>
            }
          />

          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout
                items={items}
                setItems={setItems}
                sales={sales}
                setSales={setSales}
              />
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="pos" element={<POS />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
