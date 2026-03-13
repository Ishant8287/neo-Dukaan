import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import API from "../../api/axiosInstance"; // 👈 API import
import {
  Building2, CreditCard, ChevronDown, ChevronUp,
  UploadCloud, FileText, CheckCircle2,
} from "lucide-react";

const profileSchema = z
  .object({
    name: z.string().trim().min(2, "Shop name is required"),
    phone: z.string().regex(/^[0-9]{10}$/, "Enter a valid 10-digit phone number"),
    email: z.string().email("Enter a valid email address").or(z.literal("")),
    gstEnabled: z.boolean(),
    gst: z.string().optional(),
    upiId: z.string().optional().refine((val) => !val || /^[\w.-]+@[\w.-]+$/.test(val), {
        message: "Invalid UPI ID format",
      }),
    bankName: z.string().optional(),
    accountNumber: z.string().optional().refine((val) => !val || /^[0-9]{9,18}$/.test(val), {
        message: "Invalid account number (9-18 digits)",
      }),
    ifsc: z.string().optional().refine((val) => !val || /^[A-Z]{4}0[A-Z0-9]{6}$/.test(val), {
        message: "Invalid IFSC code format",
      }),
    signatoryName: z.string().optional(),
    designation: z.string().optional(),
    address: z.string().optional(),
    logo: z.string().optional(),
    signature: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.gstEnabled) {
      if (!data.gst) {
        ctx.addIssue({ path: ["gst"], code: z.ZodIssueCode.custom, message: "GSTIN is required" });
      } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(data.gst)) {
        ctx.addIssue({ path: ["gst"], code: z.ZodIssueCode.custom, message: "Invalid GSTIN format" });
      }
    }
  });

