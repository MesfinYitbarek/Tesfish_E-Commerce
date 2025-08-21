import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';

// Async thunks
export const fetchChats = createAsyncThunk(
  'chat/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getChats();
      return response.data.data; // Extract the nested data object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
    }
  }
);

export const fetchChat = createAsyncThunk(
  'chat/fetchChat',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatService.getChat(chatId);
      return response.data.data; // Extract the nested data object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch chat');
    }
  }
);

export const createChat = createAsyncThunk(
  'chat/createChat',
  async (chatData, { rejectWithValue }) => {
    try {
      const response = await chatService.createChat(chatData);
      return response.data.data; // Extract the nested data object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create chat');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ chatId, messageData }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessage(chatId, messageData);
      return response.data.data; // Extract the nested data object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const editMessage = createAsyncThunk(
  'chat/editMessage',
  async ({ chatId, messageId, content }, { rejectWithValue }) => {
    try {
      const response = await chatService.editMessage(chatId, messageId, content);
      return response.data.data; // Extract the nested data object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to edit message');
    }
  }
);

export const deleteMessage = createAsyncThunk(
  'chat/deleteMessage',
  async ({ chatId, messageId }, { rejectWithValue }) => {
    try {
      const response = await chatService.deleteMessage(chatId, messageId);
      return { chatId, messageId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete message');
    }
  }
);

export const archiveChat = createAsyncThunk(
  'chat/archiveChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await chatService.archiveChat(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to archive chat');
    }
  }
);

const initialState = {
  chats: [],
  currentChat: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,
  typing: {},
  unreadCount: 0,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      const message = action.payload;
      if (state.currentChat && state.currentChat._id === message.chatId) {
        state.messages.push(message);
      }
      // Update chat's last message
      const chatIndex = state.chats.findIndex(chat => chat._id === message.chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].lastMessage = {
          content: message.content,
          timestamp: message.timestamp,
          sender: message.sender
        };
        // Move to top
        const chat = state.chats.splice(chatIndex, 1)[0];
        state.chats.unshift(chat);
      }
    },
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = { ...state.messages[messageIndex], ...updates };
      }
    },
    removeMessage: (state, action) => {
      const messageId = action.payload;
      state.messages = state.messages.filter(msg => msg._id !== messageId);
    },
    markAsRead: (state, action) => {
      const chatId = action.payload;
      const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
      if (chatIndex !== -1) {
        // Reset unread count for current user
        const currentUserId = action.meta?.userId; // You might need to pass this
        const unreadEntry = state.chats[chatIndex].unreadCount.find(entry => entry.user === currentUserId);
        if (unreadEntry) {
          unreadEntry.count = 0;
        }
      }
      // Mark messages as read
      state.messages.forEach(message => {
        if (!message.isRead) {
          message.isRead = true;
          message.readAt = new Date().toISOString();
        }
      });
    },
    setTyping: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      if (isTyping) {
        state.typing[chatId] = { ...state.typing[chatId], [userId]: true };
      } else {
        if (state.typing[chatId]) {
          delete state.typing[chatId][userId];
          if (Object.keys(state.typing[chatId]).length === 0) {
            delete state.typing[chatId];
          }
        }
      }
    },
    updateUnreadCount: (state) => {
      // Calculate total unread count from all chats
      state.unreadCount = state.chats.reduce((total, chat) => {
        const userUnreadEntry = chat.unreadCount?.find(entry => entry.user === state.currentUserId);
        return total + (userUnreadEntry?.count || 0);
      }, 0);
    },
    resetChat: (state) => {
      state.currentChat = null;
      state.messages = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chats = action.payload.chats || [];
        // Calculate total unread count
        state.unreadCount = state.chats.reduce((total, chat) => {
          const userUnreadEntry = chat.unreadCount?.find(entry => entry.user === state.currentUserId);
          return total + (userUnreadEntry?.count || 0);
        }, 0);
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.chats = []; // Reset to empty array on error
      })
      // Fetch single chat
      .addCase(fetchChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentChat = action.payload.chat;
        state.messages = action.payload.chat?.messages || [];
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create chat
      .addCase(createChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const newChat = action.payload.chat;
        state.chats.unshift(newChat);
        state.currentChat = newChat;
        state.messages = newChat.messages || [];
      })
      .addCase(createChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        const message = action.payload.message;
        state.messages.push(message);
        
        // Update chat's last message
        const chatIndex = state.chats.findIndex(chat => chat._id === state.currentChat?._id);
        if (chatIndex !== -1) {
          state.chats[chatIndex].lastMessage = {
            content: message.content,
            timestamp: message.createdAt || message.timestamp,
            sender: message.sender
          };
          // Move to top
          const chat = state.chats.splice(chatIndex, 1)[0];
          state.chats.unshift(chat);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
      })
      // Edit message
      .addCase(editMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload.message;
        const messageIndex = state.messages.findIndex(msg => msg._id === updatedMessage._id);
        if (messageIndex !== -1) {
          state.messages[messageIndex] = updatedMessage;
        }
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete message
      .addCase(deleteMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { messageId } = action.payload;
        state.messages = state.messages.filter(msg => msg._id !== messageId);
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Archive chat
      .addCase(archiveChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].status = 'archived';
        }
      });
  },
});

export const {
  clearError,
  setCurrentChat,
  addMessage,
  updateMessage,
  removeMessage,
  markAsRead,
  setTyping,
  updateUnreadCount,
  resetChat
} = chatSlice.actions;

export default chatSlice.reducer;