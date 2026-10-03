import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Filter, Shield, UserCheck, UserX, DollarSign, Edit, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Balance Adjustment Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState('ADD');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/admin/users?page=${page}&limit=15&search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'ALL') url += `&status=${statusFilter}`;

      const res = await API.get(url);
      if (res.data && res.data.success) {
        setUsers(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load users list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, statusFilter, page]);

  const toggleUserStatus = async (user) => {
    const newStatus = user.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await API.put(`/admin/users/${user._id}/status`, { status: newStatus });
      if (res.data && res.data.success) {
        toast.success(`User ${user.name} changed to ${newStatus}`);
        setUsers((prev) => prev.map((u) => (u._id === user._id ? { ...u, status: newStatus } : u)));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    }
  };

  const handleBalanceUpdate = async (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid positive amount');
      return;
    }

    try {
      const res = await API.put(`/admin/users/${selectedUser._id}/balance`, {
        amount: parseFloat(amount),
        action,
      });

      if (res.data && res.data.success) {
        toast.success(res.data.message);
        setUsers((prev) =>
          prev.map((u) => (u._id === selectedUser._id ? { ...u, balance: res.data.data.balance } : u))
        );
        setModalOpen(false);
        setAmount('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to adjust balance');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">User Accounts Management</h1>
        <p className="text-slate-400 text-xs mt-1">Manage registered trader profiles, clearance status, and credit balances</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
          >
            <option value="ALL" className="bg-slate-900">All Account Statuses</option>
            <option value="ACTIVE" className="bg-slate-900">ACTIVE Users Only</option>
            <option value="DISABLED" className="bg-slate-900">DISABLED Users Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading user accounts...</div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No user accounts found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Trader Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Cash Balance</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Registered Date</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-bold text-white flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-slate-800 font-mono font-bold text-cyan-400 text-xs flex items-center justify-center">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-heading text-xs">{u.name}</span>
                    </td>
                    <td className="p-3 text-slate-300">{u.email}</td>
                    <td className="p-3 text-slate-400">{u.phone || 'N/A'}</td>
                    <td className="p-3 font-bold text-emerald-400">${u.balance?.toLocaleString()}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(u);
                          setModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 text-[11px] font-semibold rounded-lg border border-cyan-500/30 transition"
                      >
                        Adjust Balance
                      </button>
                      <button
                        onClick={() => toggleUserStatus(u)}
                        className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition ${
                          u.status === 'ACTIVE'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Balance Adjustment Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0B1120] border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-4 glass-panel">
            <h3 className="text-lg font-bold font-heading text-white">Adjust Balance — {selectedUser.name}</h3>
            <p className="text-xs text-slate-400">Current Balance: <span className="text-emerald-400 font-mono font-bold">${selectedUser.balance?.toLocaleString()}</span></p>

            <form onSubmit={handleBalanceUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Action Type</label>
                <select
                  value={action}
                  onChange={(e) => setAction(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
                >
                  <option value="ADD" className="bg-slate-900">Credit / Deposit (+)</option>
                  <option value="DEDUCT" className="bg-slate-900">Deduct / Withdrawal (-)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full glass-input px-4 py-2.5 rounded-xl text-xs font-mono"
                  placeholder="e.g. 5000"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-900 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow-lg"
                >
                  Submit Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
