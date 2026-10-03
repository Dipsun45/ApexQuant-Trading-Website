const Watchlist = require('../models/Watchlist');
const Stock = require('../models/Stock');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
const getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user._id }).populate({
      path: 'stocks',
      select: 'name symbol currentPrice previousPrice dailyChange dailyChangePercent sector marketStatus logo',
    });

    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user._id, stocks: [] });
    }

    res.json({
      success: true,
      data: watchlist.stocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist
// @access  Private
const addToWatchlist = async (req, res) => {
  try {
    const { stockId } = req.body;
    if (!stockId) {
      return res.status(400).json({ success: false, message: 'Stock ID is required' });
    }

    const stock = await Stock.findById(stockId);
    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) {
      watchlist = new Watchlist({ user: req.user._id, stocks: [] });
    }

    if (watchlist.stocks.includes(stockId)) {
      return res.status(400).json({ success: false, message: 'Stock already in watchlist' });
    }

    watchlist.stocks.push(stockId);
    await watchlist.save();

    await watchlist.populate({
      path: 'stocks',
      select: 'name symbol currentPrice previousPrice dailyChange dailyChangePercent sector marketStatus logo',
    });

    res.json({
      success: true,
      message: `Added ${stock.symbol} to watchlist`,
      data: watchlist.stocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/:stockId
// @access  Private
const removeFromWatchlist = async (req, res) => {
  try {
    const { stockId } = req.params;

    let watchlist = await Watchlist.findOne({ user: req.user._id });
    if (!watchlist) {
      return res.status(404).json({ success: false, message: 'Watchlist not found' });
    }

    watchlist.stocks = watchlist.stocks.filter((id) => id.toString() !== stockId);
    await watchlist.save();

    await watchlist.populate({
      path: 'stocks',
      select: 'name symbol currentPrice previousPrice dailyChange dailyChangePercent sector marketStatus logo',
    });

    res.json({
      success: true,
      message: 'Stock removed from watchlist',
      data: watchlist.stocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
};
