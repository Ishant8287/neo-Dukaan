import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  User,
  Mail,
  Phone,
  Shield,
  Key,
  Bell,
  CheckCircle2,
  Camera,
} from "lucide-react";

const Profile = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [avatar, setAvatar] = useState(
    () => localStorage.getItem("neo_user_avatar") || null,
  );
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem("neo_user_profile");
    return saved
      ? JSON.parse(saved)
      : {
          fullName: "Admin User",
          email: "admin@neodukaan.com",
          phone: "9876543210",
          role: "Store Owner",
        };
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      localStorage.setItem("neo_user_profile", JSON.stringify(profileData));

      window.dispatchEvent(new Event("profileUpdated"));

      setIsSubmitting(false);
      toast.success("Profile updated successfully!");
    }, 600);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    toast.success("Password change link sent to email!");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result;
      setAvatar(base64Image);

      localStorage.setItem("neo_user_avatar", base64Image);
      window.dispatchEvent(new Event("profileUpdated"));

      toast.success("Profile picture updated!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-white space-y-6 bg-transparent min-h-screen pb-20 lg:pr-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-400 font-medium mt-0.5">
          Manage your personal account and security preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center text-center">
            <div className="relative group cursor-pointer mb-4 w-24 h-24">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#0f172a] shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl font-black border-4 border-[#0f172a] shadow-lg">
                  {profileData.fullName.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                <Camera className="text-white" size={24} />
              </div>
            </div>

            <h2 className="text-xl font-black text-white">
              {profileData.fullName}
            </h2>
            <p className="text-sm font-bold text-indigo-400 mt-1 uppercase tracking-wider">
              {profileData.role}
            </p>
            <p className="text-xs text-slate-500 font-medium mt-2">
              Member since Feb 2026
            </p>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
              <Bell size={18} className="text-amber-500" /> Notifications
            </h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-400">
                Email Alerts
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-[#0b1120]"
              />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-slate-400">
                Weekly Reports
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-slate-700 text-indigo-500 focus:ring-indigo-500 bg-[#0b1120]"
              />
            </label>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-indigo-400">
              <User size={20} /> Personal Information
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.fullName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        fullName: e.target.value,
                      })
                    }
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Role
                  </label>
                  <input
                    type="text"
                    value={profileData.role}
                    disabled
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed shadow-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Mail size={12} /> Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) =>
                      setProfileData({ ...profileData, email: e.target.value })
                    }
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone size={12} /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-800 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <CheckCircle2 size={18} /> Save Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-emerald-400">
              <Shield size={20} /> Security & Password
            </h2>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Key size={12} /> Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-sm max-w-md text-white placeholder:text-slate-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-md">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-sm text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-emerald-500 transition-colors shadow-sm text-white placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="bg-slate-800 text-slate-300 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold transition-all"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
