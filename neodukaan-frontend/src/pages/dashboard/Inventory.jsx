import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUpDown,
  UploadCloud,
  AlertCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PackageSearch,
} from "lucide-react";

const Inventory = () => {
  const { items = [], setItems, sales = [] } = useOutletContext();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const [formData, setFormData] = useState({
    name: "",
    sellingPrice: "",
    unitType: "piece",
    lowStockThreshold: 5,
    taxPercent: 0,
    hsn: "",
    batchCostPrice: "",
    batchQuantity: "",
    batchExpiryDate: "",
  });

  /*HELPERS*/
  const getTotalStock = (item) =>
    item.batches?.reduce((sum, b) => sum + b.quantity, 0) || 0;

  const getNearestExpiry = (item) => {
    const batches =
      item.batches
        ?.filter((b) => b.expiryDate)
        .sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate)) || [];
    return batches[0]?.expiryDate || null;
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    const diffDays = (expiry - today) / (1000 * 60 * 60 * 24);

    if (diffDays <= 3) return "critical";
    if (diffDays <= 7) return "warning";
    return "safe";
  };

  const isDeadStock = (item) => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const soldRecently = sales.some((sale) =>
      sale.items.some(
        (saleItem) =>
          saleItem.id === item.id && new Date(sale.date) > last30Days,
      ),
    );
    return !soldRecently && getTotalStock(item) > 0;
  };

  /*SEARCH & SORT LOGIC*/
  let filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  if (sortBy === "low_stock") {
    filteredItems.sort((a, b) => getTotalStock(a) - getTotalStock(b));
  } else if (sortBy === "high_value") {
    filteredItems.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else {
    filteredItems.sort((a, b) => b.id - a.id); // recent
  }

  /*FORM HANDLERS*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setEditingItemId(null);
    setIsDrawerOpen(false);
    setFormData({
      name: "",
      sellingPrice: "",
      unitType: "piece",
      lowStockThreshold: 5,
      taxPercent: 0,
      hsn: "",
      batchCostPrice: "",
      batchQuantity: "",
      batchExpiryDate: "",
    });
  };

  const openEditDrawer = (item) => {
    setEditingItemId(item.id);
    setFormData({
      name: item.name,
      sellingPrice: item.sellingPrice,
      unitType: item.unitType,
      lowStockThreshold: item.lowStockThreshold,
      taxPercent: item.taxPercent || 0,
      hsn: item.hsn || "",
      batchCostPrice: "",
      batchQuantity: "",
      batchExpiryDate: "",
    });
    setIsDrawerOpen(true);
  };

  /*SAVE LOGIC*/
  const handleSaveItem = () => {
    if (!formData.name || !formData.sellingPrice) {
      toast.error("Name & Selling Price required");
      return;
    }

    const hasBatch =
      formData.batchCostPrice !== "" && formData.batchQuantity !== "";
    let newBatch = null;

    if (hasBatch) {
      const safeId =
        Date.now().toString(36) + Math.random().toString(36).substring(2);

      newBatch = {
        batchId: safeId,
        costPrice: Number(formData.batchCostPrice),
        quantity: Number(formData.batchQuantity),
        expiryDate: formData.batchExpiryDate || null,
        addedDate: new Date().toISOString(),
      };
    }

    const currentISO = new Date().toISOString();

    if (editingItemId) {
      setItems((prev) =>
        prev.map((product) => {
          if (product.id !== editingItemId) return product;
          return {
            ...product,
            name: formData.name,
            sellingPrice: Number(formData.sellingPrice),
            unitType: formData.unitType,
            lowStockThreshold: Number(formData.lowStockThreshold),
            taxPercent: Number(formData.taxPercent),
            hsn: formData.hsn,
            lastUpdated: currentISO,
            batches: newBatch
              ? [...product.batches, newBatch]
              : product.batches,
          };
        }),
      );
      toast.success("Item updated");
    } else {
      if (!newBatch) {
        toast.error("First batch required");
        return;
      }
      const newProduct = {
        id: Date.now(),
        name: formData.name,
        sellingPrice: Number(formData.sellingPrice),
        unitType: formData.unitType,
        lowStockThreshold: Number(formData.lowStockThreshold),
        taxPercent: Number(formData.taxPercent),
        hsn: formData.hsn,
        lastUpdated: currentISO,
        batches: [newBatch],
      };
      setItems((prev) => [...prev, newProduct]);
      toast.success("Item added");
    }
    resetForm();
  };

  const confirmDelete = () => {
    setItems((prev) => prev.filter((item) => item.id !== deleteId));
    setDeleteId(null);
    toast.success("Item deleted");
  };

  return (
    <div className="text-white space-y-6 bg-transparent min-h-dvh pb-24">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Inventory</h1>
          <p className="text-sm text-slate-400 font-medium mt-0.5">
            Manage your products and batches.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => toast.info("Bulk update coming soon!")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-800 transition-colors"
          >
            <UploadCloud size={16} />{" "}
            <span className="hidden sm:inline">Bulk Update</span>
          </button>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Add Item
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 order-2 sm:order-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search items by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-500 shadow-sm"
          />
        </div>

        <div className="relative order-1 sm:order-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-48 appearance-none pl-4 pr-10 py-2.5 bg-[#111827] border border-slate-800 rounded-xl text-sm font-bold text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors shadow-sm cursor-pointer"
          >
            <option value="recent">Recently Added</option>
            <option value="low_stock">Low Stock First</option>
            <option value="high_value">High Value First</option>
          </select>
          <ArrowUpDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={14}
          />
        </div>
      </div>

      {/* ITEMS LIST */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredItems.map((item) => {
          const stock = getTotalStock(item);
          const nearestExpiry = getNearestExpiry(item);
          const expiryStatus = getExpiryStatus(nearestExpiry);
          const dead = isDeadStock(item);

          let stockColor =
            "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
          let StockIcon = CheckCircle2;

          if (stock === 0) {
            stockColor = "text-rose-400 bg-rose-500/10 border-rose-500/20";
            StockIcon = AlertTriangle;
          } else if (stock <= item.lowStockThreshold) {
            stockColor = "text-amber-400 bg-amber-500/10 border-amber-500/20";
            StockIcon = AlertCircle;
          }

          return (
            <div
              key={item.id}
              className="p-4 sm:p-5 rounded-2xl bg-[#111827] border border-slate-800 shadow-sm flex flex-col justify-between transition-colors hover:border-indigo-500/50"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white truncate pr-2">
                    {item.name}
                  </h3>
                  <p className="font-black text-lg text-indigo-400">
                    ₹{item.sellingPrice}
                  </p>
                </div>

                <p className="text-xs text-slate-400 font-medium mb-3">
                  GST: {item.taxPercent || 0}% | HSN: {item.hsn || "-"}
                </p>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-md border ${stockColor}`}
                  >
                    <StockIcon size={12} /> Stock: {stock} {item.unitType}
                  </span>

                  {expiryStatus === "critical" && (
                    <span className="px-2 py-1 text-[10px] font-bold rounded bg-red-600 text-white shadow-sm">
                      Expiring Soon
                    </span>
                  )}
                  {expiryStatus === "warning" && (
                    <span className="px-2 py-1 text-[10px] font-bold rounded bg-amber-500 text-white shadow-sm">
                      Expiry Warning
                    </span>
                  )}
                  {dead && (
                    <span className="px-2 py-1 text-[10px] font-bold rounded bg-slate-600 text-white shadow-sm">
                      Dead Stock
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-end justify-between border-t border-slate-800/60 pt-4 mt-auto">
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <Clock size={12} />
                  Updated:{" "}
                  {item.lastUpdated
                    ? new Date(item.lastUpdated).toLocaleDateString("en-IN")
                    : "Today"}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => openEditDrawer(item)}
                    className="p-2 text-slate-400 hover:text-indigo-400 bg-slate-800 hover:bg-indigo-500/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteId(item.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredItems.length === 0 && (
          <div className="col-span-full py-16 text-center text-slate-500">
            <PackageSearch size={48} className="mx-auto mb-4 opacity-20" />
            <p className="font-semibold text-lg">No items found</p>
            <p className="text-sm">
              Try searching for something else or add a new item.
            </p>
          </div>
        )}
      </div>

      {/* DRAWER (Add/Edit) */}
      {isDrawerOpen && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 transition-opacity"
          />
          <div className="fixed top-0 right-0 h-dvh w-full sm:w-100 bg-[#0f172a] border-l border-slate-800 p-6 pb-24 z-50 overflow-y-auto shadow-2xl animate-in slide-in-from-right duration-300">
            <h2 className="text-2xl font-black text-white mb-6">
              {editingItemId ? "Edit Item" : "Add New Item"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  Product Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Aashirvaad Atta"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Selling Price
                  </label>
                  <input
                    name="sellingPrice"
                    type="number"
                    placeholder="₹ 0.00"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Unit Type
                  </label>
                  <select
                    name="unitType"
                    value={formData.unitType}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kg</option>
                    <option value="litre">Litre</option>
                    <option value="box">Box</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Low Stock Alert
                  </label>
                  <input
                    name="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    GST %
                  </label>
                  <select
                    name="taxPercent"
                    value={formData.taxPercent}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  >
                    <option value={0}>0%</option>
                    <option value={5}>5%</option>
                    <option value={12}>12%</option>
                    <option value={18}>18%</option>
                    <option value={28}>28%</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                  HSN Code
                </label>
                <input
                  name="hsn"
                  placeholder="e.g. 190590"
                  value={formData.hsn}
                  onChange={handleChange}
                  className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-600"
                />
              </div>

              <div className="border-t border-slate-800 pt-4 mt-2">
                <h3 className="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-widest">
                  Initial Batch Info
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                      Purchase Price
                    </label>
                    <input
                      name="batchCostPrice"
                      type="number"
                      placeholder="₹ 0.00"
                      value={formData.batchCostPrice}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                      Quantity Added
                    </label>
                    <input
                      name="batchQuantity"
                      type="number"
                      placeholder="0"
                      value={formData.batchQuantity}
                      onChange={handleChange}
                      className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                    Expiry Date (Optional)
                  </label>
                  <input
                    name="batchExpiryDate"
                    type="date"
                    value={formData.batchExpiryDate}
                    onChange={handleChange}
                    className="w-full p-3 bg-[#111827] border border-slate-800 rounded-xl font-medium focus:outline-none focus:border-indigo-500 transition-colors text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  onClick={resetForm}
                  className="flex-1 py-3.5 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveItem}
                  className="flex-1 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                >
                  Save Item
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <>
          <div
            onClick={() => setDeleteId(null)}
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 transition-opacity"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-[#111827] border border-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mb-4">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">
                Delete Item?
              </h3>
              <p className="text-slate-400 text-sm font-medium mb-6">
                This action cannot be undone. Are you sure you want to
                permanently delete this product?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Inventory;
