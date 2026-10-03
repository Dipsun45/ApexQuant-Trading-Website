import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck, Cpu, Globe, Lock } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#050816] border-t border-slate-800/80 text-slate-400 font-sans text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                <TrendingUp size={18} />
              </div>
              <span className="text-lg font-extrabold tracking-tight font-heading text-white">
                APEX<span className="text-cyan-400">QUANT</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              ApexQuant is an advanced MERN portfolio management and quantitative trading simulation platform. Engineered for speed, algorithmic insights, and precision risk control.
            </p>
            <div className="flex items-center gap-4 text-slate-500 pt-2">
              <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400" /> Bank-Grade Auth</span>
              <span className="flex items-center gap-1"><Cpu size={14} className="text-cyan-400" /> Real-time Ticker</span>
              <span className="flex items-center gap-1"><Lock size={14} className="text-blue-400" /> JWT Encrypted</span>
            </div>
          </div>

          {/* Nav Cols */}
          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/markets" className="hover:text-cyan-400 transition">Live Markets</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition">Trading Terminal</Link></li>
              <li><Link to="/features" className="hover:text-cyan-400 transition">Analytics Engine</Link></li>
              <li><Link to="/dashboard/portfolio" className="hover:text-cyan-400 transition">Portfolio Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-3">Markets</h4>
            <ul className="space-y-2">
              <li><Link to="/markets?sector=Technology" className="hover:text-cyan-400 transition">Technology Equities</Link></li>
              <li><Link to="/markets?sector=Financial+Services" className="hover:text-cyan-400 transition">Financial Services</Link></li>
              <li><Link to="/markets?sector=Semiconductors" className="hover:text-cyan-400 transition">Semiconductors</Link></li>
              <li><Link to="/markets?sector=Software" className="hover:text-cyan-400 transition">Software & Cloud</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold text-white uppercase tracking-wider text-xs mb-3">Company & Legal</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-cyan-400 transition">About ApexQuant</Link></li>
              <li><Link to="/contact" className="hover:text-cyan-400 transition">Contact Support</Link></li>
              <li><a href="#disclaimer" className="hover:text-cyan-400 transition">Risk Disclosure</a></li>
              <li><a href="#privacy" className="hover:text-cyan-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer banner */}
        <div id="disclaimer" className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-500 leading-relaxed mb-6">
          <span className="font-bold text-slate-400">INFORMATIONAL FINANCIAL DISCLAIMER: </span>
          ApexQuant is a demonstration web application engineered with simulated market data. The prices, portfolio statistics, and transactions presented are intended solely for software demonstration, analytics testing, and portfolio modeling. ApexQuant does not act as a licensed brokerage or investment advisory firm.
        </div>

        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 ApexQuant. All rights reserved.</p>
          <p className="font-mono text-cyan-500/80">Tagline: Trade Smarter. Analyze Deeper. Perform Better.</p>
        </div>
      </div>
    </footer>
  );
};
