import { useState, useRef, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  Search,
  ShoppingBag,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";

const UPI_ID = "8287035304@ptyes";

const POS = () => {
  const navigate = useNavigate();
  const {
    items,
    sales,
    setSales,
    shopProfile = {},
    customers,
    setCustomers,
  } = useOutletContext();
  const SHOP_NAME = shopProfile.name || "NeoDukaan";

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [payments, setPayments] = useState({ cash: "", upi: "", udhaar: "" });

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((c) => c.id === product.id);
    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.id === product.id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          id: product.id,
          name: product.name,
          sellingPrice: product.sellingPrice,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const grandTotal = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0,
  );
  const upiAmount = Number(payments.upi || 0);
  const upiLink =
    upiAmount > 0
      ? `upi://pay?pa=${UPI_ID}&pn=${SHOP_NAME}&am=${upiAmount}&cu=INR`
      : null;

  const handleCheckoutClick = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const cash = Number(payments.cash || 0);
    const upi = Number(payments.upi || 0);
    const udhaar = Number(payments.udhaar || 0);
    const totalPaid = cash + upi + udhaar;

    // Strict Validation
    if (Number(totalPaid.toFixed(2)) !== Number(grandTotal.toFixed(2))) {
      toast.error(
        `Payment mismatch! Split total must equal ₹${grandTotal.toFixed(2)}`,
      );
      return;
    }

    if (udhaar > 0 && (!customerPhone || customerPhone.trim().length < 10)) {
      toast.error("10-digit Phone number is mandatory for Udhaar!");
      return;
    }
    setShowConfirmModal(true);
  };

  const completeSale = () => {
    const cash = Number(payments.cash || 0);
    const upi = Number(payments.upi || 0);
    const udhaar = Number(payments.udhaar || 0);

    if (udhaar > 0) {
      const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
      const existingCustomerIndex = customers.findIndex(
        (c) => c.phone.replace(/\D/g, "").slice(-10) === cleanPhone,
      );
      const newLedgerEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: "debit",
        amount: udhaar,
      };

      if (existingCustomerIndex >= 0) {
        const updatedCustomers = [...customers];
        updatedCustomers[existingCustomerIndex].ledger.push(newLedgerEntry);
        setCustomers(updatedCustomers);
      } else {
        const newCustomer = {
          id: Date.now(),
          name: `Customer ${cleanPhone}`,
          phone: cleanPhone,
          ledger: [newLedgerEntry],
        };
        setCustomers([...customers, newCustomer]);
      }
    }

    const newSale = {
      id: Date.now(),
      invoiceNumber: `INV-${Date.now()}`,
      items: cart,
      totalAmount: grandTotal,
      payments: { cash, upi, udhaar },
      upiId: UPI_ID,
      customerPhone,
      date: new Date().toISOString(),
    };

    if (customerPhone && customerPhone.trim().length >= 10) {
      const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
      let msg = `🧾 *${SHOP_NAME} - Invoice*\n--------------------------------\n*Invoice No:* ${newSale.invoiceNumber}\n*Date:* ${new Date().toLocaleDateString("en-IN")}\n\n*Items Purchased:*\n`;
      cart.forEach((item, index) => {
        msg += `${index + 1}. ${item.name} (x${item.quantity}) - ₹${item.sellingPrice * item.quantity}\n`;
      });
      msg += `--------------------------------\n*Total Amount:* ₹${grandTotal.toFixed(2)}\n`;
      if (udhaar > 0) msg += `*Udhaar Added:* ₹${udhaar.toFixed(2)}\n`;
      msg += `--------------------------------\n\n🙏 Thank you for shopping with us!`;

      window.open(
        `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`,
        "_blank",
      );
    }

    setSales([...sales, newSale]);
    setCart([]);
    setPayments({ cash: "", upi: "", udhaar: "" });
    setCustomerPhone("");
    setShowConfirmModal(false);
    toast.success("Bill Generated Successfully!");
    navigate(`/dashboard/invoice/${newSale.id}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-white min-h-screen bg-transparent pb-20">
      {/* LEFT SIDE: Items Grid */}
      <div className="flex-1 space-y-4">
        <h2 className="text-2xl font-black tracking-tight">Point of Sale</h2>

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            ref={searchRef}
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors shadow-sm text-white"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {items
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="p-4 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all active:scale-95 flex flex-col justify-between h-28 shadow-sm"
              >
                <h3 className="font-bold text-sm line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                <p className="font-black text-indigo-400">
                  ₹{item.sellingPrice}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* RIGHT SIDE: Cart & Checkout */}
      <div className="w-full lg:w-100 bg-[#111827] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[calc(100vh-100px)] lg:sticky lg:top-20">
        <h2 className="text-xl font-black mb-4 border-b border-slate-800 pb-3">
          Current Cart{" "}
          <span className="text-indigo-400 text-sm bg-indigo-500/10 px-2 py-1 rounded ml-2">
            {cart.length}
          </span>
        </h2>

        <div className="flex-1 overflow-y-auto mb-4 space-y-3 pr-1">
          {cart.map((c) => (
            <div
              key={c.id}
              className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/50"
            >
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-bold truncate">{c.name}</p>
                <p className="text-xs text-indigo-400 font-black mt-0.5">
                  ₹{c.sellingPrice}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#0b1120] border border-slate-700 rounded-lg shadow-sm">
                  <button
                    onClick={() => decreaseQty(c.id)}
                    className="p-1.5 hover:bg-slate-700 rounded-l-lg text-slate-400"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold text-white">
                    {c.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(c.id)}
                    className="p-1.5 hover:bg-slate-700 rounded-r-lg text-slate-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(c.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
              <ShoppingBag size={48} className="mb-2" />
              <p className="text-sm font-medium">Cart is empty</p>
            </div>
          )}
        </div>

        {/* Totals & Payments */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4 bg-slate-800/50 p-3 rounded-xl">
            <span className="text-slate-400 font-bold uppercase text-xs">
              Grand Total
            </span>
            <span className="text-2xl font-black text-indigo-400">
              ₹{grandTotal.toFixed(2)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <input
              type="tel"
              placeholder="Customer Phone (Req for Udhaar)"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full p-3 bg-[#0b1120] border border-slate-700 rounded-xl text-sm font-medium focus:border-indigo-500 outline-none text-white"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Cash ₹"
                value={payments.cash}
                onChange={(e) =>
                  setPayments({ ...payments, cash: e.target.value })
                }
                className="w-full p-2.5 bg-[#0b1120] border border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 text-white"
              />
              <input
                type="number"
                placeholder="UPI ₹"
                value={payments.upi}
                onChange={(e) =>
                  setPayments({ ...payments, upi: e.target.value })
                }
                className="w-full p-2.5 bg-[#0b1120] border border-slate-700 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 text-white"
              />
              <input
                type="number"
                placeholder="Udhaar ₹"
                value={payments.udhaar}
                onChange={(e) =>
                  setPayments({ ...payments, udhaar: e.target.value })
                }
                className="w-full p-2.5 bg-[#0b1120] border border-rose-500/30 rounded-xl text-sm font-medium outline-none focus:border-rose-500 text-white"
              />
            </div>
          </div>

          {upiLink && (
            <div className="mb-4 flex flex-col items-center bg-white p-3 rounded-xl border-2 border-slate-700">
              <p className="text-slate-900 text-xs font-black mb-2 uppercase tracking-widest">
                Scan to Pay ₹{upiAmount}
              </p>
              <QRCodeSVG value={upiLink} size={100} />
            </div>
          )}

          <button
            onClick={handleCheckoutClick}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
          >
            Checkout
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 transition-opacity"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="bg-indigo-600 p-6 text-white text-center">
                <Receipt size={32} className="mx-auto mb-2 opacity-80" />
                <h3 className="text-xl font-black">Confirm Sale</h3>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Total Items:</span>
                    <span className="font-bold text-white">
                      {cart.reduce((s, c) => s + c.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-base">
                    <span className="text-slate-300 font-bold">
                      Grand Total:
                    </span>
                    <span className="text-indigo-400 font-black">
                      ₹{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">
                    Payment Breakdown
                  </h4>
                  {Number(payments.cash) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">Cash:</span>{" "}
                      <span className="font-bold text-white">
                        ₹{payments.cash}
                      </span>
                    </div>
                  )}
                  {Number(payments.upi) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">UPI:</span>{" "}
                      <span className="font-bold text-white">
                        ₹{payments.upi}
                      </span>
                    </div>
                  )}
                  {Number(payments.udhaar) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-rose-400 font-bold">Udhaar:</span>{" "}
                      <span className="font-bold text-rose-400">
                        ₹{payments.udhaar}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-slate-900/50 flex gap-3 border-t border-slate-800">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-3 text-slate-300 font-bold bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={completeSale}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <CheckCircle2 size={18} /> Confirm Bill
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default POS;
