import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, Zap, KeyRound, ShieldAlert, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminLogin(email, password);
    setLoading(false);
    if (res.success) {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Graphic Effects & Particles */}
      <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '2.5s' }} />

      {/* Side Decorative Graphic Badges */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden xl:flex absolute left-16 top-1/3 p-4 bg-[#0B1120]/90 border border-amber-500/20 rounded-2xl backdrop-blur-xl shadow-2xl items-center gap-3 animate-float"
      >
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
          <ShieldAlert size={24} />
        </div>
        <div>
          <p className="text-xs font-extrabold text-white font-heading">SuperAdmin Clearance</p>
          <p className="text-[10px] text-amber-400/90 font-mono">Restricted System Operations</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden xl:flex absolute right-16 bottom-1/3 p-4 bg-[#0B1120]/90 border border-amber-500/20 rounded-2xl backdrop-blur-xl shadow-2xl items-center gap-3 animate-float-slow"
      >
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
          <Cpu size={24} />
        </div>
        <div>
          <p className="text-xs font-extrabold text-white font-heading">Control Node Engine</p>
          <p className="text-[10px] text-cyan-400 font-mono">Live MongoDB Database Sync</p>
        </div>
      </motion.div>

      {/* Main Admin Clearance Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 25 }}
        className="w-full max-w-md bg-[#0B1120]/90 border border-amber-500/30 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10 neon-border-amber"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.8 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-600 p-0.5 shadow-xl mx-auto cursor-pointer"
          >
            <div className="w-full h-full bg-[#050816] rounded-[14px] flex items-center justify-center text-amber-400">
              <Shield size={32} />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-black font-heading text-white tracking-tight flex items-center justify-center gap-2">
              Admin Clearance <KeyRound size={18} className="text-amber-400" />
            </h2>
            <p className="text-slate-400 text-xs mt-1">Enter authorized credentials to unlock ApexQuant Terminal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Admin Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-amber-400 transition"
                placeholder="admin@gmail.com"
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
                className="w-full glass-input pl-10 pr-10 py-3 rounded-xl text-xs font-medium focus:border-amber-400 transition"
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
            className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 hover:from-amber-500 hover:to-yellow-400 text-white font-heading font-extrabold text-sm rounded-xl transition shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Authenticate Admin Access</span>
                <Zap size={16} className="text-white" />
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
