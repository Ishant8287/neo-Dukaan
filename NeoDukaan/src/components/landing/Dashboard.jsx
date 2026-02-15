import Analytics from "../../assets/images/Analytics.png";

function DashboardPreview() {
  return (  
    <section className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        {/* Image Side */}
        <div className="flex-1 w-full">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/30 rounded-3xl p-4 sm:p-6">
            <img
              src={Analytics}
              alt="Analytics Preview"
              className="rounded-2xl w-full h-auto"
            />
          </div>
        </div>

        {/* Text Side */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            See Your Business Clearly
          </h2>

          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto lg:mx-0">
            Monitor sales, profit, inventory value and top selling items with
            clean visual analytics designed for modern retailers.
          </p>

          <div className="pt-4">
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg transition duration-200 font-semibold shadow-lg shadow-blue-600/20">
              Explore Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;
