/* eslint-disable no-unused-vars */
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
import API from "../../api/axiosInstance";

const UPI_ID = "8287035304@ptyes";

const POS = () => {
  const navigate = useNavigate();
  const {
    items,
    setSales,
    shopProfile = {},
    customers,
    setCustomers,
  } = useOutletContext();

  const SHOP_NAME = shopProfile.shopName || shopProfile.name || "NeoDukaan";

  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [payments, setPayments] = useState({ cash: "", upi: "", udhaar: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const addToCart = (product) => {
    const existing = cart.find((c) => c.itemId === product._id);
    if (existing) {
      setCart((prev) =>
        prev.map((c) =>
          c.itemId === product._id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart((prev) => [
        ...prev,
        {
          itemId: product._id,
          batchId: product.batches?.[0]?._id,
          name: product.name,
          sellingPrice:
            product.batches?.[0]?.sellingPrice || product.sellingPrice,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQty = (id) =>
    setCart((prev) =>
      prev.map((item) =>
        item.itemId === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  const decreaseQty = (id) =>
    setCart((prev) =>
      prev
        .map((item) =>
          item.itemId === id ? { ...item, quantity: item.quantity - 1 } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  const removeFromCart = (id) =>
    setCart((prev) => prev.filter((item) => item.itemId !== id));

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
    if (cart.length === 0) return toast.error("Cart is empty");

    const cash = Number(payments.cash || 0);
    const upi = Number(payments.upi || 0);
    const udhaar = Number(payments.udhaar || 0);
    const totalPaid = cash + upi + udhaar;

    if (Number(totalPaid.toFixed(2)) !== Number(grandTotal.toFixed(2))) {
      return toast.error(`Total must equal ₹${grandTotal.toFixed(2)}`);
    }
    if (udhaar > 0 && (!customerPhone || customerPhone.trim().length < 10)) {
      return toast.error("10-digit Phone is mandatory for Udhaar!");
    }
    setShowConfirmModal(true);
  };

  const completeSale = async () => {
    setIsSubmitting(true);
    const cash = Number(payments.cash || 0);
    const upi = Number(payments.upi || 0);
    const udhaar = Number(payments.udhaar || 0);

    let customerId = null;

    // 🚀 CUSTOMER LOGIC
    if (customerPhone) {
      const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
      const existing = customers.find((c) => c.phone.includes(cleanPhone));

      if (existing) {
        customerId = existing._id;
      } else {
        try {
          const newCustRes = await API.post("/customers", {
            name: `Walk-in ${cleanPhone}`,
            phone: cleanPhone,
          });
          customerId = newCustRes.data.data._id;
          setCustomers((prev) => [...prev, newCustRes.data.data]);
        } catch (err) {
          toast.error("Error registering customer");
          setIsSubmitting(false);
          return;
        }
      }
    }

    // 🚀 PROFIT MATH: Calculate Total Purchase Price for Backend
    const totalPurchasePrice = cart.reduce((sum, item) => {
      const itemData = items.find((i) => i._id === item.itemId);
      const batch = itemData?.batches?.find((b) => b._id === item.batchId);
      const cost = batch?.purchasePrice || 0;
      return sum + cost * item.quantity;
    }, 0);

    const salePayload = {
      shop: shopProfile._id, // Required for Auth
      items: cart.map((i) => {
        const itemData = items.find((it) => it._id === i.itemId);
        const batch = itemData?.batches?.find((b) => b._id === i.batchId);
        return {
          itemId: i.itemId,
          batchId: i.batchId,
          quantity: i.quantity,
          sellingPrice: i.sellingPrice,
          purchasePrice: batch?.purchasePrice || 0, // 👈 Required field
        };
      }),
      totalAmount: grandTotal,
      totalPurchasePrice: totalPurchasePrice, // 👈 Required field
      paymentSplit: { cash, upi, udhaar },
      customer: customerId,
    };

    try {
      const res = await API.post("/sales", salePayload);
      const savedSale = res.data.data;

      // 1. Sale State Update
      setSales((prev) => [...prev, savedSale]);

      // 🚀 2. LEAD DEV MAGIC: Instant Khata Update (Optimistic UI)
      if (udhaar > 0 && customerId) {
        setCustomers((prevCustomers) =>
          prevCustomers.map((c) =>
            c._id === customerId
              ? { ...c, totalUdhaar: (c.totalUdhaar || 0) + udhaar }
              : c,
          ),
        );
      }

      // WhatsApp Invoice
      if (customerPhone && customerPhone.trim().length >= 10) {
        const cleanPhone = customerPhone.replace(/\D/g, "").slice(-10);
        let msg = `🧾 *${SHOP_NAME}*\nTotal: ₹${grandTotal.toFixed(2)}\nUdhaar: ₹${udhaar.toFixed(2)}\n🙏 Thanks!`;
        window.open(
          `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`,
          "_blank",
        );
      }

      setCart([]);
      setPayments({ cash: "", upi: "", udhaar: "" });
      setCustomerPhone("");
      setShowConfirmModal(false);
      toast.success("Bill Generated! 🚀");
      navigate(`/dashboard/invoice/${savedSale._id}`);
    } catch (error) {
      console.error("Payload Error:", error.response?.data);
      toast.error(error.response?.data?.message || "Sale failed!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 text-white min-h-screen bg-transparent pb-20">
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
            className="w-full pl-11 pr-4 py-3 bg-[#111827] border border-slate-800 rounded-xl text-white outline-none focus:border-indigo-500"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {items
            .filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            )
            .map((item) => (
              <div
                key={item._id}
                onClick={() => addToCart(item)}
                className="p-4 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500 cursor-pointer active:scale-95 flex flex-col justify-between h-28 shadow-sm"
              >
                <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                <p className="font-black text-indigo-400">
                  ₹{item.batches?.[0]?.sellingPrice || item.sellingPrice}
                </p>
              </div>
            ))}
        </div>
      </div>

      <div className="w-full lg:w-100 bg-[#111827] border border-slate-800 rounded-3xl p-5 flex flex-col h-[calc(100vh-100px)] lg:sticky lg:top-20 shadow-xl">
        <h2 className="text-xl font-black mb-4 border-b border-slate-800 pb-3">
          Cart{" "}
          <span className="text-indigo-400 text-sm bg-indigo-500/10 px-2 py-1 rounded ml-2">
            {cart.length}
          </span>
        </h2>
        <div className="flex-1 overflow-y-auto mb-4 space-y-3">
          {cart.map((c) => (
            <div
              key={c.itemId}
              className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-slate-700/50"
            >
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-sm font-bold truncate">{c.name}</p>
                <p className="text-xs text-indigo-400 font-black">
                  ₹{c.sellingPrice}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#0b1120] border border-slate-700 rounded-lg">
                  <button
                    onClick={() => decreaseQty(c.itemId)}
                    className="p-1.5 text-slate-400"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-bold">
                    {c.quantity}
                  </span>
                  <button
                    onClick={() => increaseQty(c.itemId)}
                    className="p-1.5 text-slate-400"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(c.itemId)}
                  className="p-1.5 text-rose-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center mb-4 bg-slate-800/50 p-3 rounded-xl">
            <span className="text-slate-400 font-bold uppercase text-xs">
              Total
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
              className="w-full p-3 bg-[#0b1120] border border-slate-700 rounded-xl text-white outline-none focus:border-indigo-500"
            />
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Cash"
                value={payments.cash}
                onChange={(e) =>
                  setPayments({ ...payments, cash: e.target.value })
                }
                className="p-2.5 bg-[#0b1120] border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
              <input
                type="number"
                placeholder="UPI"
                value={payments.upi}
                onChange={(e) =>
                  setPayments({ ...payments, upi: e.target.value })
                }
                className="p-2.5 bg-[#0b1120] border border-slate-700 rounded-xl text-white text-sm outline-none"
              />
              <input
                type="number"
                placeholder="Udhaar"
                value={payments.udhaar}
                onChange={(e) =>
                  setPayments({ ...payments, udhaar: e.target.value })
                }
                className="p-2.5 bg-[#0b1120] border border-rose-500/30 rounded-xl text-white text-sm outline-none"
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
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black transition-all"
          >
            Checkout
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="bg-[#111827] border border-slate-800 rounded-3xl w-full max-w-sm shadow-2xl relative overflow-hidden animate-in zoom-in-95">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <Receipt size={32} className="mx-auto mb-2 opacity-80" />
              <h3 className="text-xl font-black">Confirm Bill</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-base">
                <span className="text-slate-300 font-bold">Total Payable:</span>
                <span className="text-indigo-400 font-black">
                  ₹{grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="p-4 bg-slate-900/50 flex gap-3 border-t border-slate-800">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 text-slate-300 font-bold bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={completeSale}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-emerald-600 text-white font-bold rounded-xl"
              >
                {isSubmitting ? "Wait..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
