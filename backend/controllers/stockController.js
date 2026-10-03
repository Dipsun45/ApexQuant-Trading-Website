const Stock = require('../models/Stock');
const AuditLog = require('../models/AuditLog');
const { broadcastMarketUpdate } = require('../services/socketService');

// @desc    Get all stocks (with search & filtering & pagination)
// @route   GET /api/stocks
// @access  Public
const getStocks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const { search, sector, marketStatus, sortBy } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { symbol: { $regex: search, $options: 'i' } },
      ];
    }

    if (sector && sector !== 'ALL') {
      query.sector = sector;
    }

    if (marketStatus && marketStatus !== 'ALL') {
      query.marketStatus = marketStatus;
    }

    let sortOption = { symbol: 1 };
    if (sortBy === 'price_asc') sortOption = { currentPrice: 1 };
    if (sortBy === 'price_desc') sortOption = { currentPrice: -1 };
    if (sortBy === 'change_desc') sortOption = { dailyChangePercent: -1 };
    if (sortBy === 'change_asc') sortOption = { dailyChangePercent: 1 };
    if (sortBy === 'name_asc') sortOption = { name: 1 };

    const total = await Stock.countDocuments(query);
    const stocks = await Stock.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: stocks.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: stocks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single stock by ID or symbol
// @route   GET /api/stocks/:id
// @access  Public
const getStockById = async (req, res) => {
  try {
    let stock;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      stock = await Stock.findById(req.params.id);
    } else {
      stock = await Stock.findOne({ symbol: req.params.id.toUpperCase() });
    }

    if (!stock) {
      return res.status(404).json({
        success: false,
        message: 'Stock not found',
      });
    }

    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new stock (Admin)
// @route   POST /api/stocks
// @access  Private/Admin
const createStock = async (req, res) => {
  try {
    const {
      name,
      symbol,
      sector,
      currentPrice,
      openPrice,
      description,
      logo,
      marketStatus,
    } = req.body;

    if (!name || !symbol || !currentPrice) {
      return res.status(400).json({
        success: false,
        message: 'Name, symbol, and current price are required',
      });
    }

    const uppercaseSymbol = symbol.toUpperCase();
    const existing = await Stock.findOne({ symbol: uppercaseSymbol });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Stock symbol ${uppercaseSymbol} already exists`,
      });
    }

    const price = parseFloat(currentPrice);
    const open = openPrice ? parseFloat(openPrice) : price;

    const stock = await Stock.create({
      name,
      symbol: uppercaseSymbol,
      sector: sector || 'Technology',
      currentPrice: price,
      previousPrice: price,
      openPrice: open,
      highPrice: Math.max(price, open),
      lowPrice: Math.min(price, open),
      dailyChange: Math.round((price - open) * 100) / 100,
      dailyChangePercent: open > 0 ? Math.round(((price - open) / open) * 10000) / 100 : 0,
      description: description || '',
      logo: logo || '',
      marketStatus: marketStatus || 'OPEN',
      priceHistory: [{ price, timestamp: new Date() }],
    });

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'CREATE_STOCK',
      target: stock.symbol,
      description: `Created new stock ${stock.name} (${stock.symbol}) at price $${stock.currentPrice}`,
    });

    res.status(201).json({
      success: true,
      message: 'Stock created successfully',
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update stock (Admin)
// @route   PUT /api/stocks/:id
// @access  Private/Admin
const updateStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    const {
      name,
      symbol,
      sector,
      currentPrice,
      marketStatus,
      description,
      logo,
      isActive,
    } = req.body;

    if (name) stock.name = name;
    if (symbol) stock.symbol = symbol.toUpperCase();
    if (sector) stock.sector = sector;
    if (marketStatus) stock.marketStatus = marketStatus;
    if (description !== undefined) stock.description = description;
    if (logo !== undefined) stock.logo = logo;
    if (isActive !== undefined) stock.isActive = isActive;

    if (currentPrice !== undefined && parseFloat(currentPrice) !== stock.currentPrice) {
      const newPrice = parseFloat(currentPrice);
      stock.previousPrice = stock.currentPrice;
      stock.currentPrice = newPrice;
      stock.dailyChange = Math.round((newPrice - stock.openPrice) * 100) / 100;
      stock.dailyChangePercent = stock.openPrice > 0
        ? Math.round(((newPrice - stock.openPrice) / stock.openPrice) * 10000) / 100
        : 0;

      if (!stock.priceHistory) stock.priceHistory = [];
      stock.priceHistory.push({ price: newPrice, timestamp: new Date() });
      if (stock.priceHistory.length > 30) stock.priceHistory.shift();
    }

    await stock.save();

    broadcastMarketUpdate([{
      _id: stock._id,
      symbol: stock.symbol,
      currentPrice: stock.currentPrice,
      previousPrice: stock.previousPrice,
      dailyChange: stock.dailyChange,
      dailyChangePercent: stock.dailyChangePercent,
      updatedAt: stock.updatedAt
    }]);

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'UPDATE_STOCK',
      target: stock.symbol,
      description: `Updated stock ${stock.symbol} parameters`,
    });

    res.json({
      success: true,
      message: 'Stock updated successfully',
      data: stock,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete stock (Admin)
// @route   DELETE /api/stocks/:id
// @access  Private/Admin
const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);

    if (!stock) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }

    await Stock.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      admin: req.user._id,
      adminEmail: req.user.email,
      action: 'DELETE_STOCK',
      target: stock.symbol,
      description: `Deleted stock ${stock.name} (${stock.symbol})`,
    });

    res.json({
      success: true,
      message: 'Stock deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
};
