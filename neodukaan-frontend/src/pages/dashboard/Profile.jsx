import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom"; // 👈 Context use karenge
import { toast } from "sonner";
import { User, Shield, CheckCircle2, Camera } from "lucide-react";
import API from "../../api/axiosInstance";

const Profile = () => {
  const { shopProfile, setShopProfile } = useOutletContext(); // 👈 Global state se sync
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [profileData, setProfileData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    shopName: "",
    avatar: null,
  });

  // 🔄 Sync with Global Context
  useEffect(() => {
    if (shopProfile) {
      setProfileData({
        ownerName: shopProfile.ownerName || "",
        email: shopProfile.email || "",
        phone: shopProfile.phone || "",
        shopName: shopProfile.shopName || "",
        avatar: shopProfile.avatar || null,
      });
      setAvatar(shopProfile.avatar || null);
    }
  }, [shopProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await API.put("/auth/profile", profileData);

      // Update local storage and global context
      localStorage.setItem("neodukaan_shop", JSON.stringify(res.data.data));
      setShopProfile(res.data.data);

      window.dispatchEvent(new Event("profileUpdated"));
      toast.success("Profile updated successfully! 🚀");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024)
      return toast.error("File must be under 2MB");

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setAvatar(base64String);
      setProfileData((prev) => ({ ...prev, avatar: base64String }));
      toast.info("Click 'Save Changes' to upload photo.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="text-white space-y-6 bg-transparent min-h-screen pb-20 lg:pr-6">
      <div>
        <h1 className="text-2xl font-black tracking-tight">My Profile</h1>
        <p className="text-sm text-slate-400 font-medium">
          Manage your personal account and security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Avatar Card */}
        <div className="bg-[#111827] border border-slate-800 rounded-3xl p-8 flex flex-col items-center text-center shadow-sm h-fit">
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
                className="w-24 h-24 rounded-full object-cover border-4 border-[#0f172a]"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-3xl font-black border-4 border-[#0f172a]">
                {profileData.ownerName?.substring(0, 2).toUpperCase() || "ND"}
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
              <Camera className="text-white" size={24} />
            </div>
          </div>
          <h2 className="text-xl font-black text-white">
            {profileData.ownerName || "Owner Name"}
          </h2>
          <p className="text-sm font-bold text-indigo-400 uppercase tracking-wider">
            {profileData.shopName || "Shop Name"}
          </p>
        </div>

        {/* Right: Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-indigo-400">
              <User size={20} /> Personal Information
            </h2>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.ownerName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        ownerName: e.target.value,
                      })
                    }
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    value={profileData.shopName}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        shopName: e.target.value,
                      })
                    }
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                    className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-800 mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 shadow-lg"
                >
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <CheckCircle2 size={18} className="inline mr-2" />
                      Save Changes
                    </>
                  )}
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
