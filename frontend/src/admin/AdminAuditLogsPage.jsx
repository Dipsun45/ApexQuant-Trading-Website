import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { FileText, Shield, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminAuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/admin/audit-logs?page=${page}&limit=20`);
      if (res.data && res.data.success) {
        setLogs(res.data.data);
        setTotalPages(res.data.pages || 1);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <FileText className="text-amber-400" size={24} /> Admin Audit Trail
        </h1>
        <p className="text-slate-400 text-xs mt-1">Immutable administrative log records tracking configuration edits, balance overrides, and user clearances</p>
      </div>

      <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs">Loading audit logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No audit logs recorded yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase bg-slate-900/80 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="p-3">Admin Email</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Target Symbol / User</th>
                  <th className="p-3">Description</th>
                  <th className="p-3 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-900/40 transition">
                    <td className="p-3 font-bold text-amber-400 text-[11px]">{log.adminEmail}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[10px] font-bold rounded">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-white font-bold">{log.target || 'N/A'}</td>
                    <td className="p-3 text-slate-300 font-sans text-xs">{log.description}</td>
                    <td className="p-3 text-right text-slate-500 text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
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
