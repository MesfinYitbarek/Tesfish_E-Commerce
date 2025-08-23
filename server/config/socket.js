import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initializeSocket = (io) => {
  // Store user socket mappings
  const userSockets = new Map();

  // Socket authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('No token provided'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.userType = user.userType;
      socket.userData = user;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.userType})`);

    // Store user socket mapping
    userSockets.set(socket.userId, socket.id);

    // Join user to their personal room
    socket.join(socket.userId);

    // Broadcast user online status
    socket.broadcast.emit('user-online', { 
      userId: socket.userId,
      userType: socket.userType 
    });

    // Handle chat events
    socket.on('join-chat', (chatId) => {
      socket.join(`chat-${chatId}`);
      console.log(`User ${socket.userId} joined chat room: chat-${chatId}`);
    });

    socket.on('leave-chat', (chatId) => {
      socket.leave(`chat-${chatId}`);
      console.log(`User ${socket.userId} left chat room: chat-${chatId}`);
    });

    socket.on('typing', (data) => {
      console.log(`User ${socket.userId} typing in chat ${data.chatId}:`, data.isTyping);
      socket.to(`chat-${data.chatId}`).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping,
        chatId: data.chatId
      });
    });

    // Handle manual message sending (for testing)
    socket.on('send-message', async (data) => {
      try {
        console.log(`Manual message from ${socket.userId}:`, data);
        io.to(`chat-${data.chatId}`).emit('new-message', {
          chatId: data.chatId,
          message: data.message
        });
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`❌ User disconnected: ${socket.userId}, reason: ${reason}`);
      
      // Remove from user mapping
      userSockets.delete(socket.userId);
      
      // Broadcast user offline status
      socket.broadcast.emit('user-offline', { 
        userId: socket.userId 
      });
    });

    // Expose userSockets for debugging
    socket.on('get-online-users', () => {
      socket.emit('online-users', Array.from(userSockets.keys()));
    });
  });

  // Make io and userSockets available globally
  global.io = io;
  global.userSockets = userSockets;
};