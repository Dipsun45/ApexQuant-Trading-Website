import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { TradeModal } from '../components/TradeModal';
import { Layers, TrendingUp, TrendingDown, ShoppingBag, ArrowUpRight, Plus, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export const HoldingsPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [initialType, setInitialType] = useState('BUY');

  const fetchHoldings = async () => {
    setLoading(true);
    try {
      const res = await API.get('/portfolio');
      if (res.data && res.data.success) {
        setPortfolioData(res.data.data);
        setHoldings(res.data.data.holdings || []);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load active holdings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldings();
  }, []);

  const handleOpenTrade = (stockObj, type) => {
    setSelectedStock(stockObj);
    setInitialType(type);
  };

  return (
    <div className="space-y-8">
      {/* Title & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={24} /> My Bought Shares & Positions
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Track all active share positions, average buy prices, and current market returns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchHoldings}
            className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl transition"
            title="Refresh Holdings"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link
            to="/dashboard/trade"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg transition"
          >
            <ShoppingBag size={16} /> Buy New Shares
          </Link>
        </div>
      </div>

      {/* Summary Stat Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block mb-1">Total Holdings Value</span>
          <span className="text-2xl font-extrabold text-white font-mono">
            ${(portfolioData?.currentValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block mb-1">Total Capital Invested</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">
            ${(portfolioData?.totalInvested || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block mb-1">Total Profit / Loss</span>
          <span className={`text-2xl font-extrabold font-mono ${(portfolioData?.totalProfitLoss || 0) >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {(portfolioData?.totalProfitLoss || 0) >= 0 ? '+' : ''}${(portfolioData?.totalProfitLoss || 0).toLocaleString()}
          </span>
        </div>
        <div className="p-5 bg-[#0B1120] border border-slate-800 rounded-2xl">
          <span className="text-xs text-slate-400 block mb-1">Active Positions</span>
          <span className="text-2xl font-extrabold text-amber-400 font-mono">
            {holdings.length} Shares
          </span>
        </div>
      </div>

      {/* Holdings Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-56 bg-slate-900/50 rounded-3xl animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : holdings.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
          <Layers size={40} className="text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold font-heading text-white">You don't own any shares yet</h3>
          <p className="text-slate-400 text-xs max-w-md mx-auto">
            Explore the global equity directory and use your virtual trading cash to place your first order.
          </p>
          <Link
            to="/dashboard/trade"
            className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg transition"
          >
            Buy Shares Now
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {holdings.map((h) => {
            const isPos = h.profitLoss >= 0;
            const stockObj = h.stock || { _id: h.stock?._id, symbol: h.symbol, currentPrice: h.currentPrice, name: h.symbol };
            return (
              <div key={h._id} className="p-6 bg-[#0B1120] border border-slate-800 hover:border-slate-700 rounded-3xl space-y-4 shadow-xl transition flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 font-mono font-bold text-cyan-400 text-base flex items-center justify-center border border-slate-700">
                        {h.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-white text-base">{h.stock?.name || h.symbol}</h3>
                        <p className="text-xs text-slate-400 font-mono">{h.symbol} • {h.stock?.sector || 'Equities'}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-slate-900 border border-slate-800 text-cyan-400 font-mono text-xs font-bold rounded-xl">
                      {h.quantity} Shares
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs font-mono mb-4">
                    <div>
                      <span className="text-slate-500 text-[10px] block">AVG BUY PRICE</span>
                      <span className="text-slate-300 font-semibold">${h.averageBuyPrice?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">CURRENT PRICE</span>
                      <span className="text-white font-bold">${h.currentPrice?.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">TOTAL VALUE</span>
                      <span className="text-cyan-400 font-bold">${h.currentValue?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">RETURN (P/L)</span>
                      <span className={`font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                        {isPos ? '+' : ''}${h.profitLoss?.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenTrade(stockObj, 'BUY')}
                    className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Buy More
                  </button>
                  <button
                    onClick={() => handleOpenTrade(stockObj, 'SELL')}
                    className="py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center gap-1"
                  >
                    <TrendingDown size={14} /> Sell Shares
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedStock && (
        <TradeModal
          stock={selectedStock}
          initialType={initialType}
          onClose={() => setSelectedStock(null)}
          onSuccess={fetchHoldings}
        />
      )}
    </div>
  );
};