const Settings = () => {
  const { shopProfile, setShopProfile } = useOutletContext();
  const [showBankDetails, setShowBankDetails] = useState(false);

  const {
    register, handleSubmit, formState: { errors, isSubmitting },
    setValue, watch, reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
    mode: "onChange",
    defaultValues: shopProfile || { gstEnabled: false },
  });

  useEffect(() => {
    if (shopProfile) {
      reset({ gstEnabled: false, ...shopProfile });
    }
  }, [shopProfile, reset]);

  // 🚀 ACTUAL BACKEND SAVE LOGIC
  const onSubmit = async (data) => {
    try {
      // Backend update call (using auth/profile or a dedicated shop profile endpoint)
      const res = await API.put("/auth/profile", data); 
      
      const updatedData = res.data.data;
      setShopProfile(updatedData);
      localStorage.setItem("neodukaan_shop", JSON.stringify(updatedData));
      
      toast.success("Business settings synced to cloud! ☁️");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save settings");
    }
  };

  const handleImageUpload = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return toast.error("File must be under 2MB");

    const reader = new FileReader();
    reader.onloadend = () => {
      setValue(field, reader.result, { shouldValidate: true });
      toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} ready to sync!`);
    };
    reader.readAsDataURL(file);
  };

  const gstEnabled = watch("gstEnabled");
  const formValues = watch();

  return (
    <div className="text-white space-y-6 bg-transparent min-h-screen pb-20 lg:pr-6">
      <div className="mb-2">
        <h1 className="text-2xl font-black tracking-tight">Business Settings</h1>
        <p className="text-sm text-slate-400 font-medium">Shop profile, bank, and branding.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="flex-1 w-full space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* General Info */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-indigo-400">
                <Building2 size={20} /> <h2 className="text-lg font-bold">General Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Input label="Shop Name *" error={errors.name} {...register("name")} placeholder="Shop Name" />
                <Input label="Phone Number *" error={errors.phone} {...register("phone")} placeholder="10-digit number" />
                <Input label="Email Address" error={errors.email} {...register("email")} placeholder="shop@email.com" />
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Full Address</label>
                  <textarea {...register("address")} rows="2" placeholder="Address" className="w-full bg-[#0b1120] border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-indigo-500 transition-colors" />
                </div>
                <div className="md:col-span-2 flex items-center gap-3 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  <input type="checkbox" id="gstEnabled" {...register("gstEnabled")} className="h-5 w-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-[#0b1120]" />
                  <label htmlFor="gstEnabled" className="text-sm font-bold cursor-pointer text-white">Enable GST Billing</label>
                </div>
                {gstEnabled && (
                  <div className="md:col-span-2 animate-in slide-in-from-top-2">
                    <Input label="GSTIN Number *" error={errors.gst} {...register("gst")} placeholder="22AAAAA0000A1Z5" />
                  </div>
                )}
              </div>
            </div>

            {/* Bank Details */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl shadow-sm overflow-hidden transition-all">
              <div className="p-6 sm:p-8 flex justify-between items-center cursor-pointer hover:bg-slate-800/50" onClick={() => setShowBankDetails(!showBankDetails)}>
                <div className="flex items-center gap-2 text-emerald-400"><CreditCard size={20} /><h2 className="text-lg font-bold text-white">Bank & UPI</h2></div>
                {showBankDetails ? <ChevronUp className="text-slate-500" /> : <ChevronDown className="text-slate-500" />}
              </div>
              {showBankDetails && (
                <div className="p-6 sm:p-8 pt-0 border-t border-slate-800 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
                    <div className="md:col-span-2"><Input label="UPI ID (For QR Code)" error={errors.upiId} {...register("upiId")} placeholder="9876543210@ptyes" /></div>
                    <Input label="Bank Name" {...register("bankName")} placeholder="e.g. SBI" />
                    <Input label="Account Number" error={errors.accountNumber} {...register("accountNumber")} placeholder="Bank Acc No." />
                    <Input label="IFSC Code" error={errors.ifsc} {...register("ifsc")} placeholder="SBIN000XXXX" />
                  </div>
                </div>
              )}
            </div>

            {/* Branding */}
            <div className="bg-[#111827] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-amber-500"><FileText size={20} /><h2 className="text-lg font-bold text-white">Branding</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <ImageUpload label="Shop Logo" value={watch("logo")} onChange={(e) => handleImageUpload(e, "logo")} />
                <ImageUpload label="Digital Signature" value={watch("signature")} onChange={(e) => handleImageUpload(e, "signature")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-4 border-t border-slate-800">
                <Input label="Signatory Name" {...register("signatoryName")} placeholder="e.g. Ishant Singh" />
                <Input label="Designation" {...register("designation")} placeholder="Owner" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-xl active:scale-95 transition-all text-lg">
                {isSubmitting ? "Syncing..." : <><CheckCircle2 size={20} /> Save Settings</>}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview (Purposely White) */}
        <div className="w-full lg:w-100 lg:sticky lg:top-24">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><FileText size={16} /> Invoice Preview</h3>
          <div className="bg-white rounded-lg p-6 shadow-2xl border border-slate-200 aspect-[1/1.4] overflow-hidden text-black flex flex-col pointer-events-none transform origin-top">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
              <div className="max-w-[60%]">
                {formValues.logo ? <img src={formValues.logo} alt="Logo" className="h-10 w-auto object-contain mb-2" /> : <div className="text-xl font-black text-slate-800 leading-none">{formValues.name || "Shop Name"}</div>}
                {formValues.gstEnabled && formValues.gst && <p className="text-[9px] text-slate-500 font-bold">GSTIN: {formValues.gst}</p>}
              </div>
              <div className="text-right"><h2 className="text-xl font-black text-slate-300 uppercase tracking-widest">Invoice</h2><p className="text-[10px] text-slate-500 mt-1">{formValues.phone || "Phone"}</p></div>
            </div>
            <div className="flex-1 space-y-3">
              <div className="bg-slate-50 rounded p-2 text-[10px] text-slate-500"><p>Invoice To: Walk-in Customer</p><p>Date: {new Date().toLocaleDateString("en-IN")}</p></div>
              <div className="border border-slate-200 rounded">
                <div className="bg-slate-100 text-[9px] font-bold grid grid-cols-4 p-1.5 border-b">
                  <div className="col-span-2">Item</div><div className="text-center">Qty</div><div className="text-right">Total</div>
                </div>
                <div className="text-[10px] grid grid-cols-4 p-1.5 text-slate-600">
                  <div className="col-span-2 truncate">Sample Product</div><div className="text-center">1</div><div className="text-right">₹100</div>
                </div>
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-slate-200 flex justify-between items-end">
              <div className="text-[8px] text-slate-400 max-w-[50%]"><p className="font-bold text-slate-600 mb-1">Terms:</p>Payment is due immediately.</div>
              <div className="text-center w-24">
                <div className="h-10 border-b border-slate-300 mb-1 flex items-end justify-center pb-1">
                  {formValues.signature ? <img src={formValues.signature} className="max-h-8 max-w-full object-contain mix-blend-multiply" alt="Sig" /> : <span className="text-slate-300 text-xs italic font-serif">Signature</span>}
                </div>
                <p className="text-[9px] font-bold text-slate-800">{formValues.signatoryName || "Signatory"}</p>
                <p className="text-[8px] text-slate-500">{formValues.designation || "Admin"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* REUSABLE COMPONENTS */
const Input = ({ label, error, ...props }) => (
  <div className="flex flex-col">
    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</label>
    <input {...props} className={`w-full bg-[#0b1120] border ${error ? "border-rose-500 focus:border-rose-400" : "border-slate-700 focus:border-indigo-500"} rounded-xl px-4 py-3 text-sm font-medium focus:outline-none transition-colors text-white placeholder:text-slate-600`} />
    {error && <span className="text-rose-400 text-xs font-bold mt-1.5 flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-rose-500"></span> {error.message}</span>}
  </div>
);

const ImageUpload = ({ label, value, onChange }) => (
  <div>
    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">{label}</label>
    <div className="relative group cursor-pointer">
      <input type="file" accept="image/*" onChange={onChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
      <div className="border-2 border-dashed border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center text-center hover:border-indigo-500 transition-colors bg-slate-800/50 h-32">
        {value ? (
          <div className="relative h-full w-full flex items-center justify-center">
            <img src={value} alt="Preview" className="max-h-full max-w-full object-contain rounded" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 rounded flex items-center justify-center transition-opacity text-white text-xs font-bold">Change Image</div>
          </div>
        ) : (
          <><UploadCloud size={24} className="text-slate-500 mb-2 group-hover:text-indigo-400" /><p className="text-sm font-bold text-slate-300">Click to upload</p><p className="text-xs text-slate-500 mt-1">Max 2MB</p></>
        )}
      </div>
    </div>
  </div>
);

export default Settings;