import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import DashboardPreview from "../components/landing/Dashboard";
import Footer from "../components/layout/Footer";

function LandingPage() {
  return (
    <>
      <div className="pt-20">
        <Hero />
      </div>

      <Features />
      <DashboardPreview />
      <Footer />
    </>
  );
}

export default LandingPage;
