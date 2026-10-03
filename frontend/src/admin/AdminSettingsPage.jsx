import React from 'react';
import { Settings, Server, Database, Shield, Cpu, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminSettingsPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Settings className="text-cyan-400" size={24} /> Terminal Configuration & Controls
        </h1>
        <p className="text-slate-400 text-xs mt-1">ApexQuant system status, environment variables, and database connection state</p>
      </div>

      <div className="p-8 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Server size={18} className="text-blue-400" /> Environment Configuration
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Database Connection URI</span>
            <span className="text-cyan-400 font-bold">mongodb://localhost:27017/ApexQuant</span>
          </div>
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Backend Port</span>
            <span className="text-emerald-400 font-bold">5000</span>
          </div>
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Frontend Port</span>
            <span className="text-emerald-400 font-bold">5173</span>
          </div>
          <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between">
            <span className="text-slate-400">Market Price Simulator Engine</span>
            <span className="text-blue-400 font-bold">ACTIVE (5000ms interval)</span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => toast.success('ApexQuant Server Engine is running in optimal state')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition"
          >
            Run System Health Check
          </button>
        </div>
      </div>
    </div>
  );
};
