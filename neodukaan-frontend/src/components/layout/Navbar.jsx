import { Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 LEAD DEV: Updated token key for RetailFlow
  const token = localStorage.getItem("retailflow_token");

  // 🛡️ Smart Navigation Logic
  const handleNavClick = (e, target) => {
    if (location.pathname !== "/") {
      e.preventDefault();
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(target.replace("#", ""));
        if (element) element.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <div className="fixed top-0 w-full z-50 bg-[#0b1120]/80 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto h-20 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* 🚀 LOGO REBRANDED TO RETAILFLOW */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-black shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              R
            </div>
            <span className="text-white text-xl font-black tracking-tight group-hover:text-indigo-400 transition-colors">
              RetailFlow
            </span>
          </Link>

          <div className="hidden lg:flex items-center bg-slate-800/30 border border-slate-700/50 gap-8 px-8 rounded-2xl py-2.5">
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "home")}
              className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Home
            </a>
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, "pricing")}
              className="text-sm font-bold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Pricing
            </a>
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            {token ? (
              <Link to="/dashboard" className="hidden sm:block">
                <div className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl transition-all duration-200 font-black shadow-lg shadow-indigo-600/20 active:scale-95">
                  Dashboard
                </div>
              </Link>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  to="/login"
                  className="text-sm font-black text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link to="/signup">
                  <div className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl transition-all duration-200 font-black shadow-lg shadow-indigo-600/20 active:scale-95">
                    Sign Up
                  </div>
                </Link>
              </div>
            )}

            <button
              className="lg:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="fixed inset-0 z-100 bg-[#0b1120] flex flex-col items-center justify-center gap-8 text-white text-2xl font-black animate-in fade-in zoom-in duration-200 w-screen h-screen">
          <button
            className="absolute top-6 right-6 p-3 bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>

          <a
            href="#home"
            onClick={(e) => handleNavClick(e, "home")}
            className="hover:text-indigo-500 transition-colors"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={(e) => handleNavClick(e, "features")}
            className="hover:text-indigo-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={(e) => handleNavClick(e, "pricing")}
            className="hover:text-indigo-500 transition-colors"
          >
            Pricing
          </a>

          <div className="flex flex-col gap-4 mt-6 w-72">
            {token ? (
              <Link to="/dashboard" onClick={() => setOpen(false)}>
                <div className="bg-indigo-600 text-white text-center py-4 rounded-2xl shadow-xl font-black">
                  Dashboard
                </div>
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  <div className="border-2 border-slate-700 text-white text-center py-4 rounded-2xl font-black">
                    Login
                  </div>
                </Link>
                <Link to="/signup" onClick={() => setOpen(false)}>
                  <div className="bg-indigo-600 text-white text-center py-4 rounded-2xl shadow-xl font-black">
                    Sign Up
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
