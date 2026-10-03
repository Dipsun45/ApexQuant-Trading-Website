const User = require('../models/User');
const Stock = require('../models/Stock');
const Trade = require('../models/Trade');
const Holding = require('../models/Holding');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { notifyUser } = require('../services/socketService');

// Helper to recalculate user's portfolio summary
const recalculatePortfolio = async (userId) => {
  const holdings = await Holding.find({ user: userId, quantity: { $gt: 0 } }).populate('stock');
  let totalInvested = 0;
  let currentValue = 0;

  for (const h of holdings) {
    totalInvested += h.totalInvested || (h.averageBuyPrice * h.quantity);
    const price = h.stock ? h.stock.currentPrice : h.averageBuyPrice;
    currentValue += price * h.quantity;
  }

  const totalProfitLoss = Math.round((currentValue - totalInvested) * 100) / 100;
  const totalProfitLossPercentage = totalInvested > 0
    ? Math.round(((currentValue - totalInvested) / totalInvested) * 10000) / 100
    : 0;

  let portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) {
    portfolio = new Portfolio({ user: userId });
  }

  portfolio.totalInvested = Math.round(totalInvested * 100) / 100;
  portfolio.currentValue = Math.round(currentValue * 100) / 100;
  portfolio.totalProfitLoss = totalProfitLoss;
  portfolio.totalProfitLossPercentage = totalProfitLossPercentage;

  await portfolio.save();
  return portfolio;
};

