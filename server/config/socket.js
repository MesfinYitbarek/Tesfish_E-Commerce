import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const initializeSocket = (io) => {
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
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Handle chat events
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.userId} joined chat ${chatId}`);
    });

    socket.on('leave-chat', (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.userId} left chat ${chatId}`);
    });

    socket.on('send-message', async (data) => {
      try {
        // Handle message sending logic here
        io.to(data.chatId).emit('new-message', data);
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (data) => {
      socket.to(data.chatId).emit('user-typing', {
        userId: socket.userId,
        isTyping: data.isTyping
      });
    });

    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });
};