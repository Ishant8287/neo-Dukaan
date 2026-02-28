import dashboard from "../../assets/Images/dashboard.png";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Zap, MapPin } from "lucide-react";

function Hero() {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      className="py-12 sm:py-20 md:py-24 bg-[#0b1120] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <div className="flex justify-center lg:justify-start">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold tracking-widest uppercase border border-indigo-500/20 shadow-sm">
              Built for Indian Kirana & Retail Stores
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl tracking-tight font-black text-white leading-[1.1]">
            Manage Stock, Billing <br className="hidden sm:block" />
            & Udhaar <br />
            <span className="text-indigo-500">Without Tension</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-medium">
            NeoDukaan helps you track inventory, generate fast bills, manage
            khata and calculate profit — all in one powerful system.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 pt-2 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <MapPin size={16} className="text-emerald-500" /> Made in India
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <ShieldCheck size={16} className="text-indigo-500" /> Secure Data
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <Zap size={16} className="text-amber-500" /> Offline Ready
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl transition duration-200 font-bold shadow-lg shadow-indigo-600/30 w-full sm:w-auto text-lg active:scale-95"
            >
              Open App
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="border-2 border-slate-800 text-white hover:bg-slate-800 transition duration-200 font-bold w-full sm:w-auto text-lg active:scale-95"
            >
              View Demo
            </button>
          </div>
        </div>

        <div className="flex-1 w-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/10 blur-[100px] rounded-full -z-10 hidden lg:block"></div>

          <div className="bg-[#171e2e] border border-slate-800 backdrop-blur-md shadow-2xl rounded-3xl p-3 sm:p-5">
            <img
              src={dashboard}
              alt="Dashboard Preview"
              className="rounded-xl w-full h-auto shadow-inner border border-slate-700/50"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
