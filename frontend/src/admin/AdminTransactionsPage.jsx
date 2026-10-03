import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Search, Filter, Download, ArrowRightLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminTransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let url = `/admin/transactions?page=${page}&limit=20&search=${encodeURIComponent(search)}`;
      if (typeFilter !== 'ALL') url += `&type=${typeFilter}`;

      const res = await API.get(url);
      if (res.data && res.data.success) {
        setTransactions(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load transaction ledger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [search, typeFilter, page]);

  const handleExportCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions available to export');
      return;
    }

    const headers = 'TxnID,User,Type,Symbol,Quantity,Price,Total,Status,Date\n';
    const rows = transactions
      .map(
        (t) =>
          `${t.transactionId},${t.user?.email || 'N/A'},${t.type},${t.symbol || 'N/A'},${t.quantity || 0},${t.price || 0},${t.total || 0},${t.status},${new Date(t.createdAt).toISOString()}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ApexQuant_Transactions_${Date.now()}.csv`;
    a.click();
    toast.success('Exported transaction CSV file');
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white">Global Financial Ledger</h1>
          <p className="text-slate-400 text-xs mt-1">Audit log of all order executions, cash deposits, and balance adjustments</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition"
        >
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative col-span-2">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search transaction ID or symbol..."
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
            <option value="BUY" className="bg-slate-900">BUY</option>
            <option value="SELL" className="bg-slate-900">SELL</option>
            <option value="DEPOSIT" className="bg-slate-900">DEPOSIT</option>
            <option value="WITHDRAWAL" className="bg-slate-900">WITHDRAWAL</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading transaction ledger...</div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No transactions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Txn ID</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Total ($)</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-bold text-cyan-400 text-[11px]">{t.transactionId}</td>
                    <td className="p-3 text-white font-heading">{t.user?.email || 'N/A'}</td>
                    <td className="p-3 font-bold text-slate-200">{t.type}</td>
                    <td className="p-3 text-white font-bold">{t.symbol || '-'}</td>
                    <td className="p-3 text-slate-400">{t.quantity || '-'}</td>
                    <td className="p-3 text-slate-400">{t.price ? `$${t.price.toFixed(2)}` : '-'}</td>
                    <td className="p-3 font-bold text-emerald-400">${t.total?.toLocaleString()}</td>
                    <td className="p-3 text-slate-500 text-[11px]">{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
