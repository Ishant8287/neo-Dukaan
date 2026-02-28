import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  const handleScroll = () => {
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
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-11 sm:h-11 bg-indigo-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              N
            </div>
            <span className="text-white text-xl font-black tracking-tight group-hover:text-indigo-400 transition-colors">
              NeoDukaan
            </span>
          </Link>

          <div className="hidden lg:flex items-center bg-slate-800/50 border border-slate-700/50 gap-8 px-8 rounded-2xl py-2.5">
            <a
              href="#home"
              className="text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Home
            </a>
            <a
              href="#features"
              className="text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer"
            >
              Demo
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/dashboard" className="hidden sm:block">
              <div className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition-all duration-200 font-bold shadow-md shadow-indigo-600/20 active:scale-95">
                Open App
              </div>
            </Link>

            <button
              className="lg:hidden p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-100 bg-[#0b1120] flex flex-col items-center justify-center gap-8 text-white text-xl font-bold animate-in fade-in zoom-in duration-200 w-screen h-screen">
          <button
            className="absolute top-6 right-6 p-2 bg-slate-800 rounded-full text-slate-500 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
          >
            <X size={24} />
          </button>

          <a
            href="#home"
            onClick={handleScroll}
            className="hover:text-indigo-600 transition-colors"
          >
            Home
          </a>
          <a
            href="#features"
            onClick={handleScroll}
            className="hover:text-indigo-600 transition-colors"
          >
            Features
          </a>
          <a
            href="#pricing"
            onClick={handleScroll}
            className="hover:text-indigo-600 transition-colors"
          >
            Pricing
          </a>
          <Link
            to="/dashboard"
            onClick={handleScroll}
            className="hover:text-indigo-600 transition-colors"
          >
            Demo
          </Link>

          <Link to="/dashboard" onClick={() => setOpen(false)}>
            <div className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">
              Open App
            </div>
          </Link>
        </div>
      )}
    </>
  );
}

export default Navbar;
