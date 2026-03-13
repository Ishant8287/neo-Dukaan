import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  PackageSearch,
  ShoppingCart,
  Users,
  Settings,
  FileText,
  Settings2,
  LogOut,
  Wallet,
  Truck,
  UserCog,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("retailflow_role") || "owner";

  const allNavItems = [
    {
      name: t("dashboard"),
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["owner", "manager", "cashier"],
    },
    {
      name: t("inventory"),
      path: "/dashboard/inventory",
      icon: PackageSearch,
      roles: ["owner", "manager"],
    },
    {
      name: t("pos"),
      path: "/dashboard/pos",
      icon: ShoppingCart,
      roles: ["owner", "manager", "cashier"],
    },
    {
      name: t("khata"),
      path: "/dashboard/khata",
      icon: Users,
      roles: ["owner", "manager", "cashier"],
    },
    {
      name: t("expenses"),
      path: "/dashboard/expenses",
      icon: Wallet,
      roles: ["owner", "manager"],
    },
    {
      name: t("suppliers"),
      path: "/dashboard/suppliers",
      icon: Truck,
      roles: ["owner", "manager"],
    },
    {
      name: t("reports"),
      path: "/dashboard/reports",
      icon: FileText,
      roles: ["owner", "manager"],
    },
    {
      name: t("stockAdjustment"),
      path: "/dashboard/stock-adjustment",
      icon: Settings2,
      roles: ["owner", "manager"],
    },
    {
      name: t("staff"),
      path: "/dashboard/staff",
      icon: UserCog,
      roles: ["owner"],
    },
    {
      name: t("settings"),
      path: "/dashboard/settings",
      icon: Settings,
      roles: ["owner"],
    },
  ];

  const navItems = allNavItems.filter((item) => item.roles.includes(role));

  const handleLogout = () => {
    localStorage.removeItem("retailflow_token");
    localStorage.removeItem("retailflow_shop");
    localStorage.removeItem("retailflow_role");
    toast.success("Logged out from RetailFlow 👋");
    navigate("/login");
  };

  return (
    <>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-[#0b1120]/80 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <div
        className={`fixed md:static top-0 left-0 h-screen w-64 bg-[#0f172a] border-r border-slate-800/50 p-4 sm:p-5 transform transition-all duration-300 z-50 flex flex-col shadow-2xl md:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h2 className="text-lg font-bold text-white">RetailFlow Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <Link
          to="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center gap-3 mb-8 px-2 group cursor-pointer"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform">
            RF
          </div>
          <h1 className="text-xl font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
            RetailFlow
          </h1>
        </Link>

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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 text-sm font-bold ${isActive ? "bg-indigo-500/10 text-indigo-400 shadow-sm" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"}`}
              >
                <item.icon
                  size={18}
                  className={isActive ? "text-indigo-400" : "text-slate-500"}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-800/50 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-black text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut size={18} />
            {t("logout")}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
