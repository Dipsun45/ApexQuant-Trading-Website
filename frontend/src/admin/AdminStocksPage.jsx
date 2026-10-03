import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Plus, Edit2, Trash2, TrendingUp, AlertTriangle, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminStocksPage = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    sector: 'Technology',
    currentPrice: '',
    openPrice: '',
    marketStatus: 'OPEN',
    description: '',
  });

  const fetchStocks = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/stocks?limit=100&search=${encodeURIComponent(search)}`);
      if (res.data && res.data.success) {
        setStocks(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load stocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [search]);

  const handleOpenAdd = () => {
    setEditingStock(null);
    setForm({
      name: '',
      symbol: '',
      sector: 'Technology',
      currentPrice: '',
      openPrice: '',
      marketStatus: 'OPEN',
      description: '',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (stock) => {
    setEditingStock(stock);
    setForm({
      name: stock.name,
      symbol: stock.symbol,
      sector: stock.sector,
      currentPrice: stock.currentPrice,
      openPrice: stock.openPrice,
      marketStatus: stock.marketStatus || 'OPEN',
      description: stock.description || '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (stockId, symbol) => {
    if (!window.confirm(`Are you sure you want to delete ${symbol}?`)) return;

    try {
      const res = await API.delete(`/stocks/${stockId}`);
      if (res.data && res.data.success) {
        toast.success(`Deleted stock ${symbol}`);
        setStocks((prev) => prev.filter((s) => s._id !== stockId));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete stock');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStock) {
        const res = await API.put(`/stocks/${editingStock._id}`, form);
        if (res.data && res.data.success) {
          toast.success(`Stock ${form.symbol} updated`);
          setModalOpen(false);
          fetchStocks();
        }
      } else {
        const res = await API.post('/stocks', form);
        if (res.data && res.data.success) {
          toast.success(`Stock ${form.symbol} created`);
          setModalOpen(false);
          fetchStocks();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Stock Directory Management</h1>
          <p className="text-slate-400 text-xs mt-1">Add, modify pricing parameters, and configure active trading equities</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg transition"
        >
          <Plus size={16} /> Add New Stock
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by company name or symbol..."
          className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
        />
      </div>

      {/* Table */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading stock database...</div>
        ) : stocks.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No stocks found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Company & Symbol</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">Daily Change</th>
                  <th className="p-3">Market Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {stocks.map((s) => {
                  const isPos = s.dailyChange >= 0;
                  return (
                    <tr key={s._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 font-mono font-bold text-xs text-cyan-400 flex items-center justify-center">
                          {s.symbol.substring(0, 3)}
                        </div>
                        <div>
                          <p className="font-heading text-xs text-white">{s.name}</p>
                          <p className="text-[10px] text-cyan-400">{s.symbol}</p>
                        </div>
                      </td>
                      <td className="p-3 text-slate-400">{s.sector}</td>
                      <td className="p-3 font-bold text-white">${s.currentPrice?.toFixed(2)}</td>
                      <td className={`p-3 font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}${s.dailyChange?.toFixed(2)} ({isPos ? '+' : ''}{s.dailyChangePercent?.toFixed(2)}%)
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            s.marketStatus === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {s.marketStatus}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                          title="Edit Stock"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(s._id, s.symbol)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 transition"
                          title="Delete Stock"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-4 glass-panel relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold font-heading text-white">
                {editingStock ? `Edit Stock — ${editingStock.symbol}` : 'Add New Equity Stock'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Symbol (Ticker)</label>
                  <input
                    type="text"
                    value={form.symbol}
                    onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs uppercase font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Sector</label>
                  <input
                    type="text"
                    value={form.sector}
                    onChange={(e) => setForm({ ...form, sector: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Market Status</label>
                  <select
                    value={form.marketStatus}
                    onChange={(e) => setForm({ ...form, marketStatus: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  >
                    <option value="OPEN" className="bg-slate-900">OPEN</option>
                    <option value="HALTED" className="bg-slate-900">HALTED</option>
                    <option value="CLOSED" className="bg-slate-900">CLOSED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Price ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.currentPrice}
                    onChange={(e) => setForm({ ...form, currentPrice: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Open Price ($)</label>
                  <input
                    type="number"
                    step="any"
                    value={form.openPrice}
                    onChange={(e) => setForm({ ...form, openPrice: e.target.value })}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
