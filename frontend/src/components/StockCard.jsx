import React from 'react';
import { TrendingUp, TrendingDown, ArrowUpRight, Plus, Check } from 'lucide-react';

export const StockCard = ({ stock, onTrade, inWatchlist, onToggleWatchlist }) => {
  const isPos = stock.dailyChange >= 0;

  // Render SVG mini sparkline based on price history
  const renderSparkline = () => {
    if (!stock.priceHistory || stock.priceHistory.length < 2) {
      return (
        <svg className="w-24 h-8" viewBox="0 0 100 30">
          <path d="M 0 15 Q 25 10, 50 20 T 100 15" fill="none" stroke={isPos ? '#10B981' : '#EF4444'} strokeWidth="2" />
        </svg>
      );
    }

    const prices = stock.priceHistory.map((p) => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min || 1;

    const points = prices.map((price, idx) => {
      const x = (idx / (prices.length - 1)) * 90 + 5;
      const y = 25 - ((price - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-24 h-8 overflow-visible" viewBox="0 0 100 30">
        <polyline
          fill="none"
          stroke={isPos ? '#10B981' : '#EF4444'}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-slate-700 relative group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center font-bold font-mono text-cyan-400 text-sm shadow-inner">
              {stock.symbol.substring(0, 3)}
            </div>
            <div>
              <h4 className="font-heading font-semibold text-white text-sm line-clamp-1 group-hover:text-cyan-300 transition">
                {stock.name}
              </h4>
              <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                {stock.symbol} • <span className="text-slate-500">{stock.sector}</span>
              </span>
            </div>
          </div>

          {onToggleWatchlist && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(stock._id);
              }}
              className={`p-1.5 rounded-lg border transition ${
                inWatchlist
                  ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check size={14} /> : <Plus size={14} />}
            </button>
          )}
        </div>

        <div className="flex items-baseline justify-between my-2">
          <div>
            <span className="text-xl font-extrabold text-white font-mono">
              ${stock.currentPrice?.toFixed(2)}
            </span>
          </div>
          <div>{renderSparkline()}</div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between mt-2">
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold font-mono ${
            isPos ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
          }`}
        >
          {isPos ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {isPos ? '+' : ''}{stock.dailyChangePercent?.toFixed(2)}%
        </span>

        {onTrade && (
          <button
            onClick={() => onTrade(stock)}
            className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md transition"
          >
            Trade <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
