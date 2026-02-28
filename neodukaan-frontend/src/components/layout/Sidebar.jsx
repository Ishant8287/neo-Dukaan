import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Settings2,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", path: "/dashboard/inventory", icon: PackageSearch },
    { name: "POS", path: "/dashboard/pos", icon: ShoppingCart },
    { name: "Khata", path: "/dashboard/khata", icon: Users },
    { name: "Reports", path: "/dashboard/reports", icon: FileText },
    {
      name: "Stock Adjustment",
      path: "/dashboard/stock-adjustment",
      icon: Settings2,
    },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <>
      {/* Overlay (Mobile Only) */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#0b1120]/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Added transition-colors duration-300 for smooth theme switch */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 
        bg-[#0f172a] border-r border-slate-800/50 p-4 sm:p-5 
        transform transition-all duration-300 z-50 flex flex-col shadow-2xl md:shadow-none
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-lg font-bold text-white transition-colors duration-300">
            Menu
          </h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg transition-colors duration-300"
          >
            <X size={20} />
          </button>
        </div>

        {/* Logo */}
        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 mb-8 px-2 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            N
          </div>
          <h1 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors duration-300">
            NeoDukaan
          </h1>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1.5 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-300 text-sm font-semibold
                  ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
              >
                <item.icon
                  size={18}
                  className={`transition-colors duration-300 ${
                    isActive ? "text-indigo-400" : "text-slate-500"
                  }`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
