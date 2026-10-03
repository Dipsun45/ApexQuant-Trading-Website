const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    tradeId: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
      index: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
    },
    companyName: {
      type: String,
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
    },
    entryPrice: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    exitPrice: {
      type: Number,
      default: null,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    profitLoss: {
      type: Number,
      default: 0,
    },
    profitLossPercentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['PENDING', 'OPEN', 'PROFIT', 'LOSS', 'CLOSED', 'CANCELLED'],
      default: 'OPEN',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate tradeId before save
tradeSchema.pre('save', function () {
  if (!this.tradeId) {
    this.tradeId = 'TRD-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
  }
});

module.exports = mongoose.model('Trade', tradeSchema);
