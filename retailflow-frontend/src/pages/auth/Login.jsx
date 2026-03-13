import { useState, useEffect } from "react";
import { Mail, Phone, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { sendLoginOtp, verifyLoginOtp, staffLogin } from "../../api/auth.api";
import Navbar from "../../components/layout/Navbar";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loginType, setLoginType] = useState("owner");
  const [contactMethod, setContactMethod] = useState("email");
  const [contactValue, setContactValue] = useState("");
  const [otp, setOtp] = useState("");
  const [staffPhone, setStaffPhone] = useState("");
  const [staffPin, setStaffPin] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("retailflow_token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  const isValidContact = () => {
    if (contactMethod === "email")
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactValue);
    return contactValue.length === 10 && /^\d+$/.test(contactValue);
  };

  const isOtpValid = otp.length === 6 && /^\d+$/.test(otp);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidContact())
      return toast.error(`Enter a valid ${contactMethod}.`);
    setLoading(true);
    try {
      await sendLoginOtp({ contactMethod, contactValue });
      toast.success(`OTP sent to your ${contactMethod}!`);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!isOtpValid) return toast.error("Enter a valid 6-digit OTP.");
    setLoading(true);
    try {
      const res = await verifyLoginOtp({ contactMethod, contactValue, otp });
      if (res.token) {
        localStorage.setItem("retailflow_token", res.token);
        localStorage.setItem("retailflow_shop", JSON.stringify(res.data));
        toast.success("Welcome back to RetailFlow! 🚀");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleStaffLogin = async (e) => {
    e.preventDefault();
    if (!staffPhone || !staffPin)
      return toast.error("Phone and PIN are required.");
    setLoading(true);
    try {
      const res = await staffLogin({ phone: staffPhone, pin: staffPin });
      if (res.token) {
        localStorage.setItem("retailflow_token", res.token);
        localStorage.setItem("retailflow_shop", JSON.stringify(res.data));
        localStorage.setItem("retailflow_role", res.data.role);
        toast.success(`Welcome, ${res.data.name}!`);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center bg-[#0b1120] justify-center px-4 pt-20">
        <div className="bg-[#111827] border w-full max-w-md p-8 shadow-2xl border-slate-800 rounded-3xl">
          <div className="flex p-1 bg-[#0b1120] rounded-xl border border-slate-800 mb-6">
            <button
              onClick={() => {
                setLoginType("owner");
                setStep(1);
              }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === "owner" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              {t("ownerLogin")}
            </button>
            <button
              onClick={() => setLoginType("staff")}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === "staff" ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
            >
              {t("staffLogin")}
            </button>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white">
              {loginType === "staff"
                ? t("staffAccess")
                : step === 1
                  ? t("retailflowLogin")
                  : t("verifyOtp")}
            </h2>
            <p className="text-slate-400 mt-2 text-sm font-medium">
              {loginType === "staff"
                ? "Enter your phone and PIN to continue."
                : step === 1
                  ? "Enter your details to receive an OTP."
                  : `OTP sent to your ${contactMethod}.`}
            </p>
          </div>

          {loginType === "staff" && (
            <form className="space-y-5" onSubmit={handleStaffLogin}>
              <input
                type="tel"
                value={staffPhone}
                onChange={(e) => setStaffPhone(e.target.value)}
                placeholder="10-digit phone number"
                className="w-full px-4 py-4 rounded-xl bg-[#0b1120] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <input
                type="password"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value.replace(/\D/g, ""))}
                placeholder="Enter your PIN"
                maxLength={6}
                className="w-full px-4 py-4 rounded-xl bg-[#0b1120] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium tracking-widest text-center text-xl"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? t("verifying") : t("loginAsStaff")}
              </button>
            </form>
          )}

          {loginType === "owner" && step === 1 && (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div className="flex p-1 bg-[#0b1120] rounded-xl border border-slate-800">
                {["email", "phone"].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      setContactMethod(method);
                      setContactValue("");
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${contactMethod === method ? "bg-indigo-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                  >
                    {method === "email" ? (
                      <Mail size={16} />
                    ) : (
                      <Phone size={16} />
                    )}
                    {method === "email" ? t("email") : t("mobile")}
                  </button>
                ))}
              </div>
              <input
                type={contactMethod === "email" ? "email" : "tel"}
                value={contactValue}
                onChange={(e) => setContactValue(e.target.value)}
                placeholder={
                  contactMethod === "email"
                    ? "Your registered email"
                    : "10-digit mobile number"
                }
                className="w-full px-4 py-4 rounded-xl bg-[#0b1120] border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                autoFocus
              />
              <button
                type="submit"
                disabled={!isValidContact() || loading}
                className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-black transition-all ${isValidContact() && !loading ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg active:scale-95" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
              >
                {loading ? (
                  t("sendingOtp")
                ) : (
                  <>
                    {t("getOtp")} <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          )}

          {loginType === "owner" && step === 2 && (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 font-bold mb-3 justify-center uppercase tracking-widest">
                  <KeyRound size={16} className="text-indigo-400" /> 6-Digit OTP
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
                  className="px-4 py-4 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-all"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  type="submit"
                  disabled={!isOtpValid || loading}
                  className={`flex-1 py-4 rounded-xl font-black transition-all ${isOtpValid && !loading ? "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                >
                  {loading ? t("verifying") : "Verify & Login"}
                </button>
              </div>
            </form>
          )}

          {step === 1 && loginType === "owner" && (
            <p className="text-center text-sm font-bold text-slate-500 mt-8">
              {t("newToRetailflow")}{" "}
              <Link
                to="/signup"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                {t("createAccount")}
              </Link>
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
