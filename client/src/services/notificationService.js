// services/notificationService.js
import api from './api';
import { API_ENDPOINTS } from '../constants';

class NotificationService {
  // Get user's notifications with filtering and pagination
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add pagination params
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      
      // Add filter params
      if (params.isRead !== undefined) queryParams.append('isRead', params.isRead);
      if (params.type) queryParams.append('type', params.type);
      if (params.priority) queryParams.append('priority', params.priority);

      const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS.LIST}?${queryParams}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get notification statistics
  async getNotificationStats() {
    try {
      const response = await api.get(API_ENDPOINTS.NOTIFICATIONS.STATS);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Mark single notification as read
  async markAsRead(notificationId) {
    try {
      const response = await api.put(`${API_ENDPOINTS.NOTIFICATIONS.MARK_READ}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      const response = await api.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete single notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`${API_ENDPOINTS.NOTIFICATIONS.DELETE}/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Clear all read notifications
  async clearReadNotifications() {
    try {
      const response = await api.delete(API_ENDPOINTS.NOTIFICATIONS.CLEAR_READ);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create notification (admin only)
  async createNotification(notificationData) {
    try {
      const response = await api.post(API_ENDPOINTS.NOTIFICATIONS.CREATE, notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Real-time notification handler (for WebSocket/Socket.io)
  setupRealTimeNotifications(socket, dispatch) {
    if (!socket) return;

    socket.on('new-notification', (notification) => {
      // Dispatch action to add new notification to state
      dispatch(addNotificationRealTime(notification));
    });

    socket.on('notification-read', (notificationId) => {
      // Dispatch action to mark notification as read
      dispatch(markNotificationReadRealTime(notificationId));
    });

    socket.on('notifications-cleared', () => {
      // Dispatch action to clear notifications
      dispatch(clearNotificationsRealTime());
    });
  }
}

export default new NotificationService();