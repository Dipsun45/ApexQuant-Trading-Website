import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Layers,
  Briefcase,
  ArrowRightLeft,
  Bell,
  FileText,
  Settings,
  LogOut,
  Shield,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Stocks', path: '/admin/stocks', icon: TrendingUp },
    { name: 'Trades', path: '/admin/trades', icon: Layers },
    { name: 'User Holdings', path: '/admin/user-investments', icon: Briefcase },
    { name: 'Transactions', path: '/admin/transactions', icon: ArrowRightLeft },
    { name: 'Notifications', path: '/admin/notifications', icon: Bell },
    { name: 'Audit Logs', path: '/admin/audit-logs', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-slate-100 flex flex-col md:flex-row relative overflow-hidden">
      {/* Background Graphic Grid */}
      <div className="fixed inset-0 cyber-grid-bg opacity-15 pointer-events-none z-0" />

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B1120] border-r border-slate-800/80 shrink-0 min-h-screen z-20">
        <div className="p-6 border-b border-slate-800/80">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-blue-600 to-cyan-500 p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center">
                <Shield size={18} className="text-amber-400" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight font-heading text-white">
                APEX<span className="text-amber-400">ADMIN</span>
              </span>
              <span className="block text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                Control Terminal
              </span>
            </div>
          </Link>
        </div>

        {/* Admin Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-heading text-xs font-semibold transition ${
                  active
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={active ? 'text-white' : 'text-slate-400'} />
                  <span>{item.name}</span>
                </div>
                {active && <ChevronRight size={14} className="text-white/80" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer Admin info & switch */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs rounded-xl border border-slate-800 transition"
          >
            <ExternalLink size={14} /> Switch to User Panel
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs font-mono">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[10px] text-amber-400/80 font-mono">SUPERADMIN</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-lg transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Admin Header */}
      <div className="md:hidden bg-[#0B1120] border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/admin" className="flex items-center gap-2">
          <Shield size={20} className="text-amber-400" />
          <span className="font-heading font-extrabold text-white text-base">APEX ADMIN</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-slate-900 text-slate-300"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Admin Drawer */}
      {sidebarOpen && (
        <div className="md:hidden bg-[#0B1120] border-b border-slate-800 p-4 space-y-2 relative z-30">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-heading text-xs font-semibold ${
                  active ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex justify-between">
            <Link
              to="/dashboard"
              className="text-xs text-cyan-400 font-semibold"
            >
              User Panel →
            </Link>
            <button onClick={logout} className="text-xs text-red-400 font-semibold">
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area with Animated Page Transition */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-y-auto relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.99 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
