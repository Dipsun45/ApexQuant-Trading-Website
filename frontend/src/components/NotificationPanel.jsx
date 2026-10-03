import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Bell, CheckCheck, AlertCircle, CheckCircle2, Info, Megaphone } from 'lucide-react';
import toast from 'react-hot-toast';

export const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket, user } = useAuth();

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/notifications');
      if (res.data && res.data.success) {
        setNotifications(res.data.data);
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  // Listen to socket live notifications
  useEffect(() => {
    if (!socket) return;

    const handleTradeExecuted = (data) => {
      fetchNotifications();
    };

    socket.on('trade_executed', handleTradeExecuted);
    socket.on('trade_updated', handleTradeExecuted);

    return () => {
      socket.off('trade_executed', handleTradeExecuted);
      socket.off('trade_updated', handleTradeExecuted);
    };
  }, [socket]);

  const markAllRead = async () => {
    try {
      await API.put('/notifications/all/read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />;
      case 'WARNING':
        return <AlertCircle size={16} className="text-amber-400 mt-0.5 shrink-0" />;
      case 'ANNOUNCEMENT':
        return <Megaphone size={16} className="text-cyan-400 mt-0.5 shrink-0" />;
      default:
        return <Info size={16} className="text-blue-400 mt-0.5 shrink-0" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition"
        title="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center rounded-full animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0B1120] border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden glass-panel">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-semibold text-white text-sm">Notifications</h4>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 font-mono text-[11px] rounded-full">
                    {unreadCount} unread
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
                >
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/40">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">No notifications yet</div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`p-3.5 flex items-start gap-3 transition ${
                      !n.isRead ? 'bg-blue-950/20' : 'hover:bg-slate-900/40'
                    }`}
                  >
                    {getIcon(n.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
