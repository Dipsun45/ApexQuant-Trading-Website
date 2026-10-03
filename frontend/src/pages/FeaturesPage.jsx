import React from 'react';
import { Zap, Layers, ShieldCheck, Activity, PieChart, RefreshCcw } from 'lucide-react';

export const FeaturesPage = () => {
  return (
    <div className="space-y-12 max-w-5xl mx-auto py-4">
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono rounded-full">
          Platform Capabilities
        </span>
        <h1 className="text-4xl font-extrabold font-heading text-white">ApexQuant Features</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          Explore the tools and services built into the ApexQuant Trading & Analytics ecosystem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <Zap className="text-cyan-400" size={28} />
          <h3 className="font-heading font-bold text-white text-base">Real-Time Market Ticker</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Live Socket.IO data stream pushing price updates across connected client dashboards seamlessly.
          </p>
        </div>

        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <PieChart className="text-blue-400" size={28} />
          <h3 className="font-heading font-bold text-white text-base">Asset Allocation Charts</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Interactive Recharts visualizations breaking down portfolio weight by sector and position size.
          </p>
        </div>

        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <Layers className="text-emerald-400" size={28} />
          <h3 className="font-heading font-bold text-white text-base">Order Execution</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Instant BUY and SELL order processing with automated average cost basis and realized P/L recording.
          </p>
        </div>

        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <ShieldCheck className="text-amber-400" size={28} />
          <h3 className="font-heading font-bold text-white text-base">Admin Audit Trail</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Comprehensive audit log tracking all administrative adjustments, user status changes, and stock edits.
          </p>
        </div>

        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <Activity className="text-purple-400" size={28} />
          <h3 className="font-heading font-bold text-white text-base">Risk Metrics Overview</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Informational analytics calculating cash concentration ratios and position exposure percentages.
          </p>
        </div>

        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <RefreshCcw className="text-rose-400" size={28} />
          <h3 className="font-heading font-bold text-white text-base">Personalized Watchlist</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Create custom stock watchlists to monitor target equities with one-click trading access.
          </p>
        </div>
      </div>
    </div>
  );
};
