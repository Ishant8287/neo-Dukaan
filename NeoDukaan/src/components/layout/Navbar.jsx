import NeoDukaan from "../../assets/images/Neo.png";
import { Moon, Menu } from "lucide-react";

function Navbar() {
  return (
    <div className="bg-transparent h-20 w-full px-4 sm:px-6 lg:px-16 flex items-center justify-between">
      {/* LEFT - Logo */}
      <div className="flex items-center gap-3">
        <img
          src={NeoDukaan}
          alt="NeoDukaan Logo"
          className="h-10 sm:h-12 invert cursor-pointer"
        />
        <span className="text-white text-lg font-semibold cursor-pointer hover:text-blue-500 transition-colors">
          NeoDukaan
        </span>
      </div>

      {/* CENTER - Links (Hidden on mobile) */}
      <div className="hidden lg:flex items-center bg-white/5 border backdrop-blur-md shadow-md border-white/10 gap-9 px-8 rounded-xl py-3">
        <h3 className="text-white/70 hover:text-blue-500 transition-colors cursor-pointer">
          Home
        </h3>
        <h3 className="text-white/70 hover:text-blue-500 transition-colors cursor-pointer">
          Features
        </h3>
        <h3 className="text-white/70 hover:text-blue-500 transition-colors cursor-pointer">
          Pricing
        </h3>
        <h3 className="text-white/70 hover:text-blue-500 transition-colors cursor-pointer">
          Demo
        </h3>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {/* Hide Sign In on small screens */}
        <div className="hidden sm:block text-white/70 hover:text-white cursor-pointer transition">
          Sign In
        </div>

        {/* CTA */}
        <div className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-blue-600/20 cursor-pointer">
          Log In
        </div>

        {/* Moon Icon */}
        <div className="text-white/70 p-2 rounded-lg hover:bg-white/5 hover:text-blue-500 cursor-pointer transition">
          <Moon size={18} />
        </div>

        {/* Hamburger (only on mobile) */}
        <div className="lg:hidden text-white/70 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition">
          <Menu size={20} />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
