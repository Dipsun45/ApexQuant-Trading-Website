import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MarketTicker = () => {
  const [tickerStocks, setTickerStocks] = useState([]);
  const { socket } = useAuth();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await API.get('/stocks?limit=15');
        if (res.data && res.data.success) {
          setTickerStocks(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load ticker stocks:', err);
      }
    };
    fetchStocks();
  }, []);

  // Listen to socket live updates
  useEffect(() => {
    if (!socket) return;

    const handleMarketUpdate = (updatedList) => {
      setTickerStocks((prev) => {
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
    return () => {
      socket.off('market_update', handleMarketUpdate);
    };
  }, [socket]);

  if (tickerStocks.length === 0) return null;

  // Duplicate list for seamless infinite loop ticker tape
  const displayList = [...tickerStocks, ...tickerStocks];

  return (
    <div className="w-full bg-[#0B1120]/90 border-y border-slate-800/80 overflow-hidden py-2 text-xs font-mono select-none">
      <div className="animate-ticker flex whitespace-nowrap gap-6 items-center">
        {displayList.map((s, idx) => {
          const isPos = s.dailyChange >= 0;
          return (
            <div key={`${s.symbol}-${idx}`} className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 rounded-md border border-slate-800">
              <span className="font-bold text-slate-200">{s.symbol}</span>
              <span className="text-slate-400">${s.currentPrice?.toFixed(2)}</span>
              <span className={`flex items-center text-[11px] font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPos ? <TrendingUp size={12} className="mr-0.5" /> : <TrendingDown size={12} className="mr-0.5" />}
                {isPos ? '+' : ''}{s.dailyChangePercent?.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
