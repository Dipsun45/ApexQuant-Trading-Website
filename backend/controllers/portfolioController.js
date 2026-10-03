const User = require('../models/User');
const Holding = require('../models/Holding');
const Portfolio = require('../models/Portfolio');

// @desc    Get user portfolio & analytics
// @route   GET /api/portfolio
// @access  Private
const getPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('balance name email');
    const holdings = await Holding.find({ user: userId, quantity: { $gt: 0 } }).populate('stock');

    let totalInvested = 0;
    let currentValue = 0;
    let todaysProfitLoss = 0;

    const holdingDetails = holdings.map((h) => {
      const stock = h.stock;
      const currentPrice = stock ? stock.currentPrice : h.averageBuyPrice;
      const prevPrice = stock ? stock.previousPrice || currentPrice : currentPrice;
      
      const holdingInvested = Math.round(h.averageBuyPrice * h.quantity * 100) / 100;
      const holdingValue = Math.round(currentPrice * h.quantity * 100) / 100;
      const profitLoss = Math.round((holdingValue - holdingInvested) * 100) / 100;
      const profitLossPercentage = holdingInvested > 0
        ? Math.round(((holdingValue - holdingInvested) / holdingInvested) * 10000) / 100
        : 0;

      const todaysChangeForHolding = stock
        ? Math.round((currentPrice - prevPrice) * h.quantity * 100) / 100
        : 0;

      totalInvested += holdingInvested;
      currentValue += holdingValue;
      todaysProfitLoss += todaysChangeForHolding;

      return {
        _id: h._id,
        stock: stock ? {
          _id: stock._id,
          name: stock.name,
          symbol: stock.symbol,
          currentPrice: stock.currentPrice,
          dailyChange: stock.dailyChange,
          dailyChangePercent: stock.dailyChangePercent,
          sector: stock.sector,
          logo: stock.logo,
        } : null,
        symbol: h.symbol,
        quantity: h.quantity,
        averageBuyPrice: h.averageBuyPrice,
        currentPrice,
        totalInvested: holdingInvested,
        currentValue: holdingValue,
        profitLoss,
        profitLossPercentage,
      };
    });

    totalInvested = Math.round(totalInvested * 100) / 100;
    currentValue = Math.round(currentValue * 100) / 100;
    const totalProfitLoss = Math.round((currentValue - totalInvested) * 100) / 100;
    const totalProfitLossPercentage = totalInvested > 0
      ? Math.round(((currentValue - totalInvested) / totalInvested) * 10000) / 100
      : 0;

    const totalPortfolioValue = Math.round((currentValue + user.balance) * 100) / 100;

    // Asset allocation by Sector & Stock
    const sectorAllocationMap = {};
    holdingDetails.forEach((h) => {
      const sector = (h.stock && h.stock.sector) || 'Other';
      sectorAllocationMap[sector] = (sectorAllocationMap[sector] || 0) + h.currentValue;
    });

    const sectorAllocation = Object.keys(sectorAllocationMap).map((sector) => ({
      name: sector,
      value: sectorAllocationMap[sector],
      percentage: currentValue > 0
        ? Math.round((sectorAllocationMap[sector] / currentValue) * 10000) / 100
        : 0,
    }));

    // Risk Overview & Metrics
    let largestHolding = null;
    let maxHoldingVal = 0;
    holdingDetails.forEach((h) => {
      if (h.currentValue > maxHoldingVal) {
        maxHoldingVal = h.currentValue;
        largestHolding = { symbol: h.symbol, value: h.currentValue };
      }
    });

    const largestHoldingPercentage = currentValue > 0 && largestHolding
      ? Math.round((largestHolding.value / currentValue) * 10000) / 100
      : 0;

    res.json({
      success: true,
      data: {
        balance: user.balance,
        totalInvested,
        currentValue,
        totalPortfolioValue,
        totalProfitLoss,
        totalProfitLossPercentage,
        todaysProfitLoss: Math.round(todaysProfitLoss * 100) / 100,
        holdings: holdingDetails,
        sectorAllocation,
        analytics: {
          positionsCount: holdingDetails.length,
          largestHolding: largestHolding ? `${largestHolding.symbol} (${largestHoldingPercentage}%)` : 'None',
          largestHoldingPercentage,
          cashPercentage: totalPortfolioValue > 0
            ? Math.round((user.balance / totalPortfolioValue) * 10000) / 100
            : 100,
          investedPercentage: totalPortfolioValue > 0
            ? Math.round((currentValue / totalPortfolioValue) * 10000) / 100
            : 0,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPortfolio,
};
