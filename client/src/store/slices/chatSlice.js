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

export const deleteChat = createAsyncThunk(
  'chat/deleteChat',
  async (chatId, { rejectWithValue }) => {
    try {
      await chatService.deleteChat(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete chat');
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

export const markAsRead = createAsyncThunk(
  'chat/markAsRead',
  async (chatId, { rejectWithValue, getState }) => {
    try {
      const response = await chatService.markAsRead(chatId);
      const state = getState();
      return { chatId, userId: state.auth.user?.id };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
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
  currentUserId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentChat: (state, action) => {
      const chat = action.payload;
      state.currentChat = chat;
      state.messages = chat?.messages || [];
      console.log('🔄 Current chat set:', chat?._id, 'Messages:', state.messages.length);
    },
    addMessage: (state, action) => {
      const message = action.payload;
      console.log('🔄 Redux addMessage called with:', message);

      // Ensure message has required fields
      if (!message || !message.content) {
        console.warn('⚠️ Invalid message received:', message);
        return;
      }

      // Add to current messages if this message belongs to the current chat
      if (state.currentChat && (
        message.chatId === state.currentChat._id ||
        !message.chatId ||
        message.chatId === state.currentChat.id
      )) {
        // Check if message already exists to prevent duplicates
        const messageExists = state.messages.some(msg => {
          // Check by ID first
          if (msg._id && message._id && msg._id === message._id) {
            return true;
          }

          // Check by content and timestamp to catch duplicates without IDs
          const timeDiff = Math.abs(
            new Date(msg.createdAt || msg.timestamp) -
            new Date(message.createdAt || message.timestamp)
          );

          return msg.content === message.content && timeDiff < 2000; // 2 second window
        });

        if (!messageExists) {
          console.log('✅ Adding new message to current chat');
          // Ensure message has proper structure
          const formattedMessage = {
            _id: message._id || `temp_${Date.now()}`,
            content: message.content,
            sender: message.sender,
            createdAt: message.createdAt || message.timestamp || new Date().toISOString(),
            timestamp: message.timestamp || message.createdAt || new Date().toISOString(),
            messageType: message.messageType || 'text',
            attachments: message.attachments || [],
            isRead: message.isRead || false,
            isEdited: message.isEdited || false,
            editedAt: message.editedAt || null
          };

          state.messages.push(formattedMessage);

          // Sort messages by timestamp to ensure proper order
          state.messages.sort((a, b) =>
            new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
          );
        } else {
          console.log('⚠️ Message already exists, skipping duplicate');
        }
      }

      // Update chat's last message in the chats list
      const chatId = message.chatId || state.currentChat?._id;
      if (chatId) {
        const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
        if (chatIndex !== -1) {
          const updatedChat = { ...state.chats[chatIndex] };
          updatedChat.lastMessage = {
            content: message.content,
            timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
            sender: message.sender
          };

          // Update unread count if message is from another user
          if (message.sender?._id !== state.currentUserId) {
            const unreadEntry = updatedChat.unreadCount?.find(entry =>
              entry.user?.toString() === state.currentUserId?.toString()
            );
            if (unreadEntry) {
              unreadEntry.count = (unreadEntry.count || 0) + 1;
            }
          }

          // Remove from current position and add to top
          state.chats.splice(chatIndex, 1);
          state.chats.unshift(updatedChat);

          console.log('🔄 Updated chat list with new message');
        }
      }
    },
    updateMessage: (state, action) => {
      const { messageId, updates } = action.payload;
      console.log('🔄 Updating message:', messageId, updates);

      const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
      if (messageIndex !== -1) {
        state.messages[messageIndex] = {
          ...state.messages[messageIndex],
          ...updates,
          isEdited: true,
          editedAt: updates.editedAt || new Date().toISOString()
        };
        console.log('✅ Message updated in Redux store');
      } else {
        console.warn('⚠️ Message not found for update:', messageId);
      }
    },
    removeMessage: (state, action) => {
      const messageId = action.payload;
      console.log('🗑️ Removing message:', messageId);

      const initialLength = state.messages.length;
      state.messages = state.messages.filter(msg => msg._id !== messageId);

      if (state.messages.length < initialLength) {
        console.log('✅ Message removed from Redux store');
      } else {
        console.warn('⚠️ Message not found for removal:', messageId);
      }
    },
    setTyping: (state, action) => {
      const { chatId, userId, isTyping } = action.payload;
      console.log('⌨️ Setting typing status:', { chatId, userId, isTyping });

      if (!state.typing[chatId]) {
        state.typing[chatId] = {};
      }

      if (isTyping) {
        state.typing[chatId][userId] = true;
      } else {
        delete state.typing[chatId][userId];
        if (Object.keys(state.typing[chatId]).length === 0) {
          delete state.typing[chatId];
        }
      }
    },
    updateUnreadCount: (state) => {
      // Calculate total unread count from all chats
      state.unreadCount = state.chats.reduce((total, chat) => {
        const userUnreadEntry = chat.unreadCount?.find(entry =>
          entry.user?.toString() === state.currentUserId?.toString()
        );
        return total + (userUnreadEntry?.count || 0);
      }, 0);

      console.log('🔢 Updated total unread count:', state.unreadCount);
    },
    setCurrentUserId: (state, action) => {
      state.currentUserId = action.payload;
    },
    resetChat: (state) => {
      console.log('🔄 Resetting chat state');
      state.currentChat = null;
      state.messages = [];
      state.error = null;
      state.typing = {};
    },
    resetChatState: (state) => {
      console.log('🔄 Resetting entire chat state');
      return {
        ...initialState,
        currentUserId: state.currentUserId
      };
    },
    updateChatInList: (state, action) => {
      const { chatId, lastMessage, incrementUnreadFor } = action.payload;
      console.log('🔄 Updating chat in list:', chatId);

      const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
      if (chatIndex !== -1) {
        const updatedChat = { ...state.chats[chatIndex] };

        // Update last message
        if (lastMessage) {
          updatedChat.lastMessage = lastMessage;
        }

        // Increment unread count if needed
        if (incrementUnreadFor) {
          const unreadEntry = updatedChat.unreadCount?.find(entry =>
            entry.user?.toString() === incrementUnreadFor?.toString()
          );
          if (unreadEntry) {
            unreadEntry.count = (unreadEntry.count || 0) + 1;
          }
        }

        // Remove from current position and add to top
        state.chats.splice(chatIndex, 1);
        state.chats.unshift(updatedChat);

        console.log('✅ Chat updated in list without refresh');
      }
    },

    removeChatFromList: (state, action) => {
      const chatId = action.payload;
      state.chats = state.chats.filter(chat => chat._id !== chatId);
      console.log('🗑️ Chat removed from list');
    },

    addChatToList: (state, action) => {
      const newChat = action.payload;
      // Check if chat already exists
      const existingIndex = state.chats.findIndex(chat => chat._id === newChat._id);
      if (existingIndex === -1) {
        state.chats.unshift(newChat);
        console.log('➕ New chat added to list');
      }
    },

    updateChatStatus: (state, action) => {
      const { chatId, status } = action.payload;
      const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
      if (chatIndex !== -1) {
        state.chats[chatIndex].status = status;
        console.log('🔄 Chat status updated:', status);
      }
    },

    markMessagesAsRead: (state, action) => {
      const { chatId, readBy } = action.payload;

      // Update messages in current chat
      if (state.currentChat?._id === chatId) {
        state.messages.forEach(message => {
          if (message.sender?._id !== readBy && !message.isRead) {
            message.isRead = true;
            message.readAt = new Date().toISOString();
          }
        });
      }

      console.log('📖 Messages marked as read without refresh');
    },
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
        console.log('📂 Chats fetched:', state.chats.length);

        // Calculate total unread count
        state.unreadCount = state.chats.reduce((total, chat) => {
          const userUnreadEntry = chat.unreadCount?.find(entry =>
            entry.user?.toString() === state.currentUserId?.toString()
          );
          return total + (userUnreadEntry?.count || 0);
        }, 0);
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.chats = []; // Reset to empty array on error
        console.error('❌ Failed to fetch chats:', action.payload);
      })
      // Delete chat
      .addCase(deleteChat.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        // Remove chat from the list
        state.chats = state.chats.filter(chat => chat._id !== chatId);

        // If the deleted chat was the current chat, clear it
        if (state.currentChat?._id === chatId) {
          state.currentChat = null;
          state.messages = [];
        }

        console.log('✅ Chat deleted successfully');
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.payload;
        console.error('❌ Failed to delete chat:', action.payload);
      })
      // Fetch single chat
      .addCase(fetchChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const chat = action.payload.chat;
        state.currentChat = chat;
        state.messages = chat?.messages || [];
        console.log('📂 Chat fetched:', chat?._id, 'Messages:', state.messages.length);

        // Sort messages by timestamp to ensure proper order
        state.messages.sort((a, b) =>
          new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
        );
      })
      .addCase(fetchChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('❌ Failed to fetch chat:', action.payload);
      })

      // Create chat
      .addCase(createChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const newChat = action.payload.chat;

        // Check if chat already exists
        const existingChatIndex = state.chats.findIndex(chat => chat._id === newChat._id);
        if (existingChatIndex !== -1) {
          // Update existing chat
          state.chats[existingChatIndex] = newChat;
        } else {
          // Add new chat to the beginning
          state.chats.unshift(newChat);
        }

        state.currentChat = newChat;
        state.messages = newChat.messages || [];
        console.log('✅ Chat created:', newChat._id);
      })
      .addCase(createChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        console.error('❌ Failed to create chat:', action.payload);
      })

      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        const message = action.payload.message;
        console.log('📤 Message sent successfully:', message);

        // Check if message already exists to prevent duplicates
        const messageExists = state.messages.some(msg => {
          if (msg._id && message._id && msg._id === message._id) {
            return true;
          }

          const timeDiff = Math.abs(
            new Date(msg.createdAt || msg.timestamp) -
            new Date(message.createdAt || message.timestamp)
          );

          return msg.content === message.content && timeDiff < 2000;
        });

        if (!messageExists) {
          state.messages.push(message);

          // Sort messages to ensure proper order
          state.messages.sort((a, b) =>
            new Date(a.createdAt || a.timestamp) - new Date(b.createdAt || b.timestamp)
          );
        }

        // Update chat's last message
        const chatIndex = state.chats.findIndex(chat => chat._id === state.currentChat?._id);
        if (chatIndex !== -1) {
          const updatedChat = { ...state.chats[chatIndex] };
          updatedChat.lastMessage = {
            content: message.content,
            timestamp: message.createdAt || message.timestamp,
            sender: message.sender
          };

          // Move to top
          state.chats.splice(chatIndex, 1);
          state.chats.unshift(updatedChat);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isSending = false;
        state.error = action.payload;
        console.error('❌ Failed to send message:', action.payload);
      })

      // Edit message
      .addCase(editMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(editMessage.fulfilled, (state, action) => {
        const updatedMessage = action.payload.message;
        const messageIndex = state.messages.findIndex(msg => msg._id === updatedMessage._id);
        if (messageIndex !== -1) {
          state.messages[messageIndex] = {
            ...state.messages[messageIndex],
            ...updatedMessage,
            isEdited: true,
            editedAt: updatedMessage.editedAt || new Date().toISOString()
          };
        }
        console.log('✅ Message edited successfully');
      })
      .addCase(editMessage.rejected, (state, action) => {
        state.error = action.payload;
        console.error('❌ Failed to edit message:', action.payload);
      })

      // Delete message
      .addCase(deleteMessage.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        const { messageId } = action.payload;
        state.messages = state.messages.filter(msg => msg._id !== messageId);
        console.log('✅ Message deleted successfully');
      })
      .addCase(deleteMessage.rejected, (state, action) => {
        state.error = action.payload;
        console.error('❌ Failed to delete message:', action.payload);
      })

      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const { chatId, userId } = action.payload;

        // Update chat's unread count
        const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
        if (chatIndex !== -1) {
          const unreadEntry = state.chats[chatIndex].unreadCount?.find(entry =>
            entry.user?.toString() === userId?.toString()
          );
          if (unreadEntry) {
            unreadEntry.count = 0;
          }
        }

        // Mark messages as read in current chat
        if (state.currentChat?._id === chatId) {
          state.messages.forEach(message => {
            if (message.sender?._id !== userId && !message.isRead) {
              message.isRead = true;
              message.readAt = new Date().toISOString();
            }
          });
        }

        // Recalculate total unread count
        state.unreadCount = state.chats.reduce((total, chat) => {
          const userUnreadEntry = chat.unreadCount?.find(entry =>
            entry.user?.toString() === userId?.toString()
          );
          return total + (userUnreadEntry?.count || 0);
        }, 0);

        console.log('✅ Messages marked as read');
      })

      // Archive chat
      .addCase(archiveChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        const chatIndex = state.chats.findIndex(chat => chat._id === chatId);
        if (chatIndex !== -1) {
          state.chats[chatIndex].status = 'archived';
        }
        console.log('✅ Chat archived successfully');
      });
  },
});

export const {
  clearError,
  setCurrentChat,
  addMessage,
  updateMessage,
  removeMessage,
  setTyping,
  updateUnreadCount,
  setCurrentUserId,
  resetChat,
  resetChatState,
  updateChatInList,
  removeChatFromList,
  addChatToList,
  updateChatStatus,
  markMessagesAsRead
} = chatSlice.actions;

export default chatSlice.reducer;