// @desc    Execute BUY order
// @route   POST /api/trades/buy
// @access  Private
const buyStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.user._id;

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock || !stock.isActive) {
      return res.status(404).json({ success: false, message: 'Stock not available for trading' });
    }

    if (stock.marketStatus === 'HALTED') {
      return res.status(400).json({ success: false, message: 'Trading for this stock is currently HALTED' });
    }

    const price = stock.currentPrice;
    const totalAmount = Math.round(price * qty * 100) / 100;

    const user = await User.findById(userId);
    if (user.balance < totalAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Required: $${totalAmount.toLocaleString()}, Available: $${user.balance.toLocaleString()}`,
      });
    }

    // 1. Deduct balance
    user.balance = Math.round((user.balance - totalAmount) * 100) / 100;
    await user.save();

    // 2. Update or Create Holding
    let holding = await Holding.findOne({ user: userId, stock: stock._id });
    if (holding) {
      const oldQty = holding.quantity;
      const oldTotal = holding.averageBuyPrice * oldQty;
      const newQty = oldQty + qty;
      const newAvgPrice = Math.round(((oldTotal + totalAmount) / newQty) * 100) / 100;

      holding.quantity = newQty;
      holding.averageBuyPrice = newAvgPrice;
      holding.totalInvested = Math.round((holding.totalInvested + totalAmount) * 100) / 100;
      await holding.save();
    } else {
      holding = await Holding.create({
        user: userId,
        stock: stock._id,
        symbol: stock.symbol,
        quantity: qty,
        averageBuyPrice: price,
        totalInvested: totalAmount,
      });
    }

    // 3. Create Trade record
    const trade = await Trade.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      companyName: stock.name,
      type: 'BUY',
      quantity: qty,
      entryPrice: price,
      currentPrice: price,
      totalAmount,
      status: 'OPEN',
    });

    // 4. Create Transaction record
    const transaction = await Transaction.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'BUY',
      quantity: qty,
      price,
      total: totalAmount,
      status: 'COMPLETED',
      description: `Bought ${qty} shares of ${stock.symbol} @ $${price}`,
    });

    // 5. Update Portfolio totals
    await recalculatePortfolio(userId);

    // 6. Notification
    await Notification.create({
      user: userId,
      title: 'Order Executed: BUY',
      message: `Successfully bought ${qty} shares of ${stock.symbol} for $${totalAmount.toLocaleString()}`,
      type: 'SUCCESS',
    });

    notifyUser(userId, 'trade_executed', { trade, transaction });

    res.status(201).json({
      success: true,
      message: `Successfully bought ${qty} shares of ${stock.symbol}`,
      data: {
        trade,
        transaction,
        remainingBalance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute buy order',
    });
  }
};

// @desc    Execute SELL order
// @route   POST /api/trades/sell
// @access  Private
const sellStock = async (req, res) => {
  try {
    const { stockId, quantity } = req.body;
    const userId = req.user._id;

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      return res.status(400).json({ success: false, message: 'Quantity must be a positive integer' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const holding = await Holding.findOne({ user: userId, stock: stock._id });
    if (!holding || holding.quantity < qty) {
      const currentQty = holding ? holding.quantity : 0;
      return res.status(400).json({
        success: false,
        message: `Insufficient holdings. You own ${currentQty} shares of ${stock.symbol}`,
      });
    }

    const price = stock.currentPrice;
    const totalAmount = Math.round(price * qty * 100) / 100;
    const costBasis = Math.round(holding.averageBuyPrice * qty * 100) / 100;
    const realizedPL = Math.round((totalAmount - costBasis) * 100) / 100;
    const realizedPLPercent = costBasis > 0 ? Math.round(((totalAmount - costBasis) / costBasis) * 10000) / 100 : 0;

    // 1. Add balance to user cash
    const user = await User.findById(userId);
    user.balance = Math.round((user.balance + totalAmount) * 100) / 100;
    await user.save();

    // 2. Reduce Holding quantity
    holding.quantity -= qty;
    holding.totalInvested = Math.round(holding.averageBuyPrice * holding.quantity * 100) / 100;

    if (holding.quantity <= 0) {
      await Holding.findByIdAndDelete(holding._id);
    } else {
      await holding.save();
    }

    // 3. Create Trade record
    const trade = await Trade.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      companyName: stock.name,
      type: 'SELL',
      quantity: qty,
      entryPrice: holding.averageBuyPrice,
      currentPrice: price,
      exitPrice: price,
      totalAmount,
      profitLoss: realizedPL,
      profitLossPercentage: realizedPLPercent,
      status: realizedPL >= 0 ? 'PROFIT' : 'LOSS',
    });

    // 4. Create Transaction record
    const transaction = await Transaction.create({
      user: userId,
      stock: stock._id,
      symbol: stock.symbol,
      type: 'SELL',
      quantity: qty,
      price,
      total: totalAmount,
      status: 'COMPLETED',
      description: `Sold ${qty} shares of ${stock.symbol} @ $${price} (P/L: $${realizedPL})`,
    });

    // 5. Update Portfolio
    await recalculatePortfolio(userId);

    // 6. Notification
    await Notification.create({
      user: userId,
      title: 'Order Executed: SELL',
      message: `Successfully sold ${qty} shares of ${stock.symbol} for $${totalAmount.toLocaleString()} (P/L: $${realizedPL})`,
      type: realizedPL >= 0 ? 'SUCCESS' : 'WARNING',
    });

    notifyUser(userId, 'trade_executed', { trade, transaction });

    res.status(200).json({
      success: true,
      message: `Successfully sold ${qty} shares of ${stock.symbol}`,
      data: {
        trade,
        transaction,
        newBalance: user.balance,
        realizedPL,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to execute sell order',
    });
  }
};

// @desc    Get user trades
// @route   GET /api/trades/my-trades
// @access  Private
const getMyTrades = async (req, res) => {
  try {
    const { status, type, search } = req.query;
    const query = { user: req.user._id };

    if (status && status !== 'ALL') query.status = status;
    if (type && type !== 'ALL') query.type = type;
    if (search) {
      query.symbol = { $regex: search, $options: 'i' };
    }

    const trades = await Trade.find(query)
      .sort({ createdAt: -1 })
      .populate('stock', 'name symbol logo currentPrice');

    res.json({
      success: true,
      count: trades.length,
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all trades (Admin)
// @route   GET /api/admin/trades
// @access  Private/Admin
const getAdminTrades = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const { status, type, search } = req.query;
    const query = {};

    if (status && status !== 'ALL') query.status = status;
    if (type && type !== 'ALL') query.type = type;
    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { tradeId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Trade.countDocuments(query);
    const trades = await Trade.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email balance')
      .populate('stock', 'name symbol currentPrice');

    res.json({
      success: true,
      count: trades.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: trades,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update trade status & profit/loss (Admin)
// @route   PUT /api/admin/trades/:id
// @access  Private/Admin
const updateTradeByAdmin = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade) {
      return res.status(404).json({ success: false, message: 'Trade not found' });
    }

    const { status, currentPrice, profitLoss, notes } = req.body;

    if (status) trade.status = status;
    if (currentPrice !== undefined) trade.currentPrice = parseFloat(currentPrice);
    if (profitLoss !== undefined) {
      trade.profitLoss = parseFloat(profitLoss);
      trade.profitLossPercentage = trade.totalAmount > 0
        ? Math.round((trade.profitLoss / trade.totalAmount) * 10000) / 100
        : 0;
    }
    if (notes !== undefined) trade.notes = notes;

    await trade.save();

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_TRADE_STATUS',
      target: trade.tradeId,
      description: `Admin updated trade ${trade.tradeId} status to ${trade.status} (P/L: $${trade.profitLoss})`,
    });

    await Notification.create({
      user: trade.user,
      title: 'Trade Status Updated',
      message: `Your trade ${trade.tradeId} for ${trade.symbol} status has been updated to ${trade.status}`,
      type: 'INFO',
    });

    notifyUser(trade.user.toString(), 'trade_updated', trade);

    res.json({
      success: true,
      message: 'Trade updated successfully',
      data: trade,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  buyStock,
  sellStock,
  getMyTrades,
  getAdminTrades,
  updateTradeByAdmin,
};
