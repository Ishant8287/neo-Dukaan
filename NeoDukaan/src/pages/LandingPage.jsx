import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import DashboardPreview from "../components/landing/Dashboard";
import Footer from "../components/layout/Footer";

function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#0b1120] overflow-x-hidden selection:bg-blue-600/30">
      {/* Subtle Indigo Glow */}
      <div
        className="absolute -top-60 left-1/2 -translate-x-1/2 
                   w-225 h-87.5 
                   bg-blue-600/15 
                   rounded-full 
                   blur-[160px] 
                   pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="pt-20">
          <Hero />
        </div>

        <Features />
        <DashboardPreview />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
