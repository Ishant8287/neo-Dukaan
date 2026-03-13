/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import API from "../../api/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  MessageCircle,
  X,
  Search,
  FileText,
  UserPlus,
  Filter,
} from "lucide-react";

const Khata = () => {
  const { customers = [], setCustomers, shopProfile = {} } = useOutletContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentCustomer, setPaymentCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [search, setSearch] = useState("");
  const [filterDue, setFilterDue] = useState("all");

  /* API: ADD CUSTOMER */
  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name & Phone required");
      return;
    }
    try {
      const res = await API.post("/customers", newCustomer);
      setCustomers((prev) => [...prev, res.data.data]);
      toast.success("Customer added successfully!");
      setNewCustomer({ name: "", phone: "", address: "" });
      setIsDrawerOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add customer");
    }
  };

  /* API: RECEIVE PAYMENT */
  const handleReceivePayment = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0)
      return toast.error("Invalid amount");
    if (Number(paymentAmount) > paymentCustomer.totalUdhaar)
      return toast.error("Payment exceeds due amount");

    try {
      const res = await API.put(`/customers/${paymentCustomer._id}`, {
        totalUdhaar: paymentCustomer.totalUdhaar - Number(paymentAmount),
      });

      setCustomers((prev) =>
        prev.map((c) => (c._id === paymentCustomer._id ? res.data.data : c)),
      );
      toast.success(`₹${paymentAmount} payment recorded!`);
      setPaymentCustomer(null);
      setPaymentAmount("");
    } catch (error) {
      toast.error("Failed to process payment");
    }
  };

  /* WHATSAPP REMINDER */
  const sendWhatsAppReminder = (customer) => {
    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);
    const shopName = shopProfile.name || "NeoDukaan";
    const upiLink = shopProfile.upiId
      ? `upi://pay?pa=${shopProfile.upiId}&pn=${shopName}&am=${customer.totalUdhaar}&cu=INR`
      : "";

    let msg = `Namaste *${customer.name}* 🙏,\nAapka *${shopName}* par ₹${customer.totalUdhaar} ka Udhaar baaki hai.\n\n`;
    if (upiLink)
      msg += `Kripya is link par click karke payment karein:\n${upiLink}\n\n`;
    msg += `Dhanyawad!`;

    window.open(
      `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };

  /* PDF STATEMENT (Now properly used!) */
  const downloadCustomerStatement = (customer) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(`Khata Statement: ${customer.name}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Total Due: Rs. ${customer.totalUdhaar}`, 14, 30);

    // AutoTable Logic
    autoTable(doc, {
      startY: 40,
      head: [["Customer Name", "Phone", "Outstanding Amount"]],
      body: [[customer.name, customer.phone, `Rs. ${customer.totalUdhaar}`]],
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save(`${customer.name}_Statement.pdf`);
    toast.success("Statement Downloaded!");
  };

  /* FILTERING */
  const filteredCustomers = customers.filter((c) => {
    const match =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const due = c.totalUdhaar || 0;
    if (filterDue === "due") return match && due > 0;
    if (filterDue === "cleared") return match && due <= 0;
    return match;
  });

  return (
    <div className="text-white space-y-6 bg-transparent min-h-screen pb-20">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Khata Book</h1>
          <p className="text-sm text-slate-400">
            Manage customer dues and send reminders.
          </p>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
        >
          <UserPlus size={18} /> Add Customer
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white"
          />
        </div>
        <select
          value={filterDue}
          onChange={(e) => setFilterDue(e.target.value)}
          className="w-full sm:w-48 pl-4 pr-10 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-white cursor-pointer"
        >
          <option value="all">All Customers</option>
          <option value="due">Pending Dues</option>
          <option value="cleared">Cleared / Zero Due</option>
        </select>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-medium">
            No customers found. Add one to start tracking udhaar.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredCustomers.map((c) => (
              <div
                key={c._id}
                className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-800/20"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 font-black items-center justify-center flex text-lg">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100">{c.name}</h3>
                    <p className="text-slate-400 text-xs">{c.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2.5 py-1 rounded-md text-sm font-black border ${c.totalUdhaar > 0 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"}`}
                  >
                    ₹{c.totalUdhaar || 0}
                  </span>

                  {/* 👈 PDF Download Button Added Back */}
                  <button
                    onClick={() => downloadCustomerStatement(c)}
                    className="p-2 text-slate-400 bg-slate-800 hover:text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <FileText size={18} />
                  </button>

                  <button
                    onClick={() => sendWhatsAppReminder(c)}
                    disabled={c.totalUdhaar <= 0}
                    className="px-3 py-2 rounded-lg text-xs font-bold bg-[#25D366]/10 text-[#25D366]"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setPaymentCustomer(c)}
                    disabled={c.totalUdhaar <= 0}
                    className="px-4 py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white"
                  >
                    Receive Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
      {isDrawerOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/80">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-3xl w-full max-w-sm relative">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-white mb-6">New Customer</h2>
            <input
              placeholder="Name"
              className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-xl mb-4 text-white"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
            />
            <input
              placeholder="Phone"
              className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-xl mb-6 text-white"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
            />
            <button
              onClick={handleAddCustomer}
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-black"
            >
              Save Customer
            </button>
          </div>
        </div>
      )}

      {paymentCustomer && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-slate-900/80">
          <div className="bg-[#111827] border border-slate-800 p-6 rounded-3xl w-full max-w-sm relative">
            <button
              onClick={() => setPaymentCustomer(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-black text-white mb-2">
              Receive Payment
            </h2>
            <p className="text-slate-400 mb-6">From {paymentCustomer.name}</p>
            <input
              type="number"
              placeholder="Amount"
              className="w-full bg-[#0b1120] border border-slate-700 p-4 rounded-xl text-lg font-black mb-4 text-white"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
            <button
              onClick={handleReceivePayment}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl font-black"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Khata;
