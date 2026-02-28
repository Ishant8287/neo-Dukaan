import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import DashboardPreview from "../components/landing/Dashboard";
import Footer from "../components/layout/Footer";
import { CheckCircle2, BookX } from "lucide-react";

const ProblemSection = () => (
  <section className="py-16 bg-[#0f172a] border-y border-slate-800">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-6 transform -rotate-6">
        <BookX size={32} />
      </div>
      <h2 className="text-2xl md:text-4xl font-black text-white mb-4">
        Still using a notebook for Udhaar?
      </h2>
      <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto font-medium">
        Losing track of customer dues, spending hours calculating daily profit,
        and writing manual bills is costing you time and money. It's time to
        upgrade your Dukaan.
      </p>
    </div>
  </section>
);

const Testimonial = () => (
  <section className="py-20 bg-[#0b1120]">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <div className="flex justify-center gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className="w-6 h-6 text-amber-500 fill-current"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-snug">
        "NeoDukaan completely changed how I run my Kirana store. I save 2 hours
        daily on calculations, and recovering udhaar via WhatsApp is magic!"
      </h3>
      <div className="flex items-center justify-center gap-4">
        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
          RS
        </div>
        <div className="text-left">
          <p className="font-bold text-white">Ramesh Sharma</p>
          <p className="text-sm text-slate-400">Owner, Sharma General Store</p>
        </div>
      </div>
    </div>
  </section>
);

const Pricing = () => (
  <section
    id="pricing"
    className="py-24 bg-[#0f172a] border-t border-slate-800"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
        Simple, Transparent Pricing
      </h2>
      <p className="text-slate-400 mb-12 font-medium">
        Start for free, upgrade when your business grows.
      </p>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free Plan */}
        <div className="bg-[#1e293b] p-8 rounded-4xl border border-slate-700 shadow-xl text-left hover:border-indigo-500/20 transition-all">
          <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
          <p className="text-slate-500 mb-6 font-medium">
            Perfect for small retail shops.
          </p>
          <p className="text-4xl font-black text-white mb-6">
            Free{" "}
            <span className="text-lg text-slate-500 font-medium">
              / forever
            </span>
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-emerald-500" size={20} /> Up to 100
              Items
            </li>
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-emerald-500" size={20} /> Standard
              POS
            </li>
            <li className="flex items-center gap-3 text-slate-300 font-medium">
              <CheckCircle2 className="text-emerald-500" size={20} /> Basic
              Khata
            </li>
          </ul>
          <button className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl transition-all active:scale-95">
            Get Started
          </button>
        </div>
        {/* Pro Plan */}
        <div className="bg-indigo-600 p-8 rounded-4xl border border-indigo-500 shadow-2xl text-left relative overflow-hidden transform md:-translate-y-4">
          <div className="absolute top-0 right-0 bg-amber-400 text-amber-900 text-xs font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">NeoDukaan Pro</h3>
          <p className="text-indigo-100 mb-6 font-medium">
            For growing businesses needing scale.
          </p>
          <p className="text-4xl font-black text-white mb-6">
            ₹499{" "}
            <span className="text-lg text-indigo-200 font-medium">/ month</span>
          </p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-center gap-3 text-white font-medium">
              <CheckCircle2 className="text-indigo-300" size={20} /> Unlimited
              Items
            </li>
            <li className="flex items-center gap-3 text-white font-medium">
              <CheckCircle2 className="text-indigo-300" size={20} /> Custom
              Invoices
            </li>
            <li className="flex items-center gap-3 text-white font-medium">
              <CheckCircle2 className="text-indigo-300" size={20} /> WhatsApp
              Reminders
            </li>
          </ul>
          <button className="w-full py-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-2xl transition-all shadow-lg active:scale-95">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  </section>
);

function LandingPage() {
  return (
    <div className="bg-[#0b1120] min-h-screen overflow-x-hidden">
      <Hero />
      <ProblemSection />
      <Features />
      <DashboardPreview />
      <Testimonial />
      <Pricing />
      <Footer />
    </div>
  );
}

export default LandingPage;
