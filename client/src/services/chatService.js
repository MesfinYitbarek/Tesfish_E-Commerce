import api from './api';

const chatService = {
  // Get all chats for the current user
  getChats: () => {
    return api.get('/chat');
  },

  // Get a specific chat by ID
  getChat: (chatId) => {
    return api.get(`/chat/${chatId}`);
  },

  // Create a new chat
  createChat: (data) => {
    return api.post('/chat/create', data);
  },

  // Send a message in a chat
  sendMessage: (chatId, messageData) => {
    return api.post(`/chat/${chatId}/message`, messageData);
  },

  // Edit a message
  editMessage: (chatId, messageId, content) => {
    return api.put(`/chat/${chatId}/message/${messageId}`, { content });
  },

  // Delete a message
  deleteMessage: (chatId, messageId) => {
    return api.delete(`/chat/${chatId}/message/${messageId}`);
  },

  // Archive a chat
  archiveChat: (chatId) => {
    return api.put(`/chat/${chatId}/archive`);
  },

  // Block/unblock a user in a chat
  blockUser: (chatId, userId) => {
    return api.put(`/chat/${chatId}/block`, { userId });
  },

  // Mark messages as read
  markAsRead: (chatId) => {
    return api.put(`/chat/${chatId}/read`);
  },

  // Get chat participants
  getChatParticipants: (chatId) => {
    return api.get(`/chat/${chatId}/participants`);
  },

  // Search messages within a chat
  searchMessages: (chatId, query) => {
    return api.get(`/chat/${chatId}/search`, {
      params: { q: query }
    });
  },

  // Upload file attachment
  uploadAttachment: (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/chat/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
  },

  // Get message history with pagination
  getMessageHistory: (chatId, page = 1, limit = 50) => {
    return api.get(`/chat/${chatId}/messages`, {
      params: { page, limit }
    });
  }
};

export default chatService;