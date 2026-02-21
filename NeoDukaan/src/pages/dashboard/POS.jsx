import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Trash2 } from "lucide-react";

const POS = () => {
  //Getting state from dashboard layout
  const { items, setItems, sales, setSales } = useOutletContext();

  //Cart State
  const [cart, setCart] = useState([]);

  //Add to Cart
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
          costPrice: item.costPrice,
        },
      ]);
    }
  };

  //Delete from cart
  const deleteFromCart = (id) => {
    setCart((prev) => {
      return prev
        .map((cartItem) => {
          if (cartItem.id === id) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
          }
          return cartItem;
        })
        .filter((cartItem) => cartItem.quantity > 0);
    });
  };

  //Increase Qty
  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((cartItem) => {
        const stockItem = items.find((i) => i.id === id);

        if (cartItem.id === id) {
          if (cartItem.quantity >= stockItem.stock) return cartItem;
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }

        return cartItem;
      }),
    );
  };

  //handle Checkout
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    //Calculating profit
    const calculateProfit = cart.reduce(
      (profit, item) =>
        (profit += (item.sellingPrice - item.costPrice) * item.quantity),
      0,
    );

    const total = cart.reduce(
      (sum, item) => sum + item.sellingPrice * item.quantity,
      0,
    );

    //Create a sale Object
    const newSale = {
      id: Date.now(),
      items: cart,
      totalAmount: total,
      totalProfit: calculateProfit,
      date: new Date().toISOString(),
    };

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
    setSales((prev) => [...prev, newSale]);
    console.log(newSale);
    setCart([]);
  };

  const total = cart.reduce(
    (sum, item) => sum + item.sellingPrice * item.quantity,
    0,
  );

  //Completely Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((cardItem) => cardItem.id != id));
  };
  console.log("Current Sales:", sales);
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
            <div className="flex gap-3 items-center">
              <span>₹{c.sellingPrice * c.quantity}</span>
              <div className="w-18 bg-red-500 h-6 rounded-4xl flex justify-around items-center">
                <button onClick={() => deleteFromCart(c.id)}>-</button>

                <button onClick={() => removeFromCart(c.id)}>
                  <Trash2 size={16} />
                </button>

                <button
                  onClick={() => increaseQty(c.id)}
                  disabled={
                    c.quantity >= items.find((i) => i.id === c.id)?.stock
                  }
                  className="disabled:opacity-40"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        <hr className="my-4 border-white/10" />

        <div className="flex justify-between mb-4 font-semibold">
          <span>Total</span>
          <span>₹{total}</span>
        </div>

        <button
          onClick={() => {
            console.log("Checkout clicked");
            handleCheckout();
          }}
          className="w-full bg-green-600 py-2 rounded"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default POS;
