import React from 'react';
import { Shield, Cpu, Globe, Lock, Terminal, BarChart2 } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="space-y-12 max-w-4xl mx-auto py-4">
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono rounded-full">
          Institutional Software Architecture
        </span>
        <h1 className="text-4xl font-extrabold font-heading text-white">About ApexQuant</h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          ApexQuant is built as an enterprise-style full-stack quantitative portfolio platform designed with modern Web technologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Cpu size={20} />
          </div>
          <h3 className="font-heading font-bold text-white text-lg">MERN Full-Stack Foundation</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Powered by MongoDB database persistence, Express RESTful endpoints, React Vite single-page frontend, Node.js asynchronous looper, and Socket.IO real-time ticker stream.
          </p>
        </div>

        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Lock size={20} />
          </div>
          <h3 className="font-heading font-bold text-white text-lg">Bank-Grade Authentication</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Stateless JSON Web Tokens (JWT), salted bcrypt password hashing, input sanitization middleware, and strict role-based access control (RBAC).
          </p>
        </div>
      </div>

      <div className="p-8 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-6">
        <h3 className="text-xl font-bold font-heading text-white">Core Architectural Commitments</h3>
        <div className="space-y-4 text-xs text-slate-300">
          <div className="flex gap-3">
            <Terminal size={18} className="text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">End-to-End Server Authorization</p>
              <p className="text-slate-400">All balances, trade executions, order validations, and cash allocations are calculated and verified exclusively on the Node.js/Express server side before writing to MongoDB.</p>
            </div>
          </div>

          <div className="flex gap-3">
            <BarChart2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white mb-0.5">Simulated Live Market Data Engine</p>
              <p className="text-slate-400">The platform incorporates a background market tick simulator that continuously recalculates stock prices, volume, and percentage movements every 5 seconds.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
