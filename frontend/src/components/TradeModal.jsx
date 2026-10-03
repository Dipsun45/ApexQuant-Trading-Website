import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { X, TrendingUp, TrendingDown, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const TradeModal = ({ stock, initialType = 'BUY', onClose, onSuccess }) => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const [tradeType, setTradeType] = useState(initialType);
  const [quantity, setQuantity] = useState(1);
  const [holding, setHolding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch current user position in this stock if logged in
  useEffect(() => {
    const fetchUserPosition = async () => {
      if (isAuthenticated && stock) {
        try {
          const res = await API.get('/portfolio');
          if (res.data && res.data.success) {
            const holdings = res.data.data.holdings || [];
            const found = holdings.find((h) => h.symbol === stock.symbol);
            setHolding(found || null);
          }
        } catch (err) {
          console.error('Failed to fetch holding position:', err);
        }
      }
    };
    fetchUserPosition();
  }, [isAuthenticated, stock]);

  if (!stock) return null;

  const currentPrice = stock.currentPrice || 0;
  const totalAmount = Math.round(currentPrice * (parseInt(quantity) || 0) * 100) / 100;
  const userBalance = user?.balance || 0;
  const ownedShares = holding?.quantity || 0;

  const handleExecuteTrade = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!isAuthenticated) {
      toast.error('Please log in to place trades');
      return;
    }

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setErrorMsg('Please enter a valid quantity greater than 0');
      return;
    }

    if (tradeType === 'BUY' && userBalance < totalAmount) {
      setErrorMsg(`Insufficient cash balance ($${userBalance.toLocaleString()}). Required: $${totalAmount.toLocaleString()}`);
      return;
    }

    if (tradeType === 'SELL' && ownedShares < qty) {
      setErrorMsg(`Insufficient holdings. You own ${ownedShares} shares of ${stock.symbol}`);
      return;
    }

    setLoading(true);
    try {
      const endpoint = tradeType === 'BUY' ? '/trades/buy' : '/trades/sell';
      const res = await API.post(endpoint, {
        stockId: stock._id,
        quantity: qty,
      });

      if (res.data && res.data.success) {
        toast.success(res.data.message);
        if (res.data.data?.remainingBalance !== undefined) {
          updateUser({ balance: res.data.data.remainingBalance });
        } else if (res.data.data?.newBalance !== undefined) {
          updateUser({ balance: res.data.data.newBalance });
        }

        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Trade execution failed';
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0B1120] border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl glass-panel relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center font-mono font-bold text-cyan-400 text-lg">
              {stock.symbol}
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">{stock.name}</h3>
              <p className="text-xs text-slate-400 font-mono">
                Market Price: <span className="text-white font-semibold">${currentPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Trade Type Selector */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setTradeType('BUY');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl font-heading font-semibold text-sm transition flex items-center justify-center gap-2 ${
                tradeType === 'BUY'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp size={16} /> BUY ORDER
            </button>
            <button
              type="button"
              onClick={() => {
                setTradeType('SELL');
                setErrorMsg('');
              }}
              className={`py-2.5 rounded-xl font-heading font-semibold text-sm transition flex items-center justify-center gap-2 ${
                tradeType === 'SELL'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown size={16} /> SELL ORDER
            </button>
          </div>

          {/* Balance / Position stats */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Available Cash</span>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                ${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block mb-1">Owned Shares</span>
              <span className="text-sm font-bold text-cyan-400 font-mono">{ownedShares} shares</span>
            </div>
          </div>

          <form onSubmit={handleExecuteTrade} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Order Quantity (Shares)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={tradeType === 'SELL' ? ownedShares || 1 : 100000}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full glass-input px-4 py-3 rounded-xl font-mono text-white focus:outline-none"
                  placeholder="Enter quantity"
                  required
                />
              </div>
            </div>

            {/* Total calculation */}
            <div className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Execution Price</span>
                <span className="font-mono text-slate-200">${currentPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>Estimated Commission</span>
                <span className="font-mono text-emerald-400">$0.00 (Zero Fee)</span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="font-heading font-semibold text-white text-sm">Total Transaction</span>
                <span className="text-lg font-extrabold text-cyan-400 font-mono">
                  ${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-2/3 py-3 text-white font-heading font-bold text-sm rounded-xl transition shadow-lg flex items-center justify-center gap-2 ${
                  tradeType === 'BUY'
                    ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/25'
                    : 'bg-red-600 hover:bg-red-500 shadow-red-600/25'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Confirm {tradeType} Order</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
