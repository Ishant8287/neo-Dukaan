import { PackageSearch, Zap, BookOpenCheck } from "lucide-react";

function Features() {
  return (
    <section
      id="features"
      className="py-24 bg-transparent relative transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight transition-colors duration-300">
          Everything You Need to Run Your Dukaan
        </h2>

        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 text-lg font-medium transition-colors duration-300">
          Powerful tools built for modern retailers — manage stock, billing and
          customer credit effortlessly without the headache of manual logs.
        </p>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Feature 1 */}
          <div className="group p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#171e2e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-indigo-500/50 dark:hover:border-indigo-500/50 transition-all duration-300 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-indigo-500/20"></div>
            <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <PackageSearch size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Smart Inventory
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors duration-300">
              Track stock levels, detect dead stock, and get low stock warnings
              automatically before you run out.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#171e2e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-emerald-500/20"></div>
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              Fast Billing (POS)
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors duration-300">
              Ultra-fast Point of Sale system with split payments (Cash+UPI) and
              instant dynamic QR code generation.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#171e2e] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-amber-500/50 dark:hover:border-amber-500/50 transition-all duration-300 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-all group-hover:bg-amber-500/20"></div>
            <div className="w-14 h-14 bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <BookOpenCheck size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              Smart Khata
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors duration-300">
              Manage customer credit effortlessly. Send 1-click WhatsApp
              reminders with direct UPI payment links.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
