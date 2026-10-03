const express = require('express');
const router = express.Router();
const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} = require('../controllers/stockController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getStocks);
router.get('/:id', getStockById);
router.post('/', protect, admin, createStock);
router.put('/:id', protect, admin, updateStock);
router.delete('/:id', protect, admin, deleteStock);

module.exports = router;
