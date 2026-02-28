import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Terms = ({ theme, setTheme }) => {
  return (
    <div className="bg-slate-50 dark:bg-[#0b1120] min-h-screen transition-colors duration-300 flex flex-col">
      <Navbar theme={theme} setTheme={setTheme} />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-slate-500 font-medium mb-12">
          Last Updated: February 2026
        </p>

        <div className="space-y-8 text-slate-700 dark:text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the NeoDukaan platform ("Service"), you
              accept and agree to be bound by the terms and provision of this
              agreement. In addition, when using these particular services, you
              shall be subject to any posted guidelines or rules applicable to
              such services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              2. Description of Service
            </h2>
            <p>
              NeoDukaan provides a digital ledger, inventory management, and
              Point of Sale (POS) system for retail shops. We reserve the right
              to modify, suspend or discontinue the Service with or without
              notice at any time and without any liability to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              3. User Responsibilities
            </h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                You are responsible for maintaining the confidentiality of your
                account and password.
              </li>
              <li>
                You are responsible for all data entered into the system,
                including GST calculations, invoice generation, and customer
                ledgers.
              </li>
              <li>
                You agree not to use the Service for any illegal or unauthorized
                purpose.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              4. Payments and Subscriptions
            </h2>
            <p>
              If you choose to upgrade to a paid premium plan (NeoDukaan Pro),
              you agree to pay the fees quoted to you when you purchase that
              service. We reserve the right to change our pricing at any time
              with appropriate notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              5. Limitation of Liability
            </h2>
            <p>
              NeoDukaan shall not be liable for any direct, indirect,
              incidental, special, or consequential damages resulting from the
              use or inability to use the service, including but not limited to
              loss of profits, data, or business interruptions.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
