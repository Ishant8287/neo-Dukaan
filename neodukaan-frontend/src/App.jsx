import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

/*PUBLIC PAGES*/
import LandingPage from "./pages/LandingPage";
import About from "./pages/About";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Navbar from "./components/layout/Navbar";
import NotFound from "./pages/NotFound";

/*DASHBOARD PAGES*/
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Inventory from "./pages/dashboard/Inventory";
import POS from "./pages/dashboard/POS";
import Invoice from "./pages/dashboard/Invoice";
import Settings from "./pages/dashboard/Settings";
import Khata from "./pages/dashboard/Khata";
import Reports from "./pages/dashboard/Reports";
import StockAdjustment from "./pages/dashboard/StockAdjustment";
import Profile from "./pages/dashboard/Profile";

/*SAFE PARSE*/
const safeParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

/*STORAGE KEYS*/
const STORAGE_KEYS = {
  inventory: "neo_inventory_v1",
  sales: "neo_sales_v1",
  shop: "neo_shop_v1",
  customers: "neo_customers_v1",
};

const App = () => {
  /*DATA STATES*/
  const [items, setItems] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEYS.inventory), []),
  );

  const [sales, setSales] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEYS.sales), []),
  );

  const [shopProfile, setShopProfile] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEYS.shop), {
      name: "NeoDukaan Retail",
      phone: "",
      address: "",
      gst: "",
      logo: "",
      signature: "",
    }),
  );

  const [customers, setCustomers] = useState(() =>
    safeParse(localStorage.getItem(STORAGE_KEYS.customers), []),
  );

  /*AUTO PERSIST*/
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.inventory, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.sales, JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.shop, JSON.stringify(shopProfile));
  }, [shopProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(customers));
  }, [customers]);

  /*GLOBAL RESET*/
  const resetAppData = () => {
    if (window.confirm("Are you sure? This will delete all your local data.")) {
      Object.values(STORAGE_KEYS).forEach((key) =>
        localStorage.removeItem(key),
      );
      window.location.reload();
    }
  };

  /*UI*/
  return (
    <div className="min-h-screen w-full bg-[#0b1120]">
      <Toaster richColors position="top-right" theme="dark" />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <LandingPage />
            </>
          }
        />

        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <DashboardLayout
              items={items}
              setItems={setItems}
              sales={sales}
              setSales={setSales}
              shopProfile={shopProfile}
              setShopProfile={setShopProfile}
              customers={customers}
              setCustomers={setCustomers}
              resetAppData={resetAppData}
            />
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="khata" element={<Khata />} />
          <Route path="pos" element={<POS />} />
          <Route path="invoice/:id" element={<Invoice />} />
          <Route path="settings" element={<Settings />} />
          <Route path="stock-adjustment" element={<StockAdjustment />} />
          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
