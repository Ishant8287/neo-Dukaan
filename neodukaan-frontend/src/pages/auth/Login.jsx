import { useState, useEffect } from "react";
import { Mail, Phone, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { sendLoginOtp, verifyLoginOtp } from "../../api/auth.api";
import Navbar from "../../components/layout/Navbar";

const Login = () => {
  const navigate = useNavigate();

  // 🚀 LEAD DEV: 2-Step Form State
  const [step, setStep] = useState(1); // 1 = Contact, 2 = OTP
  const [contactMethod, setContactMethod] = useState("email"); // 'email' ya 'phone'
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect agar pehle se login hai
  useEffect(() => {
    const token = localStorage.getItem("neodukaan_token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  // Validation
  const isValidContact = () => {
    if (contactMethod === "email") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);
    }
    return contactValue.length === 10 && /^\d+$/.test(contactValue);
  };

  const isOtpValid = otp.length === 6 && /^\d+$/.test(otp);

  // 🚀 Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidContact())
      return toast.error(`Please enter a valid ${contactMethod}!`);

    setLoading(true);
    try {
      await sendLoginOtp({ contactMethod, contactValue });
      toast.success(`OTP sent to your ${contactMethod}! 🚀`);
      setStep(2); // Move to OTP Screen
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  // 🚀 Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isOtpValid) return toast.error("Please enter a 6-digit OTP!");

    setLoading(true);
    try {
      const res = await verifyLoginOtp({ contactMethod, contactValue, otp });

      if (res.token) {
        // Token save kiya (keys wahi rakhi hain taaki purana app crash na ho)
        localStorage.setItem("neodukaan_token", res.token);
        localStorage.setItem("neodukaan_shop", JSON.stringify(res.data));
        toast.success("Welcome back to RetailFlow! 🚀");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center bg-[#0b1120] justify-center px-4 pt-20">
        <div className="bg-[#111827] border w-full max-w-md p-8 shadow-2xl border-slate-800 rounded-3xl relative overflow-hidden">
          <div className="text-center mb-8 relative z-10">
            <h2 className="text-2xl font-black text-white">
              {step === 1 ? "RetailFlow Login" : "Verify Identity"}
            </h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              {step === 1
                ? "Enter your details to receive an OTP."
                : `We sent a 6-digit code to your ${contactMethod}.`}
            </p>
          </div>

          {/* 🚀 STEP 1 FORM: EMAIL/PHONE */}
          {step === 1 && (
            <form className="space-y-6 relative z-10" onSubmit={handleSendOtp}>
              <div className="flex p-1 bg-[#0b1120] rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setContactMethod("email");
                    setContactValue("");
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${contactMethod === "email" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                >
                  <Mail size={16} /> Email
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setContactMethod("phone");
                    setContactValue("");
                  }}
                  className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${contactMethod === "phone" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                >
                  <Phone size={16} /> Mobile
                </button>
              </div>

              <div>
                <input
                  type={contactMethod === "email" ? "email" : "tel"}
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder={
                    contactMethod === "email"
                      ? "Enter your registered email"
                      : "Enter 10-digit mobile number"
                  }
                  className="w-full px-4 py-4 rounded-xl bg-[#0b1120] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={!isValidContact() || loading}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${isValidContact() && !loading ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 active:scale-95" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
              >
                {loading ? (
                  "Sending OTP..."
                ) : (
                  <>
                    Get OTP <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 🚀 STEP 2 FORM: OTP */}
          {step === 2 && (
            <form
              className="space-y-6 relative z-10"
              onSubmit={handleVerifyOtp}
            >
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 font-bold mb-3 justify-center uppercase tracking-widest">
                  <KeyRound size={16} className="text-indigo-400" /> Enter
                  6-Digit OTP
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="••••••"
                  className="w-full text-center tracking-[1em] px-4 py-4 rounded-xl bg-[#0b1120] border border-slate-700 text-white text-xl font-black focus:outline-none focus:border-indigo-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-4 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all flex items-center justify-center"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!isOtpValid || loading}
                  className={`flex-1 py-4 rounded-xl font-black transition-all ${isOtpValid && !loading ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 active:scale-95" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                >
                  {loading ? "Verifying..." : "Verify & Login"}
                </button>
              </div>
            </form>
          )}

          {step === 1 && (
            <p className="text-center text-sm font-bold text-slate-500 mt-8 relative z-10">
              New to RetailFlow?{" "}
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Create Account
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
