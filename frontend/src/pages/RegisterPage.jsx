import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Globe, Calendar, CheckSquare, Eye, EyeOff, TrendingUp, ShieldCheck, Sparkles, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: 'United States',
    dob: '',
    terms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.terms) {
      toast.error('You must accept the terms & conditions');
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      country: form.country,
      dob: form.dob,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Dynamic Animated Grid & Particle Backdrops */}
      <div className="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl animate-pulse-glow pointer-events-none" style={{ animationDelay: '3s' }} />

      {/* Floating Perks Cards */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden xl:flex absolute left-8 top-1/4 p-4 bg-[#0B1120]/90 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl items-center gap-3 animate-float"
      >
        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
          <DollarSign size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-white font-heading">Free $100,000 Portfolio</p>
          <p className="text-[10px] text-emerald-400 font-mono">Instant Simulated Trading Capital</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="hidden xl:flex absolute right-8 bottom-1/4 p-4 bg-[#0B1120]/90 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-2xl items-center gap-3 animate-float-slow"
      >
        <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-white font-heading">Institutional Security</p>
          <p className="text-[10px] text-cyan-400 font-mono">Zero Risk Virtual Sandbox</p>
        </div>
      </motion.div>

      {/* Main Registration Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', damping: 25 }}
        className="w-full max-w-xl bg-[#0B1120]/90 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl space-y-6 relative z-10 neon-border-cyan"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center space-y-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-xl mx-auto cursor-pointer"
          >
            <div className="w-full h-full bg-[#050816] rounded-[14px] flex items-center justify-center text-cyan-400">
              <TrendingUp size={28} />
            </div>
          </motion.div>
          <div>
            <h2 className="text-2xl font-black font-heading tracking-tight text-white flex items-center justify-center gap-2">
              Create Trader Account <Sparkles size={18} className="text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            </h2>
            <p className="text-slate-400 text-xs mt-1">Join ApexQuant and claim $100,000 instant virtual trading cash</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
                  placeholder="Alex Mercer"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
                  placeholder="alex@apexquant.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
                  placeholder="+1 (555) 019-2831"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Country</label>
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium appearance-none focus:border-cyan-400 transition"
                >
                  <option value="United States" className="bg-slate-900">United States</option>
                  <option value="United Kingdom" className="bg-slate-900">United Kingdom</option>
                  <option value="Canada" className="bg-slate-900">Canada</option>
                  <option value="Germany" className="bg-slate-900">Germany</option>
                  <option value="Japan" className="bg-slate-900">Japan</option>
                  <option value="India" className="bg-slate-900">India</option>
                  <option value="Australia" className="bg-slate-900">Australia</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
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

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Date of Birth</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="date"
                value={form.dob}
                onChange={(e) => setForm({ ...form, dob: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-3 rounded-xl text-xs font-medium focus:border-cyan-400 transition"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="terms"
              checked={form.terms}
              onChange={(e) => setForm({ ...form, terms: e.target.checked })}
              className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              required
            />
            <label htmlFor="terms" className="text-xs text-slate-400 select-none cursor-pointer">
              I accept the ApexQuant <a href="#terms" className="text-cyan-400 underline font-semibold">Terms of Service</a> & Risk Disclaimer
            </label>
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
                <span>Create Account & Claim $100,000</span>
                <Sparkles size={16} className="text-amber-300" />
              </>
            )}
          </motion.button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
          Already registered trader?{' '}
          <Link to="/login" className="text-cyan-400 font-extrabold hover:text-cyan-300 transition">
            Sign In to Terminal &rarr;
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
