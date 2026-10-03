import React, { useState, useEffect } from 'react';
import API from '../services/api';
import {
  Users,
  TrendingUp,
  Layers,
  DollarSign,
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  PieChart as PieIcon,
  BarChart2,
  Activity,
  RefreshCw,
  Zap,
  TrendingDown,
  Briefcase,
  ShieldCheck,
  UserCheck,
  Award,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts';
import toast from 'react-hot-toast';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchStats = async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
      const res = await API.get('/admin/dashboard');
      if (res.data && res.data.success) {
        setStats(res.data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error(err);
      if (!isSilent) toast.error('Failed to load admin live stats');
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  // Initial load + 5 second auto-sync interval
  useEffect(() => {
    fetchStats(false);

    const interval = setInterval(() => {
      if (autoSync) {
        fetchStats(true);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSync]);

  const PALETTE = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#14B8A6'];

  return (
    <div className="space-y-8">
      {/* Title & Live Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0B1120] p-6 border border-slate-800 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black font-heading text-white tracking-tight">System Analytics & Live Command Center</h1>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 animate-pulse">
              <Zap size={12} /> LIVE SYNC ACTIVE
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Real-time MongoDB metrics auto-updating every 5 seconds. Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300 font-semibold cursor-pointer bg-slate-900 px-3 py-2 rounded-xl border border-slate-800">
            <input
              type="checkbox"
              checked={autoSync}
              onChange={(e) => setAutoSync(e.target.checked)}
              className="accent-cyan-500 rounded"
            />
            <span>Auto Refresh (5s)</span>
          </label>

          <button
            onClick={() => fetchStats(false)}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-blue-500/20"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh Now
          </button>
        </div>
      </div>

      {/* 9 Database Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Users</span>
            <span className="text-2xl font-black text-white font-mono mt-1 block">{stats?.totalUsers || 0}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <Users size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Listed Equities</span>
            <span className="text-2xl font-black text-cyan-400 font-mono mt-1 block">{stats?.totalStocks || 0}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Executed Trades</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{stats?.totalTrades || 0}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Layers size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Trading Volume</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">
              ${(stats?.totalTradingVolume || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Deposits</span>
            <span className="text-2xl font-black text-blue-400 font-mono mt-1 block">
              ${(stats?.totalDeposits || 0).toLocaleString()}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <ArrowDownLeft size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Withdrawals</span>
            <span className="text-2xl font-black text-purple-400 font-mono mt-1 block">
              ${(stats?.totalWithdrawals || 0).toLocaleString()}
            </span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <ArrowUpRight size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Profitable Trades</span>
            <span className="text-2xl font-black text-emerald-400 font-mono mt-1 block">{stats?.profitableTrades || 0}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Loss Trades</span>
            <span className="text-2xl font-black text-red-400 font-mono mt-1 block">{stats?.lossTrades || 0}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center border border-red-500/20">
            <XCircle size={22} />
          </div>
        </div>

        <div className="p-5 bg-[#0B1120] border border-slate-800/90 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Pending Orders</span>
            <span className="text-2xl font-black text-amber-400 font-mono mt-1 block">{stats?.pendingTrades || 0}</span>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <Clock size={22} />
          </div>
        </div>
      </div>

      {/* --- 6 NEW LIVE CHARTS & GRAPHS SECTION --- */}

      <div className="pt-2">
        <h2 className="text-lg font-black font-heading text-white flex items-center gap-2 mb-4">
          <Activity size={20} className="text-cyan-400" /> Interactive Database Analytics & Live Charts (6 New Graphs)
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* NEW CHART 1: Stock Market Sector Breakdown */}
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                <PieIcon size={18} className="text-cyan-400" /> 1. Stock Market Sector Distribution
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                Stock Table
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.sectorDistribution || []}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {(stats?.sectorDistribution || []).map((entry, idx) => (
                      <Cell key={entry._id} fill={PALETTE[idx % PALETTE.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NEW CHART 2: Trade Outcomes & Status Distribution */}
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                <BarChart2 size={18} className="text-emerald-400" /> 2. Trade Outcomes Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                Trade Table
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.tradeStatusBreakdown || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {(stats?.tradeStatusBreakdown || []).map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color || PALETTE[idx % PALETTE.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NEW CHART 3: User Portfolio Stock Holdings Capital */}
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                <Briefcase size={18} className="text-amber-400" /> 3. Top Stocks Held by User Capital ($)
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                Holding Table
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topStockHoldings || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="_id" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    formatter={(val) => `$${Number(val).toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="totalInvested" fill="#F59E0B" radius={[8, 8, 0, 0]} name="Total Capital Invested" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NEW CHART 4: Cash Flow Breakdown (Deposits vs Withdrawals) */}
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                <DollarSign size={18} className="text-purple-400" /> 4. Cash Flow Breakdown (Deposits vs Withdrawals)
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                Transaction Table
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats?.transactionCashFlow || []}
                    dataKey="totalAmount"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    label={({ name, value }) => `${name}: $${Number(value).toLocaleString()}`}
                  >
                    {(stats?.transactionCashFlow || []).map((entry, idx) => (
                      <Cell key={entry._id} fill={entry._id === 'DEPOSIT' ? '#3B82F6' : '#8B5CF6'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => `$${Number(val).toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NEW CHART 5: Top 5 Highest User Balances Leaderboard */}
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                <Award size={18} className="text-yellow-400" /> 5. Wealthiest User Accounts Leaderboard
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                User Table
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topUserBalances || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis type="number" stroke="#64748B" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" fontSize={11} width={80} />
                  <Tooltip
                    formatter={(val) => `$${Number(val).toLocaleString()}`}
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="balance" fill="#10B981" radius={[0, 8, 8, 0]} name="Account Balance ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NEW CHART 6: User Growth & Signup Timeline */}
          <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
                <UserCheck size={18} className="text-cyan-400" /> 6. User Signup Growth Timeline
              </h3>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                User Growth
              </span>
            </div>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.userGrowth || []}>
                  <defs>
                    <linearGradient id="userGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="_id" stroke="#64748B" fontSize={11} />
                  <YAxis stroke="#64748B" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#06B6D4" fillOpacity={1} fill="url(#userGrowthGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </div>

      {/* Original Core Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Buy vs Sell Pie */}
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
            <PieIcon size={18} className="text-blue-400" /> Order Type Distribution (BUY vs SELL)
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.buyVsSell || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  <Cell fill="#10B981" />
                  <Cell fill="#EF4444" />
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Traded Stocks */}
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <h3 className="text-sm font-bold font-heading text-white flex items-center gap-2">
            <BarChart2 size={18} className="text-amber-400" /> Most Traded Equities by Order Count
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.topTradedStocks || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="_id" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Number of Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
