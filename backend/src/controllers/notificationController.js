import { Notification } from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Public: Get active temple broadcasts and announcements
 */
export const getActiveNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ active: true })
    .sort({ createdAt: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      count: notifications.length,
      notifications,
    },
  });
});

/**
 * Admin: Create a new notification announcement
 */
export const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, targetAudience } = req.body;

  const notification = await Notification.create({
    title,
    message,
    type: type || 'announcement',
    targetAudience: targetAudience || 'all',
    sentBy: req.staff ? req.staff._id : null,
    active: true,
  });

  res.status(201).json({
    success: true,
    message: 'Announcement broadcast created successfully',
    data: { notification },
  });
});

export default {
  getActiveNotifications,
  createNotification,
};
