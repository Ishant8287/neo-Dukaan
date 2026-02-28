import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  MessageCircle,
  X,
  Search,
  FileText,
  UserPlus,
  Filter,
  Clock,
  AlertCircle,
} from "lucide-react";

const Khata = () => {
  const context = useOutletContext() || {};
  const { customers = [], setCustomers = () => {}, shopProfile = {} } = context;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "" });
  const [paymentCustomer, setPaymentCustomer] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const [search, setSearch] = useState("");
  const [filterDue, setFilterDue] = useState("all");

  /*CALCULATIONS & HELPERS*/
  const calculateDue = (ledger = []) => {
    return ledger.reduce((sum, entry) => {
      return entry.type === "debit" ? sum + entry.amount : sum - entry.amount;
    }, 0);
  };

  const getLastTxnDate = (ledger = []) => {
    if (!ledger || ledger.length === 0) return null;
    const sorted = [...ledger].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    return sorted[0].date;
  };

  const checkOverdue = (ledger = []) => {
    const due = calculateDue(ledger);
    if (due <= 0) return false;
    const lastDate = getLastTxnDate(ledger);
    if (!lastDate) return false;
    const diffDays = (new Date() - new Date(lastDate)) / (1000 * 60 * 60 * 24);
    return diffDays > 15;
  };

  /*WHATSAPP REMINDER*/
  const sendWhatsAppReminder = (customer, dueAmount) => {
    if (!customer.phone || customer.phone.length < 10) {
      toast.error("Invalid phone number for this customer");
      return;
    }

    const cleanPhone = customer.phone.replace(/\D/g, "").slice(-10);
    const shopName = shopProfile.name || "NeoDukaan";
    const upiId = shopProfile.upiId || "8287035304@ptyes";
    const upiLink = `upi://pay?pa=${upiId}&pn=${shopName}&am=${dueAmount}&cu=INR`;

    let msg = `Namaste *${customer.name}* 🙏,\n\n`;
    msg += `Aapka *${shopName}* par ₹${dueAmount} ka khata (Udhaar) baaki hai.\n\n`;
    msg += `Kripya is link par click karke apna payment poora karein:\n`;
    msg += `${upiLink}\n\n`;
    msg += `Dhanyawad!`;

    const encodedMsg = encodeURIComponent(msg);
    window.open(`https://wa.me/91${cleanPhone}?text=${encodedMsg}`, "_blank");
  };

  /*PER-CUSTOMER PDF*/
  const downloadCustomerStatement = (customer) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.setTextColor(55, 65, 81);
    doc.text(`Khata Statement`, 14, 20);

    doc.setFontSize(12);
    doc.text(`Customer: ${customer.name}`, 14, 30);
    doc.text(`Phone: ${customer.phone}`, 14, 36);
    doc.text(`Total Due: Rs. ${calculateDue(customer.ledger || [])}`, 14, 42);

    const rows = (customer.ledger || []).map((entry, index) => [
      index + 1,
      new Date(entry.date).toLocaleDateString("en-IN"),
      entry.type === "debit" ? "Udhaar Given" : "Payment Received",
      `Rs. ${entry.amount}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["#", "Date", "Description", "Amount"]],
      body: rows,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
    });

    doc.save(`${customer.name}_Statement.pdf`);
    toast.success("Statement Downloaded!");
  };

  /*CUSTOMER ACTIONS*/
  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Name & Phone required");
      return;
    }
    const exists = customers.some(
      (c) => c.phone.trim() === newCustomer.phone.trim(),
    );
    if (exists) {
      toast.error("Customer with this phone already exists");
      return;
    }
    const newEntry = {
      id: Date.now(),
      name: newCustomer.name.trim(),
      phone: newCustomer.phone.trim(),
      ledger: [],
    };
    setCustomers((prev) => [...prev, newEntry]);
    toast.success("Customer added");
    setNewCustomer({ name: "", phone: "" });
    setIsDrawerOpen(false);
  };

  const handleReceivePayment = () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Invalid amount");
      return;
    }
    const due = calculateDue(paymentCustomer.ledger);
    if (Number(paymentAmount) > due) {
      toast.error("Payment exceeds due amount");
      return;
    }
    setCustomers((prev) =>
      prev.map((cust) => {
        if (cust.id === paymentCustomer.id) {
          return {
            ...cust,
            ledger: [
              ...cust.ledger,
              {
                id: Date.now(),
                date: new Date().toISOString(),
                type: "credit",
                amount: Number(paymentAmount),
              },
            ],
          };
        }
        return cust;
      }),
    );
    toast.success("Payment recorded");
    setPaymentCustomer(null);
    setPaymentAmount("");
  };

  /*FILTERING*/
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const due = calculateDue(c.ledger);

    if (filterDue === "due") return matchesSearch && due > 0;
    if (filterDue === "cleared") return matchesSearch && due <= 0;
    return matchesSearch;
  });

  return (
    <div className="text-white space-y-6 bg-transparent min-h-screen pb-20">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Khata Book</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Manage customer dues and send reminders.
          </p>
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <UserPlus size={18} /> Add Customer
        </button>
      </div>

      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by name or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm font-medium text-white focus:outline-none focus:border-indigo-500 transition-colors shadow-sm"
          />
        </div>

        <div className="relative">
          <select
            value={filterDue}
            onChange={(e) => setFilterDue(e.target.value)}
            className="w-full sm:w-48 appearance-none pl-10 pr-10 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm font-bold text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="all">All Customers</option>
            <option value="due">Pending Dues</option>
            <option value="cleared">Cleared / Zero Due</option>
          </select>
          <Filter
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={16}
          />
        </div>
      </div>

      <div className="bg-[#111827] border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-medium">
            <UserPlus size={40} className="mx-auto mb-3 opacity-50" />
            No customers found. Add one to start tracking udhaar.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {filteredCustomers.map((c) => {
              const due = calculateDue(c.ledger);
              const lastTxn = getLastTxnDate(c.ledger);
              const isOverdue = checkOverdue(c.ledger);

              return (
                <div
                  key={c.id}
                  className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors"
                >
                  {/* Customer Info */}
                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 font-black items-center justify-center text-lg">
                      {c.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-100 text-base">
                        {c.name}
                      </h3>
                      <p className="text-slate-400 text-xs font-medium mt-0.5">
                        {c.phone}
                      </p>

                      {lastTxn && (
                        <p className="text-[10px] text-slate-500 font-medium mt-1 flex items-center gap-1">
                          <Clock size={10} /> Last txn:{" "}
                          {new Date(lastTxn).toLocaleDateString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Badges & Actions */}
                  <div className="flex flex-wrap lg:flex-nowrap items-center gap-3">
                    <div className="flex flex-col items-start lg:items-end mr-4">
                      <span
                        className={`px-2.5 py-1 rounded-md text-sm font-black border ${due > 0 ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"}`}
                      >
                        ₹{due}
                      </span>
                      {isOverdue && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-rose-500 mt-1">
                          <AlertCircle size={10} /> 15+ Days Overdue
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => downloadCustomerStatement(c)}
                      className="p-2 text-slate-400 bg-slate-800 hover:text-indigo-400 hover:bg-indigo-500/20 rounded-lg transition-colors"
                      title="Download Statement"
                    >
                      <FileText size={18} />
                    </button>

                    <button
                      disabled={due <= 0}
                      onClick={() => sendWhatsAppReminder(c, due)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${due > 0 ? "bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-[#25D366]/20" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </button>

                    <button
                      disabled={due <= 0}
                      onClick={() => setPaymentCustomer(c)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${due > 0 ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" : "bg-slate-800 text-slate-500 cursor-not-allowed"}`}
                    >
                      Receive Payment
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD CUSTOMER MODAL */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] border border-slate-800 p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-black text-white mb-6">
                New Customer
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Full Name
                  </label>
                  <input
                    placeholder="Ramesh Kumar"
                    className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white"
                    value={newCustomer.name}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">
                    Phone Number
                  </label>
                  <input
                    placeholder="9876543210"
                    type="tel"
                    className="w-full bg-[#0b1120] border border-slate-700 p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors text-white"
                    value={newCustomer.phone}
                    onChange={(e) =>
                      setNewCustomer({ ...newCustomer, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                onClick={handleAddCustomer}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-black transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                Save Customer
              </button>
            </div>
          </div>
        </>
      )}

      {/* RECEIVE PAYMENT MODAL */}
      {paymentCustomer && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setPaymentCustomer(null)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] border border-slate-800 p-6 sm:p-8 rounded-3xl w-full max-w-sm shadow-2xl relative animate-in zoom-in-95 duration-200">
              <button
                onClick={() => setPaymentCustomer(null)}
                className="absolute top-6 right-6 text-slate-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <h2 className="text-xl font-black text-white mb-2">
                Receive Payment
              </h2>
              <p className="text-slate-400 text-sm font-medium mb-6">
                From{" "}
                <span className="text-indigo-400 font-bold">
                  {paymentCustomer.name}
                </span>
              </p>

              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  ₹
                </span>
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full bg-[#0b1120] border border-slate-700 p-4 pl-10 rounded-xl text-lg font-black focus:outline-none focus:border-emerald-500 transition-colors text-white"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              <button
                onClick={handleReceivePayment}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-black transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Khata;
