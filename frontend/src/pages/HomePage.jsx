import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { ThreeDCanvas } from '../components/ThreeDCanvas';
import { StockCard } from '../components/StockCard';
import { TradeModal } from '../components/TradeModal';
import {
  TrendingUp,
  ShieldCheck,
  Zap,
  BarChart3,
  ArrowRight,
  Globe,
  Lock,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const HomePage = () => {
  const [topStocks, setTopStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const res = await API.get('/stocks?limit=8&sortBy=change_desc');
        if (res.data && res.data.success) {
          setTopStocks(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load home page stocks:', err);
      }
    };
    fetchTopStocks();
  }, []);

  return (
    <div className="space-y-20 relative">
      {/* HERO SECTION */}
      <section className="relative min-h-[520px] flex items-center justify-center pt-8 pb-16 overflow-hidden rounded-3xl border border-slate-800/80 bg-gradient-to-b from-[#0B1120] to-[#050816]">
        <ThreeDCanvas />

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-semibold animate-pulse-glow">
            <Zap size={14} className="text-cyan-400" /> ApexQuant Institutional Engine v2.4
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading text-white leading-tight">
            Trade Smarter. <br />
            <span className="gradient-text">Analyze Deeper. Perform Better.</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            ApexQuant is an advanced full-stack trading and portfolio management platform. Experience real-time order execution, quantitative risk modeling, and institutional-grade analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold rounded-2xl shadow-xl shadow-blue-500/25 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Trading Now <ArrowRight size={18} />
            </Link>
            <Link
              to="/markets"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 font-heading font-semibold rounded-2xl border border-slate-700/80 transition flex items-center justify-center gap-2"
            >
              Explore Markets
            </Link>
          </div>

          {/* Key Metrics Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <p className="text-2xl font-extrabold text-white font-mono">30+</p>
              <p className="text-xs text-slate-400">Global Equities</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <p className="text-2xl font-extrabold text-cyan-400 font-mono">Real-Time</p>
              <p className="text-xs text-slate-400">Portfolio Engine</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <p className="text-2xl font-extrabold text-emerald-400 font-mono">$100,000</p>
              <p className="text-xs text-slate-400">Demo Balance</p>
            </div>
            <div className="p-3 bg-slate-900/40 rounded-xl border border-slate-800/60">
              <p className="text-2xl font-extrabold text-blue-400 font-mono">Zero Fee</p>
              <p className="text-xs text-slate-400">Order Execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP MOVERS MARKET SECTION */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
              <TrendingUp className="text-cyan-400" /> Top Market Movers
            </h2>
            <p className="text-slate-400 text-xs mt-1">Live market data refreshed dynamically</p>
          </div>
          <Link
            to="/markets"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            View All 30 Markets <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topStocks.map((stock) => (
            <StockCard
              key={stock._id}
              stock={stock}
              onTrade={(s) => setSelectedStock(s)}
            />
          ))}
        </div>
      </section>

      {/* PLATFORM ADVANTAGES */}
      <section className="p-8 sm:p-12 rounded-3xl bg-[#0B1120] border border-slate-800 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold font-heading text-white">
            Built for Precision Trading
          </h2>
          <p className="text-slate-400 text-sm">
            Everything you need to execute, analyze, and optimize your portfolio in one unified environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <BarChart3 size={24} />
            </div>
            <h3 className="font-heading font-bold text-white text-base">Quantitative Analytics</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Track asset concentration, risk exposure, and sector diversification in real time with Recharts interactive visualizations.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Zap size={24} />
            </div>
            <h3 className="font-heading font-bold text-white text-base">Instant Order Routing</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Execute buy and sell trades instantly with automated server balance verification and MongoDB position tracking.
            </p>
          </div>

          <div className="p-6 bg-slate-900/60 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="font-heading font-bold text-white text-base">Institutional Controls</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Complete admin management terminal featuring live audit logs, user balance management, and trade status validation.
            </p>
          </div>
        </div>
      </section>

      {/* TRADE MODAL */}
      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
};
