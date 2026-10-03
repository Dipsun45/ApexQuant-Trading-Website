const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  createAnnouncement,
} = require('../controllers/notificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markAsRead);
router.post('/announcement', protect, admin, createAnnouncement);

module.exports = router;
