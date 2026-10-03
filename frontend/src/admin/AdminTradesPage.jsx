import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Filter, Layers, Edit3, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminTradesPage = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Edit Modal State
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeStatus, setTradeStatus] = useState('OPEN');
  const [profitLoss, setProfitLoss] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchTrades = async () => {
    setLoading(true);
    try {
      let url = `/admin/trades?page=${page}&limit=15&search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;
      if (typeFilter !== 'ALL') url += `&type=${typeFilter}`;

      const res = await API.get(url);
      if (res.data && res.data.success) {
        setTrades(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load trade log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrades();
  }, [search, statusFilter, typeFilter, page]);

  const handleOpenEdit = (t) => {
    setSelectedTrade(t);
    setTradeStatus(t.status);
    setProfitLoss(t.profitLoss || 0);
    setCurrentPrice(t.currentPrice || t.entryPrice);
    setModalOpen(true);
  };

  const handleUpdateTrade = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put(`/admin/trades/${selectedTrade._id}`, {
        status: tradeStatus,
        currentPrice: parseFloat(currentPrice),
        profitLoss: parseFloat(profitLoss),
      });

      if (res.data && res.data.success) {
        toast.success(`Trade ${selectedTrade.tradeId} updated`);
        setModalOpen(false);
        fetchTrades();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update trade');
    }
  };

  const getStatusBadge = (st) => {
    switch (st) {
      case 'PROFIT':
        return <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold rounded">PROFIT</span>;
      case 'LOSS':
        return <span className="px-2 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-bold rounded">LOSS</span>;
      case 'OPEN':
        return <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded">OPEN</span>;
      case 'PENDING':
        return <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold rounded">PENDING</span>;
      case 'CLOSED':
        return <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-bold rounded">CLOSED</span>;
      default:
        return <span className="px-2 py-0.5 bg-red-950 text-red-300 text-[10px] font-bold rounded">{st}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Trade Orders Management</h1>
        <p className="text-slate-400 text-xs mt-1">Review all user position orders, adjust execution prices, and validate P/L status</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Trade ID or symbol..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
          >
            <option value="ALL" className="bg-slate-900">All Order Statuses</option>
            <option value="OPEN" className="bg-slate-900">OPEN Positions</option>
            <option value="PROFIT" className="bg-slate-900">PROFIT Positions</option>
            <option value="LOSS" className="bg-slate-900">LOSS Positions</option>
            <option value="PENDING" className="bg-slate-900">PENDING Orders</option>
            <option value="CLOSED" className="bg-slate-900">CLOSED Orders</option>
          </select>
        </div>

        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
          >
            <option value="ALL" className="bg-slate-900">All Order Types (BUY & SELL)</option>
            <option value="BUY" className="bg-slate-900">BUY Orders</option>
            <option value="SELL" className="bg-slate-900">SELL Orders</option>
          </select>
        </div>
      </div>

      {/* Trades Table */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading trade records...</div>
        ) : trades.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No trades found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Trade ID</th>
                  <th className="p-3">Trader</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Entry Price</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">P/L ($)</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {trades.map((t) => {
                  const isPos = (t.profitLoss || 0) >= 0;
                  return (
                    <tr key={t._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-bold text-cyan-400 text-[11px]">{t.tradeId}</td>
                      <td className="p-3 text-white font-heading">{t.user?.name || 'User'}</td>
                      <td className="p-3 font-bold text-white">{t.symbol}</td>
                      <td className="p-3">
                        <span className={`font-bold ${t.type === 'BUY' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="p-3 text-slate-200">{t.quantity}</td>
                      <td className="p-3 text-slate-400">${t.entryPrice?.toFixed(2)}</td>
                      <td className="p-3 text-white font-semibold">${t.currentPrice?.toFixed(2)}</td>
                      <td className={`p-3 font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}${t.profitLoss?.toFixed(2)}
                      </td>
                      <td className="p-3">{getStatusBadge(t.status)}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
                        >
                          <Edit3 size={14} />
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

      {/* Trade Edit Modal */}
      {modalOpen && selectedTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 glass-panel">
            <h3 className="text-lg font-bold font-heading text-white">Edit Trade — {selectedTrade.tradeId}</h3>

            <form onSubmit={handleUpdateTrade} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Trade Status</label>
                <select
                  value={tradeStatus}
                  onChange={(e) => setTradeStatus(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                >
                  <option value="OPEN" className="bg-slate-900">OPEN</option>
                  <option value="PROFIT" className="bg-slate-900">PROFIT</option>
                  <option value="LOSS" className="bg-slate-900">LOSS</option>
                  <option value="CLOSED" className="bg-slate-900">CLOSED</option>
                  <option value="PENDING" className="bg-slate-900">PENDING</option>
                  <option value="CANCELLED" className="bg-slate-900">CANCELLED</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Current Execution Price ($)</label>
                <input
                  type="number"
                  step="any"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Recorded Profit / Loss ($)</label>
                <input
                  type="number"
                  step="any"
                  value={profitLoss}
                  onChange={(e) => setProfitLoss(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                  required
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
                  Save Trade Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
