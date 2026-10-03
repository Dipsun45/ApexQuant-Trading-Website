const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema(
  {
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
    quantity: {
      type: Number,
      required: true,
      min: [0, 'Quantity cannot be negative'],
    },
    averageBuyPrice: {
      type: Number,
      required: true,
      min: [0, 'Average price cannot be negative'],
    },
    totalInvested: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate user-stock holdings
holdingSchema.index({ user: 1, stock: 1 }, { unique: true });

module.exports = mongoose.model('Holding', holdingSchema);
