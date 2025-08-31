// store/slices/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(params);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch notifications');
    }
  }
);

export const fetchNotificationStats = createAsyncThunk(
  'notifications/fetchNotificationStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotificationStats();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to fetch notification statistics');
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      return { notificationId, ...response };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to mark notification as read');
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.markAllAsRead();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to mark all notifications as read');
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await notificationService.deleteNotification(notificationId);
      return { notificationId, ...response };
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to delete notification');
    }
  }
);

export const clearReadNotifications = createAsyncThunk(
  'notifications/clearReadNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationService.clearReadNotifications();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to clear read notifications');
    }
  }
);

export const createNotification = createAsyncThunk(
  'notifications/createNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await notificationService.createNotification(notificationData);
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to create notification');
    }
  }
);

// Initial State
const initialState = {
  notifications: [],
  unreadCount: 0,
  stats: {
    total: 0,
    unread: 0,
    byType: {}
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalNotifications: 0
  },
  filters: {
    isRead: undefined,
    type: '',
    priority: '',
    page: 1,
    limit: 20
  },
  loading: false,
  statsLoading: false,
  error: null,
  lastFetched: null,
  // Real-time updates
  realTimeConnected: false,
  // UI state
  showNotificationPanel: false,
  selectedNotification: null
};

