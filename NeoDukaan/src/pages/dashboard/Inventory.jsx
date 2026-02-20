import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";

const Inventory = () => {
  const { items, setItems } = useOutletContext();

  //Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  //Editing state
  const [editingItemId, setEditingItemId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    stock: "",
    expiryDate: "",
    lowStockThreshold: 5,
  });

  //Search State
  const [search, setSearch] = useState("");

  //Filter Function
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  //Stats of low stock count
  const lowStockCount = items.filter(
    (item) => item.stock > 0 && item.stock <= item.lowStockThreshold,
  ).length;

  //Expiring Count
  const expiringSoonCount = items.filter((item) => {
    const today = new Date();
    const expiry = new Date(item.expiryDate);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }).length;

  //Total Inventory Value
  const totalInventoryValue = items.reduce(
    (total, item) => total + item.costPrice * item.stock,
    0,
  );

  //Form Handling
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //Editor Drawer
  const openEditDrawer = (item) => {
    setEditingItemId(item.id);
    setFormData(item);
    setIsDrawerOpen(true);
  };

  //Handle Save Item
  const handleSaveItem = () => {
    if (!formData.name || !formData.stock) {
      alert("Please fill required fields");
      return;
    }

    //Formatted Item
    const formattedItem = {
      ...formData,
      id: editingItemId ? editingItemId : Date.now(),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      stock: Number(formData.stock),
    };

    if (editingItemId) {
      setItems((prev) =>
        prev.map((item) => (item.id === editingItemId ? formattedItem : item)),
      );
    } else {
      setItems((prev) => [...prev, formattedItem]);
    }

    resetForm();
  };

  //Handle Delete
  const handleDelete = (id) => {
    if (window.confirm("Delete this item?")) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  //Reset Form
  const resetForm = () => {
    setEditingItemId(null);
    setIsDrawerOpen(false);
    setFormData({
      name: "",
      costPrice: "",
      sellingPrice: "",
      stock: "",
      expiryDate: "",
      lowStockThreshold: 5,
    });
  };

  return (
    <div className="text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-blue-600 px-5 py-2.5 rounded-lg"
        >
          + Add Item
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Items" value={items.length} />
        <StatCard title="Low Stock" value={lowStockCount} />
        <StatCard title="Expiring Soon" value={expiringSoonCount} />
        <StatCard title="Inventory Value" value={`₹${totalInventoryValue}`} />
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-6 p-3 bg-white/5 border border-white/10 rounded-lg"
      />

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 text-white/60">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map((item) => {
              const today = new Date();
              const expiry = new Date(item.expiryDate);
              const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

              return (
                <tr key={item.id} className="border-b border-white/10">
                  <td className="p-4">{item.name}</td>
                  <td className="p-4">{item.stock}</td>
                  <td className="p-4">
                    {item.expiryDate}
                    {diffDays < 0 && (
                      <p className="text-red-400 text-xs">Expired</p>
                    )}
                    {diffDays >= 0 && diffDays <= 7 && (
                      <p className="text-yellow-400 text-xs">Expiring Soon</p>
                    )}
                  </td>
                  <td className="p-4 space-x-3">
                    <button
                      onClick={() => openEditDrawer(item)}
                      className="text-blue-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* DRAWER */}
      {isDrawerOpen && (
        <div className="fixed top-0 right-0 h-full w-96 bg-[#111827] p-6 border-l border-white/10">
          <h2 className="text-xl mb-6">
            {editingItemId ? "Edit Item" : "Add Item"}
          </h2>

          <div className="space-y-4">
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            />
            <input
              name="costPrice"
              type="number"
              placeholder="Cost Price"
              value={formData.costPrice}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            />
            <input
              name="sellingPrice"
              type="number"
              placeholder="Selling Price"
              value={formData.sellingPrice}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            />
            <input
              name="stock"
              type="number"
              placeholder="Stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            />
            <input
              name="expiryDate"
              type="date"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-white/10 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 bg-blue-600 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
    <p className="text-sm text-white/60">{title}</p>
    <h3 className="text-xl font-semibold">{value}</h3>
  </div>
);

export default Inventory;
