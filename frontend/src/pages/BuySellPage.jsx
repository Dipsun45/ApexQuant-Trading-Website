import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const BuySellPage = () => {
  const { user, updateUser, socket } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [search, setSearch] = useState('');
  const [tradeType, setTradeType] = useState('BUY');
  const [quantity, setQuantity] = useState(1);
  const [holding, setHolding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stocksLoading, setStocksLoading] = useState(true);

  // Fetch stocks list
  const fetchStocks = async () => {
    setStocksLoading(true);
    try {
      const res = await API.get('/stocks?limit=100');
      if (res.data && res.data.success) {
        setStocks(res.data.data);
        if (!selectedStock && res.data.data.length > 0) {
          setSelectedStock(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load market shares');
    } finally {
      setStocksLoading(false);
    }
  };

  // Fetch user holding position in selected stock
  const fetchPosition = async (stockObj) => {
    if (!stockObj) return;
    try {
      const res = await API.get('/portfolio');
      if (res.data && res.data.success) {
        const holdingsList = res.data.data.holdings || [];
        const found = holdingsList.find((h) => h.symbol === stockObj.symbol);
        setHolding(found || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchPosition(selectedStock);
    }
  }, [selectedStock]);

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
        const newList = Array.from(map.values());
        if (selectedStock) {
          const updatedSelected = newList.find((s) => s.symbol === selectedStock.symbol);
          if (updatedSelected) setSelectedStock(updatedSelected);
        }
        return newList;
      });
    };

    socket.on('market_update', handleMarketUpdate);
    return () => socket.off('market_update', handleMarketUpdate);
  }, [socket, selectedStock]);

  const filteredStocks = stocks.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  const currentPrice = selectedStock?.currentPrice || 0;
  const totalAmount = Math.round(currentPrice * (parseInt(quantity) || 0) * 100) / 100;
  const userBalance = user?.balance || 0;
  const ownedShares = holding?.quantity || 0;

  const handleExecuteTrade = async (e) => {
    e.preventDefault();

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      toast.error('Please enter a valid share quantity');
      return;
    }

    if (tradeType === 'BUY' && userBalance < totalAmount) {
      toast.error(`Insufficient balance. Required: $${totalAmount.toLocaleString()}, Available: $${userBalance.toLocaleString()}`);
      return;
    }

    if (tradeType === 'SELL' && ownedShares < qty) {
      toast.error(`Insufficient shares. You currently own ${ownedShares} shares of ${selectedStock.symbol}`);
      return;
    }

    setLoading(true);
    try {
      const endpoint = tradeType === 'BUY' ? '/trades/buy' : '/trades/sell';
      const res = await API.post(endpoint, {
        stockId: selectedStock._id,
        quantity: qty,
      });

      if (res.data && res.data.success) {
        toast.success(res.data.message);
        if (res.data.data?.remainingBalance !== undefined) {
          updateUser({ balance: res.data.data.remainingBalance });
        } else if (res.data.data?.newBalance !== undefined) {
          updateUser({ balance: res.data.data.newBalance });
        }
        fetchPosition(selectedStock);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Trade execution failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <ShoppingBag className="text-cyan-400" size={24} /> Buy & Sell Trading Terminal
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Execute real-time order transactions, buy market equities, and liquidate position holdings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Stock Picker List (1 Col) */}
        <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-4 flex flex-col h-[600px]">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symbol or name..."
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-xs"
            />
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {stocksLoading ? (
              <div className="p-6 text-center text-slate-500 text-xs">Loading market directory...</div>
            ) : filteredStocks.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">No shares found</div>
            ) : (
              filteredStocks.map((s) => {
                const isSelected = selectedStock?._id === s._id;
                const isPos = s.dailyChange >= 0;
                return (
                  <div
                    key={s._id}
                    onClick={() => setSelectedStock(s)}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-cyan-500 shadow-lg'
                        : 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 font-mono font-bold text-xs text-cyan-400 flex items-center justify-center border border-slate-700">
                        {s.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white font-heading">{s.symbol}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{s.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono text-white">${s.currentPrice?.toFixed(2)}</p>
                      <p className={`text-[10px] font-mono font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}{s.dailyChangePercent?.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Selected Stock Details & Order Form (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {selectedStock && (
            <div className="p-6 bg-[#0B1120] border border-slate-800 rounded-3xl space-y-6">
              {/* Stock Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center font-mono font-extrabold text-cyan-400 text-xl shadow-lg">
                    {selectedStock.symbol}
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold font-heading text-white">{selectedStock.name}</h2>
                    <p className="text-xs text-slate-400 font-mono">
                      {selectedStock.symbol} • <span className="text-cyan-400">{selectedStock.sector}</span>
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-2xl font-extrabold text-white font-mono block">
                    ${selectedStock.currentPrice?.toFixed(2)}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      selectedStock.dailyChange >= 0
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {selectedStock.dailyChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {selectedStock.dailyChange >= 0 ? '+' : ''}{selectedStock.dailyChangePercent?.toFixed(2)}% Intraday
                  </span>
                </div>
              </div>

              {/* Order Form */}
              <form onSubmit={handleExecuteTrade} className="space-y-6">
                {/* BUY / SELL Tabs */}
                <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTradeType('BUY')}
                    className={`py-3 rounded-xl font-heading font-bold text-sm transition flex items-center justify-center gap-2 ${
                      tradeType === 'BUY'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingUp size={18} /> BUY SHARES
                  </button>
                  <button
                    type="button"
                    onClick={() => setTradeType('SELL')}
                    className={`py-3 rounded-xl font-heading font-bold text-sm transition flex items-center justify-center gap-2 ${
                      tradeType === 'SELL'
                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <TrendingDown size={18} /> SELL SHARES
                  </button>
                </div>

                {/* Balance & Holding Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-xs block mb-1">Available Cash Balance</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
                    <span className="text-slate-400 text-xs block mb-1">Shares Currently Owned</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">
                      {ownedShares} shares
                    </span>
                  </div>
                </div>

                {/* Quantity input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">
                    Enter Number of Shares to {tradeType}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full glass-input px-4 py-3 rounded-xl font-mono text-base text-white focus:outline-none"
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                {/* Order Summary */}
                <div className="p-5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-3 font-mono">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Current Unit Price</span>
                    <span className="text-white">${currentPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Transaction Fee</span>
                    <span className="text-emerald-400">$0.00 (Free)</span>
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="font-heading font-bold text-white text-sm">Estimated Total</span>
                    <span className="text-2xl font-extrabold text-cyan-400 font-mono">
                      ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-white font-heading font-bold text-base rounded-2xl transition shadow-xl flex items-center justify-center gap-2 ${
                    tradeType === 'BUY'
                      ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                      : 'bg-red-600 hover:bg-red-500 shadow-red-600/30'
                  }`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Confirm {tradeType} Order for {selectedStock.symbol}</>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
