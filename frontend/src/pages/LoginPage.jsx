import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, TrendingUp, Eye, EyeOff, Shield, Zap, Sparkles, Activity, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      if (res.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Background Graphic Effects & Particles */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '2s' }} />

      {/* Floating Trading Graphics */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex absolute left-12 top-1/3 p-4 bg-[#0B1120]/80 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl items-center gap-3 animate-float"
      >
        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
          <Activity size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-white font-heading">Real-Time Market Feeds</p>
          <p className="text-[10px] text-emerald-400 font-mono">250ms Low Latency Execution</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex absolute right-12 bottom-1/3 p-4 bg-[#0B1120]/80 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl items-center gap-3 animate-float-slow"
      >
        <div className="p-2.5 bg-cyan-500/10 rounded-xl text-cyan-400">
          <Zap size={22} />
        </div>
        <div>
          <p className="text-xs font-bold text-white font-heading">Institutional Encryption</p>
          <p className="text-[10px] text-cyan-400 font-mono">AES-256 Bit SSL Protocol</p>
        </div>
      </motion.div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 25 }}
        className="w-full max-w-md bg-[#0B1120]/90 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10 neon-border-blue"
      >
        {/* Animated Glow Halo */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-xl mx-auto cursor-pointer"
          >
            <div className="w-full h-full bg-[#050816] rounded-[14px] flex items-center justify-center text-cyan-400">
              <TrendingUp size={28} />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-white flex items-center justify-center gap-2">
              Welcome Back <Sparkles size={18} className="text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            </h2>
            <p className="text-slate-400 text-xs mt-1">Access your live ApexQuant trading terminal & holdings</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
                placeholder="trader@apexquant.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input pl-10 pr-10 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-extrabold text-sm rounded-xl transition shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In to Terminal</span>
                <Zap size={16} className="text-amber-300" />
              </>
            )}
          </motion.button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">New to ApexQuant?</span>
          <Link to="/register" className="text-cyan-400 font-bold hover:text-cyan-300 flex items-center gap-1 transition">
            Create Account &rarr;
          </Link>
        </div>

        <div className="p-3 bg-slate-900/90 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-center justify-between shadow-inner">
          <span className="flex items-center gap-1.5 font-medium">
            <Shield size={14} className="shrink-0 text-amber-400" /> Administrative Access?
          </span>
          <Link to="/admin/login" className="font-bold underline hover:text-amber-200">
            Admin Clearance &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
