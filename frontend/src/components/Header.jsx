import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationPanel } from './NotificationPanel';
import {
  TrendingUp,
  LayoutDashboard,
  Shield,
  LogOut,
  User,
  Menu,
  X,
  ArrowUpRight,
  ShoppingBag,
  Layers,
} from 'lucide-react';

export const Header = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-[#050816]/90 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#050816] rounded-[10px] flex items-center justify-center">
                <TrendingUp size={20} className="text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight font-heading text-white">
                APEX<span className="text-cyan-400">QUANT</span>
              </span>
              <span className="hidden sm:block text-[9px] uppercase tracking-widest text-slate-400 font-mono -mt-1">
                Institutional Terminal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80 text-xs font-medium text-slate-300">
            <Link
              to="/"
              className={`px-3.5 py-1.5 rounded-full transition ${
                isActive('/') ? 'bg-blue-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/markets"
              className={`px-3.5 py-1.5 rounded-full transition ${
                isActive('/markets') ? 'bg-blue-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Markets
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard/trade"
                  className={`px-3.5 py-1.5 rounded-full transition font-semibold ${
                    isActive('/dashboard/trade')
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-cyan-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Buy / Sell Shares
                </Link>
                <Link
                  to="/dashboard/holdings"
                  className={`px-3.5 py-1.5 rounded-full transition font-semibold ${
                    isActive('/dashboard/holdings')
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  My Shares
                </Link>
              </>
            )}

            <Link
              to="/features"
              className={`px-3.5 py-1.5 rounded-full transition ${
                isActive('/features') ? 'bg-blue-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Features
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-1.5 rounded-full transition ${
                isActive('/about') ? 'bg-blue-600 text-white shadow-sm' : 'hover:text-white hover:bg-slate-800/60'
              }`}
            >
              About
            </Link>
          </nav>

          {/* Right Action Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <NotificationPanel />

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 font-semibold text-xs rounded-xl transition"
                  >
                    <Shield size={14} /> Admin Terminal
                  </Link>
                )}

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>

                <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                  <Link
                    to="/dashboard/profile"
                    className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-cyan-400 border border-cyan-500/30 hover:border-cyan-400 transition"
                    title={user?.name}
                  >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-900 rounded-xl transition"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-500/20 transition"
                >
                  Start Trading <ArrowUpRight size={14} />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            {isAuthenticated && <NotificationPanel />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0B1120] border-b border-slate-800 px-4 py-5 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-white py-1"
          >
            Home
          </Link>
          <Link
            to="/markets"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-white py-1"
          >
            Markets
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard/trade"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-bold text-cyan-400 hover:text-white py-1"
              >
                Buy / Sell Shares
              </Link>
              <Link
                to="/dashboard/holdings"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium text-slate-300 hover:text-white py-1"
              >
                My Shares
              </Link>
            </>
          )}

          <Link
            to="/features"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-white py-1"
          >
            Features
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-slate-300 hover:text-white py-1"
          >
            About
          </Link>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-xl"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-amber-500/20 text-amber-400 font-semibold text-sm rounded-xl border border-amber-500/30"
                  >
                    Admin Terminal
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2 text-red-400 hover:bg-slate-900 rounded-xl text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-slate-900 text-slate-200 font-semibold text-sm rounded-xl border border-slate-800"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm rounded-xl"
                >
                  Register Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
