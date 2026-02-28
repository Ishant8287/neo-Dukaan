import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Privacy = ({ theme, setTheme }) => {
  return (
    <div className="bg-[#0b1120] min-h-screen flex flex-col">
      <Navbar theme={theme} setTheme={setTheme} />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-32 w-full">
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-slate-500 font-medium mb-12">
          Last Updated: February 2026
        </p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              1. Information We Collect
            </h2>
            <p>
              When you use NeoDukaan, we collect the following types of
              information:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>
                <strong>Account Information:</strong> Your shop name, phone
                number, email address, and GSTIN (if provided).
              </li>
              <li>
                <strong>Operational Data:</strong> Inventory items, sales
                records, invoice details, and customer ledger data (Khata).
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, and interaction analytics to improve our application.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is strictly used to provide and improve the NeoDukaan
              service. We use it to generate your invoices, calculate your
              analytics, and send WhatsApp reminders on your behalf.{" "}
              <strong className="text-white">
                We do not sell your personal data or your customers' data to
                third-party advertisers.
              </strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              3. Local Storage & Cloud Sync
            </h2>
            <p>
              To provide an "Offline-Ready" experience, a portion of your active
              operational data is stored locally on your device's browser
              (LocalStorage/IndexedDB). This ensures your POS works even without
              internet. When connected, this data is securely synced to our
              encrypted cloud servers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">4. Security</h2>
            <p>
              We implement industry-standard security measures to protect your
              information from unauthorized access, alteration, or destruction.
              However, no method of transmission over the Internet is 100%
              secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">
              5. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at support@neodukaan.com.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
