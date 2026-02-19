import { User, Mail, Store, Phone, UserRoundKey } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Signup = () => {
  //Store Form data
  const [formData, setFormData] = useState({
    fullName: "",
    shopName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  //useState for error
  const [error, setError] = useState({});

  //Loading State
  const [loading, setLoading] = useState(false);

  //password strength
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return "";

    const hasNumber = /\d/.test(pwd);
    const hasLetter = /[a-zA-Z]/.test(pwd);

    if (pwd.length < 6) return "Weak";
    if (pwd.length >= 6 && (!hasNumber || !hasLetter)) return "Medium";
    if (pwd.length >= 8 && hasNumber && hasLetter) return "Strong";

    return "Medium";
  };

  const strength = getPasswordStrength();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Validation Function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required!";
    }

    if (!formData.shopName.trim()) {
      newErrors.shopName = "Shop Name is required!";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (formData.phone.length !== 10) {
      newErrors.phone = "Enter a valid phone number!";
    }

    if (strength === "Weak") {
      newErrors.password = "Password is too weak";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password mismatch";
    }

    return newErrors;
  };

  //Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const validateErrors = validateForm();

    if (Object.keys(validateErrors).length > 0) {
      setError(validateErrors);
      return;
    }

    setError({});
    setLoading(true);
    console.log(formData);

    //stimulate API call
    setTimeout(() => {
      console.log("Account Created: ", formData);
      setLoading(false);
    }, 1500);
  };

  //isvalid Check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isFormValid =
    formData.fullName.trim() &&
    formData.shopName.trim() &&
    emailRegex.test(formData.email) &&
    formData.phone.length === 10 &&
    strength !== "Weak" &&
    formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center bg-[#0b1120] justify-center px-4">
      <div className="bg-white/5 mt-10 border w-full max-w-md backdrop-blur-md p-8 shadow-lg shadow-black/30 border-white/10   rounded-2xl ">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">
            Create Your Store Account
          </h2>
          <p className="text-white/60 mt-2 text-sm">
            Start managing inventory and billing in minutes.
          </p>
        </div>

        <form className="space-y-5" onSubmit={(e) => handleSubmit(e)}>
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ">
              <User /> Full Name
            </label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              required
              placeholder="Enter Full Name"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
            />
            {error.fullName && (
              <p className="text-red-400 text-sm mt-2">{error.fullName}</p>
            )}
          </div>

          {/* Shop name */}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ">
              <Store /> Shop Name
            </label>
            <input
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              required
              type="text"
              placeholder="Enter shop name"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
            />
            {error.shopName && (
              <p className="text-red-400 text-sm mt-2">{error.shopName}</p>
            )}
          </div>

          {/*Email Address*/}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ">
              <Mail /> Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter Email Address"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
            />
            {error.email && (
              <p className="text-red-400 text-sm mt-2">{error.email}</p>
            )}
          </div>

          {/*Phone Number*/}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ">
              <Phone /> Phone Number
            </label>
            <input
              type="tel"
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
              placeholder="Enter phone number"
            />
            {error.phone && (
              <p className="text-red-400 text-sm mt-2">{error.phone}</p>
            )}
          </div>

          {/*Password*/}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/70 mb-2">
              <UserRoundKey /> Password
            </label>
            <input
              type="password"
              required
              name="password"
              onChange={handleChange}
              value={formData.password}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
              placeholder="Enter password"
            />
            {formData.password && (
              <p
                className={`text-sm mt-2 ${
                  strength === "Weak"
                    ? "text-red-400"
                    : strength === "Medium"
                      ? "text-orange-400"
                      : "text-green-400"
                }`}
              >
                Password strength: {strength}
              </p>
            )}

            {error.password && (
              <p className="text-red-400 text-sm mt-2">{error.password}</p>
            )}
          </div>

          {/*Confirm Password*/}
          <div>
            <label className="flex items-center gap-2 text-sm text-white/70 mb-2 ">
              <UserRoundKey />
              Confirm Password
            </label>
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              required
              onChange={handleChange}
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-blue-500"
              placeholder="Confirm Password"
            />
            {formData.confirmPassword &&
              formData.confirmPassword !== formData.password && (
                <p className="text-red-400 text-sm mt-2">
                  Password do not match!
                </p>
              )}

            {error.confirmPassword && (
              <p className="text-red-400 text-sm mt-2">
                {error.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!isFormValid || loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
              isFormValid && !loading
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20"
                : "bg-gray-600 text-gray-400 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-center text-sm text-white/60 mt-6">
            Already have an account?
            <span className="text-blue-500 hover:underline cursor-pointer">
              <Link to="/login">
                <div className=" hover:text-white cursor-pointer">Log In</div>
              </Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
