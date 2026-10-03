import React, { useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Globe, Shield, Lock, Save, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

export const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    country: user?.country || 'United States',
    currentPassword: '',
    newPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.put('/auth/profile', form);
      if (res.data && res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully');
        updateUser(res.data.data);
        setForm((prev) => ({ ...prev, currentPassword: '', newPassword: '' }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Account Settings</h1>
        <p className="text-slate-400 text-xs mt-1">Manage your trader profile details and security preferences</p>
      </div>

      {/* Immutable Account Overview Box */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1 text-[10px]">ACCOUNT ID</span>
          <span className="text-white font-bold truncate block">{user?._id}</span>
        </div>
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1 text-[10px]">CLEARANCE ROLE</span>
          <span className="text-cyan-400 font-bold">{user?.role}</span>
        </div>
        <div className="p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
          <span className="text-slate-500 block mb-1 text-[10px]">CASH BALANCE</span>
          <span className="text-emerald-400 font-bold">${user?.balance?.toLocaleString()}</span>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="p-8 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-6">
        <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3">Personal Information</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email (Read Only)</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-900/80 border border-slate-800 pl-10 pr-4 py-2.5 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Country</label>
            <div className="relative">
              <Globe size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold font-heading text-white border-b border-slate-800 pb-3 pt-4">Security Settings</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
                placeholder="Min 6 characters"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold text-xs rounded-xl transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Save size={16} /> Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};
