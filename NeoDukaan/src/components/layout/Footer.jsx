function Footer() {
  return (
    <footer className="py-16 bg-transparent border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold tracking-tight">
              NeoDukaan
            </h3>
            <p className="text-white/60 text-sm max-w-xs mx-auto md:mx-0">
              Smart retail & ledger management system designed for modern
              dukandars.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Product</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li className="hover:text-white transition cursor-pointer">
                Features
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Pricing
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Demo
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-white font-medium">Company</h4>
            <ul className="space-y-2 text-white/60 text-sm">
              <li className="hover:text-white transition cursor-pointer">
                About
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-white transition cursor-pointer">
                Terms
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-white/10 text-center text-white/50 text-sm">
          © 2026 NeoDukaan. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
