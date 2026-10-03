const express = require('express');
const router = express.Router();
const {
  buyStock,
  sellStock,
  getMyTrades,
  getAdminTrades,
  updateTradeByAdmin,
} = require('../controllers/tradeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/buy', protect, buyStock);
router.post('/sell', protect, sellStock);
router.get('/my-trades', protect, getMyTrades);

module.exports = router;
