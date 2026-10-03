import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { StockCard } from '../components/StockCard';
import { TradeModal } from '../components/TradeModal';
import { Bookmark, Plus, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const res = await API.get('/watchlist');
      if (res.data && res.data.success) {
        setWatchlist(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load watchlist');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (stockId) => {
    try {
      await API.delete(`/watchlist/${stockId}`);
      setWatchlist((prev) => prev.filter((s) => s._id !== stockId));
      toast.success('Removed from watchlist');
    } catch (err) {
      toast.error('Failed to remove stock');
    }
  };

  const watchlistIds = watchlist.map((s) => s._id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Bookmark className="text-cyan-400" size={24} /> My Watchlist
          </h1>
          <p className="text-slate-400 text-xs mt-1">Track prices and execute trades for your saved target equities</p>
        </div>
        <Link
          to="/markets"
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
        >
          <Plus size={14} /> Add Equities
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
          <Bookmark size={36} className="text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white font-heading">Your Watchlist is Empty</h3>
          <p className="text-slate-400 text-xs max-w-sm mx-auto">
            Explore the 30 available market stocks and click the "+" icon to add stocks to your personal watchlist.
          </p>
          <Link
            to="/markets"
            className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
          >
            Explore Markets
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {watchlist.map((stock) => (
            <StockCard
              key={stock._id}
              stock={stock}
              inWatchlist={true}
              onToggleWatchlist={removeFromWatchlist}
              onTrade={(s) => setSelectedStock(s)}
            />
          ))}
        </div>
      )}

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onSuccess={fetchWatchlist}
        />
      )}
    </div>
  );
};
