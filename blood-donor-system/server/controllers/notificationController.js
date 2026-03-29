import Notification from '../models/Notification.js';

// @desc    Get all unread notifications for the logged-in donor
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ donor: req.donor._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, donor: req.donor._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    res.json(notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { donor: req.donor._id, read: false },
      { read: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export { getNotifications, markAsRead, markAllAsRead };
