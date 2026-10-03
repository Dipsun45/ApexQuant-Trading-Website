import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { TradeModal } from '../components/TradeModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Layers, ShieldAlert, PieChart as PieIcon, ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const PortfolioPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await API.get('/portfolio');
      if (res.data && res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load portfolio details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const holdings = data?.holdings || [];
  const sectorAlloc = data?.sectorAllocation || [];
  const analytics = data?.analytics || {};

  const COLORS = ['#2563EB', '#06B6D4', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#64748B'];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Portfolio Analytics</h1>
          <p className="text-slate-400 text-xs mt-1">Detailed breakdown of active equity positions & risk parameters</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Market Value</span>
          <span className="text-2xl font-extrabold text-white font-mono">
            ${(data?.totalPortfolioValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">Total Invested</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">
            ${(data?.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">Unrealized Return</span>
          <span className={`text-2xl font-extrabold font-mono ${(data?.totalProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(data?.totalProfitLoss || 0) >= 0 ? '+' : ''}${(data?.totalProfitLoss || 0).toLocaleString()}
          </span>
        </div>
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 font-medium block mb-1">Return Percentage</span>
          <span className={`text-2xl font-extrabold font-mono ${(data?.totalProfitLossPercentage || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(data?.totalProfitLossPercentage || 0) >= 0 ? '+' : ''}{(data?.totalProfitLossPercentage || 0).toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Pie Chart & Risk Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sector Allocation */}
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <PieIcon size={18} className="text-cyan-400" /> Sector Allocation
          </h3>
          {sectorAlloc.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No active positions to display allocation chart</div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorAlloc}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={50}
                    paddingAngle={4}
                  >
                    {sectorAlloc.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Market Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Risk Metrics */}
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
            <ShieldAlert size={18} className="text-amber-400" /> Portfolio Risk Metrics
          </h3>
          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Total Positions</span>
              <span className="text-white font-bold">{analytics.positionsCount || 0} Holdings</span>
            </div>
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Largest Concentration</span>
              <span className="text-cyan-400 font-bold">{analytics.largestHolding || 'None'}</span>
            </div>
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Cash Reserve Weight</span>
              <span className="text-emerald-400 font-bold">{analytics.cashPercentage || 100}% Cash</span>
            </div>
            <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
              <span className="text-slate-400">Equities Exposure Weight</span>
              <span className="text-blue-400 font-bold">{analytics.investedPercentage || 0}% Equities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Detailed Table */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        <h3 className="text-lg font-bold font-heading text-white">Equity Positions Breakdown</h3>

        {holdings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">No investments recorded in portfolio</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Avg Buy Price</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">Invested Value</th>
                  <th className="p-3">Current Value</th>
                  <th className="p-3">Return (P/L)</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {holdings.map((h) => {
                  const isPos = h.profitLoss >= 0;
                  return (
                    <tr key={h._id} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-slate-800 text-cyan-400 font-mono text-xs flex items-center justify-center">
                          {h.symbol.substring(0, 3)}
                        </div>
                        <div>
                          <p className="font-heading text-xs text-white">{h.stock?.name || h.symbol}</p>
                          <p className="text-[10px] text-slate-500">{h.symbol}</p>
                        </div>
                      </td>
                      <td className="p-3 text-slate-200">{h.quantity}</td>
                      <td className="p-3 text-slate-400">${h.averageBuyPrice?.toFixed(2)}</td>
                      <td className="p-3 text-white font-semibold">${h.currentPrice?.toFixed(2)}</td>
                      <td className="p-3 text-slate-400">${h.totalInvested?.toLocaleString()}</td>
                      <td className="p-3 text-cyan-400 font-semibold">${h.currentValue?.toLocaleString()}</td>
                      <td className={`p-3 font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}${h.profitLoss?.toFixed(2)} ({isPos ? '+' : ''}{h.profitLossPercentage?.toFixed(2)}%)
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setSelectedStock(h.stock || { _id: h.stock?._id, symbol: h.symbol, currentPrice: h.currentPrice, name: h.symbol })}
                          className="px-3 py-1 bg-blue-600/80 hover:bg-blue-500 text-white text-[11px] font-semibold rounded-lg transition"
                        >
                          Trade
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

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={fetchPortfolio}
        />
      )}
    </div>
  );
};
