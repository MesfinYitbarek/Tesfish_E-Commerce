import express from 'express';
import {
  getNotifications,
  createNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getNotificationStats
} from '../../controllers/notification/notificationController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get user's notifications
router.get('/', getNotifications);

// Get notification statistics
router.get('/stats', getNotificationStats);

// Mark all notifications as read
router.put('/mark-all-read', markAllAsRead);

// Clear all read notifications
router.delete('/clear-read', clearReadNotifications);

// Single notification routes
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// Admin/System routes
router.post('/', authorize('admin'), createNotification);

export default router;