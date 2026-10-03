const express = require('express');
const router = express.Router();
const { getMyTransactions } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMyTransactions);

module.exports = router;
