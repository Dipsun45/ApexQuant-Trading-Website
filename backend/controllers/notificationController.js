const Notification = require('../models/Notification');
const User = require('../models/User');
const { broadcastMarketUpdate } = require('../services/socketService');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const notifications = await Notification.find({
      $or: [{ user: userId }, { user: null }],
    })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    res.json({
      success: true,
      unreadCount,
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    if (req.params.id === 'all') {
      await Notification.updateMany(
        { $or: [{ user: req.user._id }, { user: null }], isRead: false },
        { $set: { isRead: true } }
      );
      return res.json({ success: true, message: 'All notifications marked as read' });
    }

    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create announcement (Admin)
// @route   POST /api/notifications/announcement
// @access  Private/Admin
const createAnnouncement = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notification = await Notification.create({
      user: null, // null = global broadcast
      title,
      message,
      type: type || 'ANNOUNCEMENT',
    });

    res.status(201).json({
      success: true,
      message: 'Global announcement published',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  createAnnouncement,
};
