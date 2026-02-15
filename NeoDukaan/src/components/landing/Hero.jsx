import dashboard from "../../assets/images/dashboard.png";

function Hero() {
  return (
    <section className="py-20 sm:py-24 md:py-28 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Side */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold text-white leading-[1.1]">
            Manage Stock, Billing <br />
            & Udhaar <br />
            <span className="text-blue-400">Without Tension</span>
          </h1>

          <p className="text-base sm:text-lg text-white/70 max-w-xl mx-auto lg:mx-0">
            NeoDukaan helps you track inventory, generate fast bills, manage
            khata and calculate profit — all in one system.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold shadow-lg shadow-blue-600/20 w-full sm:w-auto">
              Start Free Trial
            </button>

            <button className="border border-white/20 text-white/80 px-6 py-3 rounded-lg hover:bg-white/5 transition duration-200 font-semibold w-full sm:w-auto">
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 w-full">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/30 rounded-3xl p-4 sm:p-6">
            <img
              src={dashboard}
              alt="Dashboard Preview"
              className="rounded-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
