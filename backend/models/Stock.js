const mongoose = require('mongoose');

const pricePointSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    symbol: {
      type: String,
      required: [true, 'Stock symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    sector: {
      type: String,
      default: 'Technology',
    },
    currentPrice: {
      type: Number,
      required: [true, 'Current price is required'],
      min: [0, 'Price must be positive'],
    },
    previousPrice: {
      type: Number,
      default: 0,
    },
    openPrice: {
      type: Number,
      default: 0,
    },
    highPrice: {
      type: Number,
      default: 0,
    },
    lowPrice: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 1000000,
    },
    dailyChange: {
      type: Number,
      default: 0,
    },
    dailyChangePercent: {
      type: Number,
      default: 0,
    },
    marketStatus: {
      type: String,
      enum: ['OPEN', 'CLOSED', 'HALTED'],
      default: 'OPEN',
    },
    description: {
      type: String,
      default: '',
    },
    logo: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    priceHistory: [pricePointSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Stock', stockSchema);
