import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Briefcase,
  Search,
  DollarSign,
  TrendingUp,
  TrendingDown,
  User,
  PieChart,
  Filter,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function AdminUserInvestmentsPage() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [plFilter, setPlFilter] = useState('ALL');

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/admin/user-investments');
      if (res.data?.success) {
        setInvestments(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching user investments:', err);
      setError(err.response?.data?.message || 'Failed to load user investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  // Compute summary stats
  const totalInvested = investments.reduce((acc, curr) => acc + (curr.totalInvested || 0), 0);
  const totalCurrentValue = investments.reduce((acc, curr) => acc + (curr.currentValue || 0), 0);
  const totalPL = Math.round((totalCurrentValue - totalInvested) * 100) / 100;
  const totalPLPercent = totalInvested > 0 ? Math.round((totalPL / totalInvested) * 10000) / 100 : 0;

  // Sectors list
  const sectors = ['ALL', ...new Set(investments.map((inv) => inv.stock?.sector).filter(Boolean))];

  // Filtering logic
  const filteredInvestments = investments.filter((inv) => {
    const q = search.toLowerCase();
    const userName = inv.user?.name?.toLowerCase() || '';
    const userEmail = inv.user?.email?.toLowerCase() || '';
    const symbol = inv.symbol?.toLowerCase() || '';
    const stockName = inv.stock?.name?.toLowerCase() || '';

    const matchesSearch =
      userName.includes(q) || userEmail.includes(q) || symbol.includes(q) || stockName.includes(q);

    const matchesSector = sectorFilter === 'ALL' || inv.stock?.sector === sectorFilter;

    let matchesPL = true;
    if (plFilter === 'PROFIT') matchesPL = inv.profitLoss > 0;
    if (plFilter === 'LOSS') matchesPL = inv.profitLoss < 0;

    return matchesSearch && matchesSector && matchesPL;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black font-heading tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="text-cyan-400" size={28} /> User Holdings & Share Portfolio
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Monitor which users have bought which shares, current market values, and real-time loss/profit status.
          </p>
        </div>
        <button
          onClick={fetchInvestments}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh Holdings Data
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold">Total Share Positions</span>
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <Layers size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-3">{investments.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Active user holdings</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold">Total Capital Invested</span>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400">
              <DollarSign size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-3">${totalInvested.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">Cost basis across users</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold">Current Market Value</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              <PieChart size={18} />
            </div>
          </div>
          <p className="text-2xl font-black text-white font-mono mt-3">${totalCurrentValue.toLocaleString()}</p>
          <p className="text-[11px] text-slate-400 mt-1">Live market valuation</p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <span className="text-slate-400 text-xs font-semibold">Total User Profit/Loss</span>
            <div
              className={`p-2 rounded-xl ${
                totalPL >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}
            >
              {totalPL >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
          </div>
          <p
            className={`text-2xl font-black font-mono mt-3 ${
              totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {totalPL >= 0 ? `+$${totalPL.toLocaleString()}` : `-$${Math.abs(totalPL).toLocaleString()}`}
          </p>
          <p className={`text-[11px] font-mono mt-1 ${totalPL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {totalPL >= 0 ? '+' : ''}
            {totalPLPercent}% Net Return
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by user name, email, stock symbol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-slate-100 text-xs focus:outline-none focus:border-cyan-500 transition placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Sector:</span>
            <select
              value={sectorFilter}
              onChange={(e) => setSectorFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Status:</span>
            <select
              value={plFilter}
              onChange={(e) => setPlFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Return Statuses</option>
              <option value="PROFIT">In Profit (+)</option>
              <option value="LOSS">In Loss (-)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table / Data View */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-xs">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-[#0B1120] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <h2 className="text-sm font-bold font-heading text-white">
            User Share Holdings Directory ({filteredInvestments.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
            <RefreshCw size={24} className="animate-spin text-cyan-400" />
            <span>Loading live user holding data...</span>
          </div>
        ) : filteredInvestments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs space-y-2">
            <Briefcase size={32} className="mx-auto text-slate-600" />
            <p className="font-semibold text-slate-400">No user share holdings found</p>
            <p className="text-[11px]">
              No users match your criteria or no share purchases have been executed yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/60 text-slate-400 uppercase tracking-wider font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">User Details</th>
                  <th className="px-5 py-3.5">Share / Stock</th>
                  <th className="px-5 py-3.5">Quantity</th>
                  <th className="px-5 py-3.5">Avg Buy Price</th>
                  <th className="px-5 py-3.5">Live Price</th>
                  <th className="px-5 py-3.5">Total Cost</th>
                  <th className="px-5 py-3.5">Market Value</th>
                  <th className="px-5 py-3.5">Profit / Loss</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredInvestments.map((inv) => {
                  const isProfit = inv.profitLoss >= 0;
                  return (
                    <tr key={inv._id} className="hover:bg-slate-900/40 transition">
                      {/* User Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                            {inv.user?.name ? inv.user.name.charAt(0).toUpperCase() : 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-white text-xs">{inv.user?.name || 'Unknown User'}</p>
                            <p className="text-[11px] text-slate-400">{inv.user?.email || 'N/A'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Stock Column */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400 font-mono">
                            {inv.symbol}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">{inv.symbol}</span>
                              {inv.stock?.sector && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-800 text-slate-400 border border-slate-700 font-mono">
                                  {inv.stock.sector}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 truncate max-w-[140px]">
                              {inv.stock?.name || inv.symbol}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Quantity */}
                      <td className="px-5 py-4 font-mono font-semibold text-slate-200">
                        {inv.quantity.toLocaleString()}
                      </td>

                      {/* Avg Buy Price */}
                      <td className="px-5 py-4 font-mono text-slate-300">
                        ${inv.averageBuyPrice?.toFixed(2)}
                      </td>

                      {/* Live Market Price */}
                      <td className="px-5 py-4 font-mono font-semibold text-white">
                        ${inv.currentPrice?.toFixed(2)}
                      </td>

                      {/* Total Invested */}
                      <td className="px-5 py-4 font-mono text-slate-300">
                        ${inv.totalInvested?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Current Value */}
                      <td className="px-5 py-4 font-mono font-bold text-white">
                        ${inv.currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>

                      {/* Profit / Loss */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <div
                            className={`inline-flex items-center gap-1 font-mono font-extrabold text-xs ${
                              isProfit ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {isProfit ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>
                              {isProfit ? '+' : ''}${inv.profitLoss?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-mono ${
                              isProfit ? 'text-emerald-500/80' : 'text-red-500/80'
                            }`}
                          >
                            {isProfit ? '+' : ''}
                            {inv.profitLossPercentage}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
