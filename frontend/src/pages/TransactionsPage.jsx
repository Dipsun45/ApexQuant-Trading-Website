import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Filter, ArrowDownLeft, ArrowUpRight, DollarSign, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let url = `/transactions?page=${page}&limit=15&search=${encodeURIComponent(search)}`;
      if (typeFilter !== 'ALL') url += `&type=${typeFilter}`;

      const res = await API.get(url);
      if (res.data && res.data.success) {
        setTransactions(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, page]);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'BUY':
        return <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded font-mono text-[11px] font-bold">BUY</span>;
      case 'SELL':
        return <span className="px-2.5 py-0.5 bg-red-500/10 text-red-400 border border-red-500/30 rounded font-mono text-[11px] font-bold">SELL</span>;
      case 'DEPOSIT':
        return <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded font-mono text-[11px] font-bold">DEPOSIT</span>;
      default:
        return <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[11px]">WITHDRAWAL</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white">Transaction Ledger</h1>
        <p className="text-slate-400 text-xs mt-1">Audit log of all order executions, cash deposits, and balance adjustments</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by transaction ID or symbol..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none"
          >
            <option value="ALL" className="bg-slate-900">All Transaction Types</option>
            <option value="BUY" className="bg-slate-900">BUY Orders</option>
            <option value="SELL" className="bg-slate-900">SELL Orders</option>
            <option value="DEPOSIT" className="bg-slate-900">DEPOSIT Credits</option>
            <option value="WITHDRAWAL" className="bg-slate-900">WITHDRAWAL Deductions</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading ledger records...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No transactions recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Asset</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-bold text-slate-400 text-[11px]">{tx.transactionId}</td>
                    <td className="p-3">{getTypeBadge(tx.type)}</td>
                    <td className="p-3 font-bold text-white">{tx.symbol || 'N/A'}</td>
                    <td className="p-3 text-slate-300">{tx.quantity || '-'}</td>
                    <td className="p-3 text-slate-400">{tx.price ? `$${tx.price.toFixed(2)}` : '-'}</td>
                    <td className="p-3 font-bold text-cyan-400">${tx.total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded">
                        {tx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-500 text-[11px]">
                      {new Date(tx.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl disabled:opacity-50"
            >
              Previous Page
            </button>
            <span className="text-slate-400 font-mono">Page {page} of {totalPages}</span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl disabled:opacity-50"
            >
              Next Page
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
