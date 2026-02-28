import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Topbar = ({ setSidebarOpen }) => {
  const [avatar, setAvatar] = useState(null);
  const [initials, setInitials] = useState("AD");

  const loadProfileData = () => {
    setAvatar(localStorage.getItem("neo_user_avatar"));
    const savedProfile = localStorage.getItem("neo_user_profile");
    if (savedProfile) {
      const { fullName } = JSON.parse(savedProfile);
      if (fullName) setInitials(fullName.substring(0, 2).toUpperCase());
    }
  };

  useEffect(() => {
    loadProfileData();
    window.addEventListener("profileUpdated", loadProfileData);
    return () => window.removeEventListener("profileUpdated", loadProfileData);
  }, []);

  return (
    <div className="h-16 border-b border-slate-800 bg-[#0b1120] flex items-center justify-between px-4 md:px-6 z-30">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden p-2 bg-slate-800 text-slate-300 rounded-xl"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        <h1 className="text-lg font-bold text-white tracking-tight">
          Dashboard Overview
        </h1>
      </div>

      <div className="flex items-center gap-4 text-sm font-medium">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
            System Live
          </span>
        </div>

        <Link
          to="/"
          className="text-slate-400 hover:text-indigo-400 transition-colors hidden sm:block"
        >
          Go to Home
        </Link>

        <Link
          to="/dashboard/profile"
          className="w-9 h-9 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold hover:scale-105 transition-transform cursor-pointer shadow-sm overflow-hidden"
        >
          {avatar ? (
            <img
              src={avatar}
              alt="User"
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
