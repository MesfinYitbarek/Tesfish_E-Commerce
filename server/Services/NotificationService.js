// services/notificationService.js
import Notification from '../models/Notification.js';

/**
 * Send a notification to a user
 * @param {String} userId - Recipient user ID
 * @param {Object} payload - { type, title, message, relatedOrder, relatedProduct, relatedBooking, actionUrl, actionLabel, priority }
 */
export const sendNotification = async (userId, payload) => {
  try {
    // 1. Save in DB
    const notification = await Notification.create({
      recipient: userId,
      title: payload.title,
      message: payload.message,
      type: payload.type || 'system',
      relatedOrder: payload.relatedOrder || null,
      relatedProduct: payload.relatedProduct || null,
      relatedBooking: payload.relatedBooking || null,
      actionUrl: payload.actionUrl || null,
      actionLabel: payload.actionLabel || null,
      priority: payload.priority || 'medium',
    });

    // 2. Emit to socket room (userId = room id from your socket.js)
    if (global.io) {
      global.io.to(userId.toString()).emit('notification', {
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        actionUrl: notification.actionUrl,
        actionLabel: notification.actionLabel,
        priority: notification.priority,
        isRead: notification.isRead,
        createdAt: notification.createdAt,
      });
    }

    return notification;
  } catch (err) {
    console.error('❌ Error sending notification:', err.message);
  }
};

/**
 * Send multiple notifications at once
 */
export const sendBulkNotifications = async (userIds, payload) => {
  const results = [];
  for (const id of userIds) {
    const n = await sendNotification(id, payload);
    results.push(n);
  }
  return results;
};
