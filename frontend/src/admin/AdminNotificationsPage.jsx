import React, { useState } from 'react';
import API from '../services/api';
import { Bell, Megaphone, Send } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminNotificationsPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('ANNOUNCEMENT');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !message) {
      toast.error('Title and message are required');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/notifications/announcement', {
        title,
        message,
        type,
      });

      if (res.data && res.data.success) {
        toast.success('Global announcement published to all active traders!');
        setTitle('');
        setMessage('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to publish announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
          <Megaphone className="text-cyan-400" size={24} /> Broadcast Announcement
        </h1>
        <p className="text-slate-400 text-xs mt-1">Publish system announcements and market notifications to all client header bell panels</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Announcement Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
          >
            <option value="ANNOUNCEMENT" className="bg-slate-900">Global Announcement</option>
            <option value="INFO" className="bg-slate-900">Informational Note</option>
            <option value="WARNING" className="bg-slate-900">Market Warning / Maintenance</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Notification Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full glass-input px-4 py-2.5 rounded-xl text-xs"
            placeholder="e.g. Q3 Market Trading Update"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">Message Content</label>
          <textarea
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full glass-input px-4 py-2.5 rounded-xl text-xs resize-none"
            placeholder="Type notification message..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-heading font-bold text-xs rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Publish Broadcast Announcement <Send size={14} /></>
          )}
        </button>
      </form>
    </div>
  );
};
