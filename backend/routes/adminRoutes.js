const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  updateUserBalance,
  getUserInvestments,
  getAuditLogs,
} = require('../controllers/adminController');
const { getAdminTrades, updateTradeByAdmin } = require('../controllers/tradeController');
const { getAdminTransactions } = require('../controllers/transactionController');
const { createStock, updateStock, deleteStock } = require('../controllers/stockController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect, admin);

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/balance', updateUserBalance);
router.get('/user-investments', getUserInvestments);

router.get('/stocks', (req, res, next) => {
  req.url = '/';
  const { getStocks } = require('../controllers/stockController');
  return getStocks(req, res, next);
});
router.post('/stocks', createStock);
router.put('/stocks/:id', updateStock);
router.delete('/stocks/:id', deleteStock);

router.get('/trades', getAdminTrades);
router.put('/trades/:id', updateTradeByAdmin);

router.get('/transactions', getAdminTransactions);
router.get('/audit-logs', getAuditLogs);

module.exports = router;
