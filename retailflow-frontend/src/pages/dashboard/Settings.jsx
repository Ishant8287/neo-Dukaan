import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import API from "../../api/axiosInstance";

const schema = z.object({
  shopName: z.string().min(2, "Shop name must be at least 2 characters"),
  ownerName: z.string().min(2, "Owner name required"),
  phone: z.string().regex(/^\d{10}$/, "Enter valid 10-digit phone"),
  address: z.string().optional(),
  upiId: z.string().optional(),
  gstin: z.string().optional(),
  bankAccount: z.string().optional(),
  ifsc: z.string().optional(),
  businessType: z.enum(["Retail", "Wholesale", "Both"]).optional(),
  currency: z.string().optional(),
});

const Settings = () => {
  const { t } = useTranslation();
  const { shopProfile, setShopProfile } = useOutletContext();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      shopName: "",
      ownerName: "",
      phone: "",
      address: "",
      upiId: "",
      gstin: "",
      bankAccount: "",
      ifsc: "",
      businessType: "Retail",
      currency: "INR",
    },
  });

  useEffect(() => {
    if (shopProfile) {
      reset({
        shopName: shopProfile.shopName || "",
        ownerName: shopProfile.ownerName || "",
        phone: shopProfile.phone || "",
        address: shopProfile.address || "",
        upiId: shopProfile.upiId || "",
        gstin: shopProfile.gstin || "",
        bankAccount: shopProfile.bankAccount || "",
        ifsc: shopProfile.ifsc || "",
        businessType: shopProfile.businessType || "Retail",
        currency: shopProfile.currency || "INR",
      });
    }
  }, [shopProfile, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await API.put("/auth/profile", data);
      setShopProfile(res.data.data);
      toast.success("Settings saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save settings.");
    }
  };

  const Field = ({ label, name, placeholder, type = "text" }) => (
    <div>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="w-full px-4 py-3 rounded-xl bg-[#0b1120] border border-slate-700 text-white placeholder-slate-600 outline-none focus:border-indigo-500 transition-colors font-medium"
      />
      {errors[name] && (
        <p className="text-rose-400 text-xs mt-1 font-bold">
          {errors[name].message}
        </p>
      )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">
          {t("businessSettings")}
        </h1>
        <p className="text-slate-400 mt-1 text-sm">
          These details appear on invoices and payment QR codes.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-white text-lg">{t("businessInfo")}</h2>
          <Field
            label={t("shopName")}
            name="shopName"
            placeholder="RetailFlow Store"
          />
          <Field
            label={t("ownerName")}
            name="ownerName"
            placeholder="Your full name"
          />
          <Field
            label={t("phone")}
            name="phone"
            placeholder="10-digit mobile"
            type="tel"
          />
          <Field
            label={t("address")}
            name="address"
            placeholder="Shop address (appears on invoice)"
          />
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              {t("businessType")}
            </label>
            <select
              {...register("businessType")}
              className="w-full px-4 py-3 rounded-xl bg-[#0b1120] border border-slate-700 text-white outline-none focus:border-indigo-500"
            >
              {["Retail", "Wholesale", "Both"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 space-y-5">
          <h2 className="font-bold text-white text-lg">
            {t("paymentDetails")}
          </h2>
          <div>
            <Field
              label={t("upiId")}
              name="upiId"
              placeholder="yourname@paytm"
            />
            <p className="text-xs text-slate-500 mt-1">
              Used to generate QR codes at POS checkout.
            </p>
          </div>
          <Field
            label={t("gstin")}
            name="gstin"
            placeholder="22AAAAA0000A1Z5 (optional)"
          />
          <Field
            label={t("bankAccount")}
            name="bankAccount"
            placeholder="For records only"
          />
          <Field label={t("ifsc")} name="ifsc" placeholder="SBIN0001234" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? t("saving")
            : isDirty
              ? t("saveSettings")
              : t("noChanges")}
        </button>
      </form>
    </div>
  );
};

export default Settings;
