import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const Topbar = ({ setSidebarOpen }) => {
  const { t, i18n } = useTranslation();
  const [initials, setInitials] = useState("RF");
  const [shopName, setShopName] = useState("");
  const [userAvatar, setUserAvatar] = useState(null);
  const location = useLocation();

  const getPageTitle = (path) => {
    const map = {
      "/dashboard": t("dashboard"),
      "/dashboard/pos": t("pos"),
      "/dashboard/inventory": t("inventory"),
      "/dashboard/stock-adjustment": t("stockAdjustment"),
      "/dashboard/khata": t("khata"),
      "/dashboard/reports": t("reports"),
      "/dashboard/settings": t("settings"),
      "/dashboard/profile": t("profile"),
      "/dashboard/expenses": t("expenses"),
      "/dashboard/suppliers": t("suppliers"),
      "/dashboard/staff": t("staff"),
    };
    if (map[path]) return map[path];
    for (const [key, val] of Object.entries(map)) {
      if (path.startsWith(key) && key !== "/dashboard") return val;
    }
    return t("dashboard");
  };

  const currentPage = getPageTitle(location.pathname);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("retailflow_lang", newLang);
  };

  const syncData = () => {
    const savedShop = localStorage.getItem("retailflow_shop");
    if (savedShop) {
      try {
        const parsed = JSON.parse(savedShop);
        const name = parsed.shopName || parsed.name || "RetailFlow";
        setShopName(name);
        setInitials(name.substring(0, 2).toUpperCase());
        setUserAvatar(parsed.avatar || null);
      } catch (e) {
        console.error("Failed to parse shop data", e);
      }
    }
  };

  useEffect(() => {
    syncData();
    window.addEventListener("profileUpdated", syncData);
    return () => window.removeEventListener("profileUpdated", syncData);
  }, []);

  return (
    <div className="h-16 border-b border-slate-800 bg-[#0b1120] flex items-center justify-between px-4 md:px-6 z-30 sticky top-0">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <button
          className="md:hidden p-2 bg-slate-800 text-slate-300 rounded-xl shrink-0"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-2 overflow-hidden">
          <h1 className="text-base md:text-lg font-bold text-white tracking-tight truncate max-w-50 sm:max-w-md">
            {shopName || "My Store"}
          </h1>
          <span className="text-[10px] md:text-xs font-bold text-indigo-400 uppercase tracking-widest hidden sm:block">
            | {currentPage}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4 shrink-0">
        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
          title="Switch Language"
        >
          <span className="text-xs font-black text-white">
            {i18n.language === "en" ? "🇮🇳 हिं" : "🇬🇧 EN"}
          </span>
        </button>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            {t("live")}
          </span>
        </div>

        <Link
          to="/dashboard/profile"
          className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold hover:scale-105 transition-all overflow-hidden shadow-sm"
        >
          {userAvatar ? (
            <img
              src={userAvatar}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            initials
          )}
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
