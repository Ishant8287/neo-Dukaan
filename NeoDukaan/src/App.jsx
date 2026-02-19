import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import Navbar from "./components/layout/Navbar";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Inventory from "./pages/dashboard/Inventory";

const App = () => {
  return (
    <div className="relative min-h-screen bg-[#0b1120] overflow-x-hidden selection:bg-blue-600/30">
      {/* Global Glow */}
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
          {/* Landing Route with Navbar */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <LandingPage />
              </>
            }
          />

          {/* Auth Routes */}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
