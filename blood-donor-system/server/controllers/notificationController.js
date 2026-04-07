import Notification from '../models/Notification.js';
import Donor from '../models/Donor.js';
import { successResponse } from '../utils/responseWrapper.js';

// @desc    Get all unread notifications for the logged-in donor
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    
    if (!donor) {
      successResponse(res, 'Notifications fetched successfully', []);
      return;
    }

    const notifications = await Notification.find({ donor: donor._id })
      .sort({ createdAt: -1 })
      .limit(20);

    successResponse(res, 'Notifications fetched successfully', notifications);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark a notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    
    if (!donor) {
      res.status(404);
      throw new Error('Donor profile not found');
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, donor: donor._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      res.status(404);
      throw new Error('Notification not found');
    }

    successResponse(res, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark ALL notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res, next) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    
    if (!donor) {
      res.status(404);
      throw new Error('Donor profile not found');
    }

    await Notification.updateMany(
      { donor: donor._id, read: false },
      { read: true }
    );
    
    successResponse(res, 'All notifications marked as read', null);
  } catch (error) {
    next(error);
  }
};

export { getNotifications, markAsRead, markAllAsRead };
