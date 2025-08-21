import Notification from '../../models/Notification.js';

// Create notification helper
export const createNotification = async ({
  recipient,
  title,
  message,
  type,
  relatedOrder = null,
  relatedProduct = null,
  relatedBooking = null,
  actionUrl = null,
  actionLabel = null,
  priority = 'medium',
  io = null
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      title,
      message,
      type,
      relatedOrder,
      relatedProduct,
      relatedBooking,
      actionUrl,
      actionLabel,
      priority
    });

    // Emit real-time notification if socket.io is available
    if (io) {
      io.to(recipient.toString()).emit('new-notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Bulk create notifications
export const createBulkNotifications = async (notifications, io = null) => {
  try {
    const createdNotifications = await Notification.insertMany(notifications);

    // Emit real-time notifications
    if (io) {
      createdNotifications.forEach(notification => {
        io.to(notification.recipient.toString()).emit('new-notification', notification);
      });
    }

    return createdNotifications;
  } catch (error) {
    console.error('Create bulk notifications error:', error);
    throw error;
  }
};

// Notification types constants
export const NOTIFICATION_TYPES = {
  ORDER: 'order',
  PAYMENT: 'payment',
  BOOKING: 'booking',
  CHAT: 'chat',
  REVIEW: 'review',
  SYSTEM: 'system',
  PROMOTION: 'promotion'
};

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};