const Transaction = require('../models/Transaction');

// @desc    Get current user transactions
// @route   GET /api/transactions
// @access  Private
const getMyTransactions = async (req, res) => {
  try {
    const { type, search, page = 1, limit = 50 } = req.query;
    const query = { user: req.user._id };

    if (type && type !== 'ALL') query.type = type;
    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('stock', 'name symbol logo');

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all transactions (Admin)
// @route   GET /api/admin/transactions
// @access  Private/Admin
const getAdminTransactions = async (req, res) => {
  try {
    const { type, status, search, page = 1, limit = 50 } = req.query;
    const query = {};

    if (type && type !== 'ALL') query.type = type;
    if (status && status !== 'ALL') query.status = status;
    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Transaction.countDocuments(query);

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email')
      .populate('stock', 'name symbol');

    res.json({
      success: true,
      count: transactions.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyTransactions,
  getAdminTransactions,
};