// Notification Slice
const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // UI Actions
    setShowNotificationPanel: (state, action) => {
      state.showNotificationPanel = action.payload;
    },
    setSelectedNotification: (state, action) => {
      state.selectedNotification = action.payload;
    },
    
    // Filter Actions
    setNotificationFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearNotificationFilters: (state) => {
      state.filters = {
        isRead: undefined,
        type: '',
        priority: '',
        page: 1,
        limit: 20
      };
    },
    
    // Error Handling
    clearNotificationError: (state) => {
      state.error = null;
    },
    
    // Real-time Actions
    setRealTimeConnected: (state, action) => {
      state.realTimeConnected = action.payload;
    },
    addNotificationRealTime: (state, action) => {
      // Add new notification to the beginning of the list
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
      state.stats.total += 1;
      state.stats.unread += 1;
      
      // Update type stats
      const notificationType = action.payload.type;
      if (state.stats.byType[notificationType]) {
        state.stats.byType[notificationType].total += 1;
        state.stats.byType[notificationType].unread += 1;
      } else {
        state.stats.byType[notificationType] = { total: 1, unread: 1 };
      }
    },
    markNotificationReadRealTime: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n._id === notificationId);
      
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.stats.unread = Math.max(0, state.stats.unread - 1);
        
        // Update type stats
        const notificationType = notification.type;
        if (state.stats.byType[notificationType]) {
          state.stats.byType[notificationType].unread = Math.max(0, 
            state.stats.byType[notificationType].unread - 1
          );
        }
      }
    },
    clearNotificationsRealTime: (state) => {
      // Remove all read notifications
      state.notifications = state.notifications.filter(n => !n.isRead);
      // Recalculate stats
      state.stats.total = state.notifications.length;
      // Update type stats
      Object.keys(state.stats.byType).forEach(type => {
        const typeNotifications = state.notifications.filter(n => n.type === type);
        state.stats.byType[type] = {
          total: typeNotifications.length,
          unread: typeNotifications.filter(n => !n.isRead).length
        };
      });
    },
    
    // Optimistic Updates
    optimisticMarkAsRead: (state, action) => {
      const notificationId = action.payload;
      const notification = state.notifications.find(n => n._id === notificationId);
      
      if (notification && !notification.isRead) {
        notification.isRead = true;
        notification.readAt = new Date().toISOString();
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    optimisticDelete: (state, action) => {
      const notificationId = action.payload;
      const notificationIndex = state.notifications.findIndex(n => n._id === notificationId);
      
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex];
        state.notifications.splice(notificationIndex, 1);
        
        if (!notification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data.notifications;
        state.unreadCount = action.payload.data.unreadCount;
        state.pagination = action.payload.data.pagination;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Notification Stats
      .addCase(fetchNotificationStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchNotificationStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchNotificationStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload;
      })
      
      // Mark As Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notificationId = action.payload.notificationId;
        const notification = state.notifications.find(n => n._id === notificationId);
        
        if (notification && !notification.isRead) {
          notification.isRead = true;
          notification.readAt = action.payload.data?.notification?.readAt || new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
          state.stats.unread = Math.max(0, state.stats.unread - 1);
          
          // Update type stats
          const notificationType = notification.type;
          if (state.stats.byType[notificationType]) {
            state.stats.byType[notificationType].unread = Math.max(0, 
              state.stats.byType[notificationType].unread - 1
            );
          }
        }
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.error = action.payload;
        // Revert optimistic update if it was applied
      })
      
      // Mark All As Read
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          if (!notification.isRead) {
            notification.isRead = true;
            notification.readAt = new Date().toISOString();
          }
        });
        state.unreadCount = 0;
        state.stats.unread = 0;
        
        // Update type stats
        Object.keys(state.stats.byType).forEach(type => {
          state.stats.byType[type].unread = 0;
        });
      })
      .addCase(markAllNotificationsAsRead.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notificationId = action.payload.notificationId;
        const notificationIndex = state.notifications.findIndex(n => n._id === notificationId);
        
        if (notificationIndex !== -1) {
          const notification = state.notifications[notificationIndex];
          state.notifications.splice(notificationIndex, 1);
          
          if (!notification.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
            state.stats.unread = Math.max(0, state.stats.unread - 1);
          }
          
          state.stats.total = Math.max(0, state.stats.total - 1);
          
          // Update type stats
          const notificationType = notification.type;
          if (state.stats.byType[notificationType]) {
            state.stats.byType[notificationType].total = Math.max(0, 
              state.stats.byType[notificationType].total - 1
            );
            if (!notification.isRead) {
              state.stats.byType[notificationType].unread = Math.max(0, 
                state.stats.byType[notificationType].unread - 1
              );
            }
          }
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Clear Read Notifications
      .addCase(clearReadNotifications.fulfilled, (state) => {
        const readNotifications = state.notifications.filter(n => n.isRead);
        state.notifications = state.notifications.filter(n => !n.isRead);
        
        // Update stats
        state.stats.total = state.notifications.length;
        
        // Update type stats
        Object.keys(state.stats.byType).forEach(type => {
          const typeNotifications = state.notifications.filter(n => n.type === type);
          state.stats.byType[type] = {
            total: typeNotifications.length,
            unread: typeNotifications.filter(n => !n.isRead).length
          };
        });
      })
      .addCase(clearReadNotifications.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Create Notification (Admin)
      .addCase(createNotification.fulfilled, (state, action) => {
        // If the notification is for the current user, add it to the list
        const newNotification = action.payload.data.notification;
        if (newNotification) {
          state.notifications.unshift(newNotification);
          state.unreadCount += 1;
          state.stats.total += 1;
          state.stats.unread += 1;
          
          // Update type stats
          const notificationType = newNotification.type;
          if (state.stats.byType[notificationType]) {
            state.stats.byType[notificationType].total += 1;
            state.stats.byType[notificationType].unread += 1;
          } else {
            state.stats.byType[notificationType] = { total: 1, unread: 1 };
          }
        }
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  setShowNotificationPanel,
  setSelectedNotification,
  setNotificationFilters,
  clearNotificationFilters,
  clearNotificationError,
  setRealTimeConnected,
  addNotificationRealTime,
  markNotificationReadRealTime,
  clearNotificationsRealTime,
  optimisticMarkAsRead,
  optimisticDelete
} = notificationSlice.actions;

// Export selectors
export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationStats = (state) => state.notifications.stats;
export const selectNotificationFilters = (state) => state.notifications.filters;
export const selectNotificationLoading = (state) => state.notifications.loading;
export const selectNotificationError = (state) => state.notifications.error;
export const selectShowNotificationPanel = (state) => state.notifications.showNotificationPanel;

export default notificationSlice.reducer;