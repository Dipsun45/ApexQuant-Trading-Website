import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { StockCard } from '../components/StockCard';
import { TradeModal } from '../components/TradeModal';
import { Search, Filter, ArrowUpDown, TrendingUp, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export const MarketsPage = () => {
  const [stocks, setStocks] = useState([]);
  const [watchlistIds, setWatchlistIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('ALL');
  const [sortBy, setSortBy] = useState('symbol_asc');
  const [selectedStock, setSelectedStock] = useState(null);
  const { isAuthenticated, socket } = useAuth();

  const fetchStocks = async () => {
    setLoading(true);
    try {
      let query = `/stocks?limit=100&search=${encodeURIComponent(search)}`;
      if (sector !== 'ALL') query += `&sector=${encodeURIComponent(sector)}`;
      if (sortBy) query += `&sortBy=${sortBy}`;

      const res = await API.get(query);
      if (res.data && res.data.success) {
        setStocks(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load markets data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (isAuthenticated) {
      try {
        const res = await API.get('/watchlist');
        if (res.data && res.data.success) {
          const ids = res.data.data.map((s) => s._id);
          setWatchlistIds(ids);
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchStocks();
  }, [search, sector, sortBy]);

  useEffect(() => {
    fetchWatchlist();
  }, [isAuthenticated]);

  // Socket live tick listener
  useEffect(() => {
    if (!socket) return;

    const handleMarketUpdate = (updatedList) => {
      setStocks((prev) => {
        const map = new Map(prev.map((s) => [s.symbol, s]));
        updatedList.forEach((u) => {
          if (map.has(u.symbol)) {
            map.set(u.symbol, { ...map.get(u.symbol), ...u });
          }
        });
        return Array.from(map.values());
      });
    };

    socket.on('market_update', handleMarketUpdate);
    return () => socket.off('market_update', handleMarketUpdate);
  }, [socket]);

  const toggleWatchlist = async (stockId) => {
    if (!isAuthenticated) {
      toast.error('Please log in to manage your watchlist');
      return;
    }

    const inWatch = watchlistIds.includes(stockId);
    try {
      if (inWatch) {
        await API.delete(`/watchlist/${stockId}`);
        setWatchlistIds((prev) => prev.filter((id) => id !== stockId));
        toast.success('Removed from watchlist');
      } else {
        await API.post('/watchlist', { stockId });
        setWatchlistIds((prev) => [...prev, stockId]);
        toast.success('Added to watchlist');
      }
    } catch (err) {
      toast.error('Watchlist action failed');
    }
  };

  const sectorsList = [
    'ALL',
    'Technology',
    'Software',
    'Semiconductors',
    'Financial Services',
    'Consumer Cyclical',
    'Consumer Defensive',
    'Communication',
    'Entertainment',
    'Automotive',
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#0B1120] via-slate-900 to-[#0B1120] border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 font-mono text-xs rounded-full border border-cyan-500/20">
            Simulated Live Equities Feed
          </span>
          <h1 className="text-3xl font-extrabold font-heading text-white mt-2">
            Global Market Directory
          </h1>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            Explore 30 institutional-grade demo assets. Select any stock to analyze pricing, trend lines, and execute instant trades.
          </p>
        </div>
        <button
          onClick={fetchStocks}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl self-start md:self-auto transition"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Refresh Quotes
        </button>
      </div>

      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search symbol or company..."
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
          />
        </div>

        {/* Sector Filter */}
        <div className="relative">
          <Filter size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none cursor-pointer"
          >
            {sectorsList.map((sec) => (
              <option key={sec} value={sec} className="bg-slate-900 text-white">
                {sec === 'ALL' ? 'All Sectors' : sec}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div className="relative">
          <ArrowUpDown size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs appearance-none cursor-pointer"
          >
            <option value="name_asc" className="bg-slate-900 text-white">Company Name (A-Z)</option>
            <option value="change_desc" className="bg-slate-900 text-white">Top Gainers (%)</option>
            <option value="change_asc" className="bg-slate-900 text-white">Top Losers (%)</option>
            <option value="price_desc" className="bg-slate-900 text-white">Price: High to Low</option>
            <option value="price_asc" className="bg-slate-900 text-white">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Stocks Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-44 bg-slate-900/50 rounded-2xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : stocks.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800">
          <p className="text-slate-400 font-semibold">No stocks found matching your criteria</p>
          <button
            onClick={() => {
              setSearch('');
              setSector('ALL');
            }}
            className="mt-3 text-xs text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stocks.map((stock) => (
            <StockCard
              key={stock._id}
              stock={stock}
              inWatchlist={watchlistIds.includes(stock._id)}
              onToggleWatchlist={toggleWatchlist}
              onTrade={(s) => setSelectedStock(s)}
            />
          ))}
        </div>
      )}

      {/* Trade Modal */}
      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
        />
      )}
    </div>
  );
};
