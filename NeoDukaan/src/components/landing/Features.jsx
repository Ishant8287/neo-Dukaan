function Features() {
  return (
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
          Everything You Need to Run Your Dukaan
        </h2>

        <p className="text-white/60 max-w-2xl mx-auto mb-16">
          Powerful tools built for modern retailers — manage stock, billing and
          customer credit effortlessly.
        </p>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Smart Inventory
            </h3>
            <p className="text-white/70">
              Track stock, expiry alerts, dead stock detection and low stock
              warnings with ease.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Fast Billing
            </h3>
            <p className="text-white/70">
              Ultra-fast POS system with split payments and instant digital
              invoices.
            </p>
          </div>

          <div className="group p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-blue-500/40 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-4 text-blue-400">
              Smart Khata
            </h3>
            <p className="text-white/70">
              Manage customer credit, send WhatsApp reminders and download
              monthly statements.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
