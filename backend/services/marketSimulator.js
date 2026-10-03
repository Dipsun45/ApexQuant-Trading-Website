const Stock = require('../models/Stock');
const { broadcastMarketUpdate } = require('./socketService');

let intervalId = null;

const startMarketSimulator = () => {
  if (intervalId) return;

  console.log('🚀 ApexQuant Market Price Simulator Started');

  intervalId = setInterval(async () => {
    try {
      const stocks = await Stock.find({ isActive: true });
      if (!stocks || stocks.length === 0) return;

      // Select 4-6 random stocks to fluctuate
      const countToUpdate = Math.min(6, stocks.length);
      const shuffled = [...stocks].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, countToUpdate);

      const updatedStocks = [];

      for (const stock of selected) {
        // Random percentage change between -1.5% and +1.5%
        const deltaPercent = (Math.random() * 3.0 - 1.48) / 100;
        const oldPrice = stock.currentPrice;
        let newPrice = Math.round((oldPrice * (1 + deltaPercent)) * 100) / 100;

        if (newPrice <= 0.5) newPrice = 0.5; // price floor safeguard

        const dailyChange = Math.round((newPrice - stock.openPrice) * 100) / 100;
        const dailyChangePercent = stock.openPrice > 0
          ? Math.round(((newPrice - stock.openPrice) / stock.openPrice) * 10000) / 100
          : 0;

        stock.previousPrice = oldPrice;
        stock.currentPrice = newPrice;
        stock.dailyChange = dailyChange;
        stock.dailyChangePercent = dailyChangePercent;

        if (newPrice > stock.highPrice) stock.highPrice = newPrice;
        if (newPrice < stock.lowPrice || stock.lowPrice === 0) stock.lowPrice = newPrice;

        // Keep last 30 price history points
        if (!stock.priceHistory) stock.priceHistory = [];
        stock.priceHistory.push({ price: newPrice, timestamp: new Date() });
        if (stock.priceHistory.length > 30) {
          stock.priceHistory.shift();
        }

        await stock.save();
        updatedStocks.push({
          _id: stock._id,
          symbol: stock.symbol,
          currentPrice: stock.currentPrice,
          previousPrice: stock.previousPrice,
          dailyChange: stock.dailyChange,
          dailyChangePercent: stock.dailyChangePercent,
          highPrice: stock.highPrice,
          lowPrice: stock.lowPrice,
          updatedAt: stock.updatedAt
        });
      }

      if (updatedStocks.length > 0) {
        broadcastMarketUpdate(updatedStocks);
      }
    } catch (err) {
      console.error('Error in market simulator:', err.message);
    }
  }, 5000);
};

module.exports = { startMarketSimulator };
