import { useState } from "react";
import { useOutletContext } from "react-router-dom";

const POS = () => {
  const { items, setItems } = useOutletContext();
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      if (existing.quantity >= item.stock) {
        alert("Not enough stock");
        return;
      }

      setCart((prev) =>
        prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      if (item.stock === 0) {
        alert("Out of stock");
        return;
      }

      setCart((prev) => [
        ...prev,
        {
          id: item.id,
          name: item.name,
          sellingPrice: item.sellingPrice,
          quantity: 1,
        },
      ]);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        const cartItem = cart.find((c) => c.id === item.id);

        if (!cartItem) return item;

        return {
          ...item,
          stock: item.stock - cartItem.quantity,
          lastSoldDate: new Date().toISOString().split("T")[0],
        };
      }),
    );

    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0,
  );

  return (
    <div className="flex gap-6 text-white">
      {/* LEFT SIDE - ITEMS */}
      <div className="flex-1">
        <h2 className="text-xl mb-4">Items</h2>

        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-white/5 border border-white/10 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-white/60">Stock: {item.stock}</p>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="bg-blue-600 px-4 py-1 rounded"
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE - CART */}
      <div className="w-80 bg-white/5 border border-white/10 rounded-lg p-4">
        <h2 className="text-xl mb-4">Cart</h2>

        {cart.map((c) => (
          <div key={c.id} className="flex justify-between mb-2">
            <span>
              {c.name} x {c.quantity}
            </span>
            <span>₹{c.sellingPrice * c.quantity}</span>
          </div>
        ))}

        <hr className="my-4 border-white/10" />

        <div className="flex justify-between mb-4 font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-green-600 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default POS;
