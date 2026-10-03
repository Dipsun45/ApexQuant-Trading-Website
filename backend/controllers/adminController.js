const User = require('../models/User');
const Stock = require('../models/Stock');
const Trade = require('../models/Trade');
const Transaction = require('../models/Transaction');
const Holding = require('../models/Holding');
const AuditLog = require('../models/AuditLog');

// @desc    Get real live admin dashboard statistics & chart datasets
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalStocks = await Stock.countDocuments();
    const totalTrades = await Trade.countDocuments();
    const profitableTrades = await Trade.countDocuments({ status: 'PROFIT' });
    const lossTrades = await Trade.countDocuments({ status: 'LOSS' });
    const pendingTrades = await Trade.countDocuments({ status: 'PENDING' });
    const openTrades = await Trade.countDocuments({ status: 'OPEN' });

    // Aggregate total trading volume
    const volumeAgg = await Trade.aggregate([
      { $group: { _id: null, totalVolume: { $sum: '$totalAmount' } } },
    ]);
    const totalTradingVolume = volumeAgg.length > 0 ? Math.round(volumeAgg[0].totalVolume * 100) / 100 : 0;

    // Aggregate Deposits
    const depositAgg = await Transaction.aggregate([
      { $match: { type: 'DEPOSIT', status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalDeposits = depositAgg.length > 0 ? depositAgg[0].total : 0;

    // Aggregate Withdrawals
    const withdrawalAgg = await Transaction.aggregate([
      { $match: { type: 'WITHDRAWAL', status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    const totalWithdrawals = withdrawalAgg.length > 0 ? withdrawalAgg[0].total : 0;

    // Buy vs Sell trade count
    const buyTradesCount = await Trade.countDocuments({ type: 'BUY' });
    const sellTradesCount = await Trade.countDocuments({ type: 'SELL' });

    // Top traded stocks
    const topTradedStocks = await Trade.aggregate([
      { $group: { _id: '$symbol', count: { $sum: 1 }, totalVol: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 1. CHART DATASET: Stock Market Sector Distribution
    const sectorDistribution = await Stock.aggregate([
      { $group: { _id: '$sector', count: { $sum: 1 }, avgPrice: { $avg: '$currentPrice' } } },
      { $sort: { count: -1 } },
    ]);

    // 2. CHART DATASET: Trade Outcomes Breakdown
    const tradeStatusBreakdown = [
      { name: 'Profitable', value: profitableTrades, color: '#10B981' },
      { name: 'Loss', value: lossTrades, color: '#EF4444' },
      { name: 'Pending', value: pendingTrades, color: '#F59E0B' },
      { name: 'Open Positions', value: openTrades, color: '#3B82F6' },
    ];

    // 3. CHART DATASET: Top Stock Holdings Across All Users
    const topStockHoldings = await Holding.aggregate([
      { $match: { quantity: { $gt: 0 } } },
      {
        $group: {
          _id: '$symbol',
          totalQuantity: { $sum: '$quantity' },
          totalInvested: { $sum: { $multiply: ['$quantity', '$averageBuyPrice'] } },
        },
      },
      { $sort: { totalInvested: -1 } },
      { $limit: 6 },
    ]);

    // 4. CHART DATASET: Cash Flow Breakdown (Deposits vs Withdrawals)
    const transactionCashFlow = await Transaction.aggregate([
      { $match: { status: 'COMPLETED' } },
      {
        $group: {
          _id: '$type',
          totalAmount: { $sum: '$total' },
          count: { $sum: 1 },
        },
      },
    ]);

    // 5. CHART DATASET: Top 5 Highest User Balances
    const topUserBalances = await User.find({ role: 'USER' })
      .sort({ balance: -1 })
      .limit(5)
      .select('name email balance');

    // 6. CHART DATASET: User Registration Growth Timeline
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 10 },
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalStocks,
        totalTrades,
        totalTradingVolume,
        totalDeposits,
        totalWithdrawals,
        profitableTrades,
        lossTrades,
        pendingTrades,
        openTrades,
        buyVsSell: [
          { name: 'BUY', value: buyTradesCount },
          { name: 'SELL', value: sellTradesCount },
        ],
        topTradedStocks,
        sectorDistribution,
        tradeStatusBreakdown,
        topStockHoldings,
        transactionCashFlow,
        topUserBalances,
        userGrowth,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get users list (Admin)
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const { search, status } = req.query;
    const query = { role: 'USER' };

    if (status && status !== 'ALL') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user status (Enable/Disable)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
const updateUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { status } = req.body;
    if (!['ACTIVE', 'DISABLED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    user.status = status;
    await user.save();

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: status === 'DISABLED' ? 'DISABLE_USER' : 'ENABLE_USER',
      target: user.email,
      description: `Changed status of user ${user.name} (${user.email}) to ${status}`,
    });

    res.json({
      success: true,
      message: `User status changed to ${status}`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user balance (Admin Credit / Adjustment)
// @route   PUT /api/admin/users/:id/balance
// @access  Private/Admin
const updateUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { amount, action } = req.body;
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Amount must be a positive number' });
    }

    if (action === 'ADD') {
      user.balance = Math.round((user.balance + numAmount) * 100) / 100;
      await Transaction.create({
        user: user._id,
        type: 'DEPOSIT',
        total: numAmount,
        status: 'COMPLETED',
        description: `Admin manual deposit credit of $${numAmount}`,
      });
    } else if (action === 'DEDUCT') {
      if (user.balance < numAmount) {
        return res.status(400).json({ success: false, message: 'User balance is insufficient' });
      }
      user.balance = Math.round((user.balance - numAmount) * 100) / 100;
      await Transaction.create({
        user: user._id,
        type: 'WITHDRAWAL',
        total: numAmount,
        status: 'COMPLETED',
        description: `Admin manual balance deduction of $${numAmount}`,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Action must be ADD or DEDUCT' });
    }

    await user.save();

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_USER_BALANCE',
      target: user.email,
      description: `Admin ${action} $${numAmount} to user ${user.email}. New balance: $${user.balance}`,
    });

    res.json({
      success: true,
      message: `User balance updated successfully`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all user holdings / bought shares across all users (Admin)
// @route   GET /api/admin/user-investments
// @access  Private/Admin
const getUserInvestments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const { search } = req.query;

    const holdings = await Holding.find({ quantity: { $gt: 0 } })
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name email balance phone country status')
      .populate('stock', 'name symbol currentPrice sector logo dailyChange dailyChangePercent');

    let filtered = holdings;
    if (search) {
      const q = search.toLowerCase();
      filtered = holdings.filter(
        (h) =>
          (h.user && (h.user.name?.toLowerCase().includes(q) || h.user.email?.toLowerCase().includes(q))) ||
          (h.symbol && h.symbol.toLowerCase().includes(q)) ||
          (h.stock && h.stock.name?.toLowerCase().includes(q))
      );
    }

    const formatted = filtered.map((h) => {
      const stock = h.stock;
      const currentPrice = stock ? stock.currentPrice : h.averageBuyPrice;
      const totalInvested = Math.round(h.averageBuyPrice * h.quantity * 100) / 100;
      const currentValue = Math.round(currentPrice * h.quantity * 100) / 100;
      const profitLoss = Math.round((currentValue - totalInvested) * 100) / 100;
      const profitLossPercentage = totalInvested > 0
        ? Math.round(((currentValue - totalInvested) / totalInvested) * 10000) / 100
        : 0;

      return {
        _id: h._id,
        user: h.user,
        stock: h.stock,
        symbol: h.symbol,
        quantity: h.quantity,
        averageBuyPrice: h.averageBuyPrice,
        currentPrice,
        totalInvested,
        currentValue,
        profitLoss,
        profitLossPercentage,
        updatedAt: h.updatedAt,
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      total: formatted.length,
      page,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Audit Logs
// @route   GET /api/admin/audit-logs
// @access  Private/Admin
const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const total = await AuditLog.countDocuments();
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: logs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserBalance,
  getUserInvestments,
  getAuditLogs,
};
