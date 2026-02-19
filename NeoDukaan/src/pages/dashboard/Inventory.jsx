const Inventory = () => {
  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Inventory</h1>
        <button className="bg-blue-600 px-4 py-2 rounded-lg">+ Add Item</button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
        />
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="border-b border-white/10 text-white/60">
            <tr>
              <th className="p-4">Item</th>
              <th className="p-4">Cost</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Expiry</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-b border-white/10">
              <td className="p-4">Shampoo</td>
              <td className="p-4">₹120</td>
              <td className="p-4">₹150</td>
              <td className="p-4">25</td>
              <td className="p-4">12 Mar 2026</td>
              <td className="p-4 text-green-400">In Stock</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
