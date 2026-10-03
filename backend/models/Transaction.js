const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    transactionId: {
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
    },
    symbol: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['BUY', 'SELL', 'DEPOSIT', 'WITHDRAWAL'],
      required: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['COMPLETED', 'PENDING', 'FAILED', 'CANCELLED'],
      default: 'COMPLETED',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

transactionSchema.pre('save', function () {
  if (!this.transactionId) {
    this.transactionId = 'TXN-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
