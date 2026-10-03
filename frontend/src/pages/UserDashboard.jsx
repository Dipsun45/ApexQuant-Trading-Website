import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StockCard } from '../components/StockCard';
import { TradeModal } from '../components/TradeModal';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  Clock,
  ArrowUpRight,
  Plus,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export const UserDashboard = () => {
  const { user, socket } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [portRes, tradeRes, stockRes] = await Promise.all([
        API.get('/portfolio'),
        API.get('/trades/my-trades?limit=5'),
        API.get('/stocks?limit=4&sortBy=change_desc'),
      ]);

      if (portRes.data?.success) setPortfolio(portRes.data.data);
      if (tradeRes.data?.success) setRecentTrades(tradeRes.data.data);
      if (stockRes.data?.success) setTopMovers(stockRes.data.data);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Listen to live updates from socket
  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      fetchDashboardData();
    };
    socket.on('trade_executed', handleUpdate);
    socket.on('trade_updated', handleUpdate);
    socket.on('market_update', handleUpdate);

    return () => {
      socket.off('trade_executed', handleUpdate);
      socket.off('trade_updated', handleUpdate);
      socket.off('market_update', handleUpdate);
    };
  }, [socket]);

  // Synthetic portfolio performance graph generator based on actual portfolio value
  const chartData = [
    { name: 'Mon', value: (portfolio?.totalPortfolioValue || 100000) * 0.96 },
    { name: 'Tue', value: (portfolio?.totalPortfolioValue || 100000) * 0.975 },
    { name: 'Wed', value: (portfolio?.totalPortfolioValue || 100000) * 0.99 },
    { name: 'Thu', value: (portfolio?.totalPortfolioValue || 100000) * 0.985 },
    { name: 'Fri', value: (portfolio?.totalPortfolioValue || 100000) * 1.01 },
    { name: 'Sat', value: (portfolio?.totalPortfolioValue || 100000) * 1.005 },
    { name: 'Today', value: portfolio?.totalPortfolioValue || 100000 },
  ];

  const holdings = portfolio?.holdings || [];
  const isTotalPos = (portfolio?.totalProfitLoss || 0) >= 0;
  const isTodayPos = (portfolio?.todaysProfitLoss || 0) >= 0;

  return (
    <div className="space-y-8">
      {/* Top Banner & Quick Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-heading text-white">
            Welcome back, <span className="gradient-text">{user?.name}</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1 font-mono">
            ApexQuant Terminal • Account ID: {user?._id?.substring(0, 10)}...
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/portfolio"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            <PieIcon size={14} /> Full Portfolio
          </Link>
          <Link
            to="/markets"
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-blue-500/20"
          >
            <Plus size={14} /> New Trade
          </Link>
        </div>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Portfolio Value */}
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Portfolio Value</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Wallet size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white font-mono">
            ${(portfolio?.totalPortfolioValue || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-mono block">Cash + Equities</span>
        </div>

        {/* Available Cash Balance */}
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Available Cash</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-emerald-400 font-mono">
            ${(portfolio?.balance || user?.balance || 100000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-mono block">Ready for trades</span>
        </div>

        {/* Total Invested */}
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Invested</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Layers size={16} />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-cyan-400 font-mono">
            ${(portfolio?.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-mono block">{holdings.length} Active Positions</span>
        </div>

        {/* Total Profit / Loss */}
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Return (P/L)</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isTotalPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              {isTotalPos ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            </div>
          </div>
          <p className={`text-2xl font-extrabold font-mono ${isTotalPos ? 'text-emerald-400' : 'text-red-400'}`}>
            {isTotalPos ? '+' : ''}${(portfolio?.totalProfitLoss || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className={`text-[11px] font-mono font-semibold ${isTotalPos ? 'text-emerald-400' : 'text-red-400'}`}>
            {isTotalPos ? '+' : ''}{(portfolio?.totalProfitLossPercentage || 0).toFixed(2)}% Return
          </span>
        </div>

        {/* Today's P/L */}
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Today's P/L</span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${isTodayPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
              <Clock size={16} />
            </div>
          </div>
          <p className={`text-2xl font-extrabold font-mono ${isTodayPos ? 'text-emerald-400' : 'text-red-400'}`}>
            {isTodayPos ? '+' : ''}${(portfolio?.todaysProfitLoss || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
          <span className="text-[11px] text-slate-400 font-mono block">Intraday change</span>
        </div>
      </div>

      {/* CHART & POSITIONS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-heading text-white">Portfolio Valuation</h3>
              <p className="text-xs text-slate-400">7-Day performance growth curve</p>
            </div>
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-mono rounded-full border border-blue-500/20">
              Live Chart
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`$${Number(val).toLocaleString()}`, 'Value']}
                />
                <Area type="monotone" dataKey="value" stroke="#38BDF8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Market Gainers Preview (1 col) */}
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading text-white">Top Gainers</h3>
              <Link to="/markets" className="text-xs text-cyan-400 hover:underline">View All</Link>
            </div>
            <div className="space-y-3">
              {topMovers.slice(0, 4).map((s) => (
                <div
                  key={s._id}
                  onClick={() => setSelectedStock(s)}
                  className="p-3 bg-slate-900/60 hover:bg-slate-800/80 rounded-xl border border-slate-800/80 flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 font-mono font-bold text-xs text-cyan-400 flex items-center justify-center">
                      {s.symbol.substring(0, 3)}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-heading">{s.symbol}</p>
                      <p className="text-[10px] text-slate-400">${s.currentPrice?.toFixed(2)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    +{s.dailyChangePercent?.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/markets"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl text-center block transition"
          >
            Explore Market Opportunities →
          </Link>
        </div>
      </div>

      {/* OPEN POSITIONS TABLE */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-white">Active Holdings</h3>
            <p className="text-xs text-slate-400">Current positions in your portfolio</p>
          </div>
          <Link
            to="/dashboard/portfolio"
            className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            Detailed Analytics <ArrowRight size={14} />
          </Link>
        </div>

        {holdings.length === 0 ? (
          <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
            <Layers className="text-slate-500 mx-auto" size={36} />
            <h4 className="text-base font-bold text-white">No active investments yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Explore the 30 available market stocks and place your first trade with your $100,000 demo balance.
            </p>
            <Link
              to="/markets"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
            >
              Explore Markets Now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Avg Buy Price</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3">Current Value</th>
                  <th className="p-3">Profit / Loss</th>
                  <th className="p-3 text-right">Action</th>
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
                      <td className="p-3 font-semibold text-slate-200">{h.quantity} shares</td>
                      <td className="p-3 text-slate-400">${h.averageBuyPrice?.toFixed(2)}</td>
                      <td className="p-3 text-white font-semibold">${h.currentPrice?.toFixed(2)}</td>
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

      {/* Trade Modal */}
      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};
