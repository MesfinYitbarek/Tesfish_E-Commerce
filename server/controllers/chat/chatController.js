import Chat from '../../models/Chat.js';
import User from '../../models/User.js';
import Product from '../../models/Product.js';

// @desc    Get user's chats
// @route   GET /api/chat
// @access  Private
export const getChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.user.id,
      status: { $ne: 'archived' }
    })
    .populate('participants.user', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName email userType avatar')
    .populate('relatedProduct', 'title media price')
    .populate('lastMessage.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName')
    .sort({ 'lastMessage.timestamp': -1 });

    res.status(200).json({
      success: true,
      data: { chats }
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chats'
    });
  }
};

// @desc    Get single chat
// @route   GET /api/chat/:id
// @access  Private
export const getChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants.user', 'companyProfile individualProfile customerProfile email userType avatar')
      .populate('relatedProduct', 'title media seller price')
      .populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user._id.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Mark messages as read
    let hasUnreadMessages = false;
    chat.messages.forEach(message => {
      if (message.sender._id.toString() !== req.user.id && !message.isRead) {
        message.isRead = true;
        message.readAt = new Date();
        hasUnreadMessages = true;
      }
    });

    // Update unread count
    const unreadEntry = chat.unreadCount.find(entry => entry.user.toString() === req.user.id);
    if (unreadEntry && unreadEntry.count > 0) {
      unreadEntry.count = 0;
      hasUnreadMessages = true;
    }

    if (hasUnreadMessages) {
      await chat.save();
    }

    res.status(200).json({
      success: true,
      data: { chat }
    });
  } catch (error) {
    console.error('Get chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chat'
    });
  }
};

// @desc    Create or get chat
// @route   POST /api/chat/create
// @access  Private
export const createChat = async (req, res) => {
  try {
    const { participantId, relatedProduct, message } = req.body;

    if (!participantId) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID is required'
      });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user is trying to chat with themselves
    if (participantId === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create chat with yourself'
      });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      $and: [
        { 'participants.user': req.user.id },
        { 'participants.user': participantId },
        { relatedProduct: relatedProduct || null }
      ]
    })
    .populate('participants.user', 'companyProfile individualProfile customerProfile email userType avatar')
    .populate('relatedProduct', 'title media price');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [
          { user: req.user.id },
          { user: participantId }
        ],
        relatedProduct: relatedProduct || null,
        chatType: 'direct',
        unreadCount: [
          { user: req.user.id, count: 0 },
          { user: participantId, count: 0 }
        ]
      });

      // Populate the newly created chat
      await chat.populate('participants.user', 'companyProfile individualProfile customerProfile email userType avatar');
      await chat.populate('relatedProduct', 'title media price');
    }

    // Add initial message if provided
    if (message && message.trim()) {
      const newMessage = {
        sender: req.user.id,
        content: message.trim(),
        messageType: 'text'
      };

      chat.messages.push(newMessage);
      chat.lastMessage = {
        content: message.trim(),
        sender: req.user.id,
        timestamp: new Date()
      };

      // Update unread count for recipient
      const recipientUnread = chat.unreadCount.find(entry => entry.user.toString() === participantId);
      if (recipientUnread) {
        recipientUnread.count += 1;
      }

      await chat.save();

      // Populate the message sender
      await chat.populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName avatar');

      // Emit real-time notification
      if (req.io) {
        req.io.to(participantId).emit('new-message', {
          chatId: chat._id,
          message: newMessage,
          sender: req.user
        });
      }
    }

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      data: { chat }
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating chat'
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/:id/message
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { content, messageType = 'text', attachments } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message in this chat'
      });
    }

    // Check if chat is blocked
    if (chat.status === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Cannot send message in blocked chat'
      });
    }

    const newMessage = {
      sender: req.user.id,
      content: content.trim(),
      messageType,
      attachments: attachments || []
    };

    chat.messages.push(newMessage);
    chat.lastMessage = {
      content: content.trim(),
      sender: req.user.id,
      timestamp: new Date()
    };

    // Update unread count for other participants
    chat.participants.forEach(participant => {
      if (participant.user.toString() !== req.user.id) {
        const unreadEntry = chat.unreadCount.find(entry => 
          entry.user.toString() === participant.user.toString()
        );
        if (unreadEntry) {
          unreadEntry.count += 1;
        }
      }
    });

    await chat.save();
    await chat.populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName avatar');

    // Get the newly added message
    const messageWithSender = chat.messages[chat.messages.length - 1];

    // Emit real-time message
    if (req.io) {
      chat.participants.forEach(participant => {
        if (participant.user.toString() !== req.user.id) {
          req.io.to(participant.user.toString()).emit('new-message', {
            chatId: chat._id,
            message: messageWithSender
          });
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message: messageWithSender }
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
};

// @desc    Edit message
// @route   PUT /api/chat/:id/message/:messageId
// @access  Private
export const editMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const { id: chatId, messageId } = req.params;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Find the message
    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this message'
      });
    }

    // Check if message is not too old (e.g., 24 hours)
    const messageAge = Date.now() - message.createdAt.getTime();
    const maxEditTime = 24 * 60 * 60 * 1000; // 24 hours
    if (messageAge > maxEditTime) {
      return res.status(400).json({
        success: false,
        message: 'Message is too old to edit'
      });
    }

    // Update the message
    message.content = content.trim();
    message.isEdited = true;
    message.editedAt = new Date();

    await chat.save();
    await chat.populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName avatar');

    const updatedMessage = chat.messages.id(messageId);

    // Emit real-time update
    if (req.io) {
      chat.participants.forEach(participant => {
        if (participant.user.toString() !== req.user.id) {
          req.io.to(participant.user.toString()).emit('message-edited', {
            chatId: chat._id,
            message: updatedMessage
          });
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message updated successfully',
      data: { message: updatedMessage }
    });
  } catch (error) {
    console.error('Edit message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while editing message'
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/chat/:id/message/:messageId
// @access  Private
export const deleteMessage = async (req, res) => {
  try {
    const { id: chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Find the message
    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    // Check if message is not too old (e.g., 24 hours)
    const messageAge = Date.now() - message.createdAt.getTime();
    const maxDeleteTime = 24 * 60 * 60 * 1000; // 24 hours
    if (messageAge > maxDeleteTime) {
      return res.status(400).json({
        success: false,
        message: 'Message is too old to delete'
      });
    }

    // Store message timestamp for last message update
    const messageTimestamp = message.createdAt;

    // Remove the message
    chat.messages.pull(messageId);

    // Update last message if this was the last message
    if (chat.lastMessage && 
        Math.abs(chat.lastMessage.timestamp.getTime() - messageTimestamp.getTime()) < 1000) {
      const remainingMessages = chat.messages.sort((a, b) => b.createdAt - a.createdAt);
      if (remainingMessages.length > 0) {
        const lastMessage = remainingMessages[0];
        chat.lastMessage = {
          content: lastMessage.content,
          sender: lastMessage.sender,
          timestamp: lastMessage.createdAt
        };
      } else {
        chat.lastMessage = null;
      }
    }

    await chat.save();

    // Emit real-time update
    if (req.io) {
      chat.participants.forEach(participant => {
        if (participant.user.toString() !== req.user.id) {
          req.io.to(participant.user.toString()).emit('message-deleted', {
            chatId: chat._id,
            messageId: messageId
          });
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting message'
    });
  }
};

// @desc    Mark chat messages as read
// @route   PUT /api/chat/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Mark all messages as read for this user
    let hasUnreadMessages = false;
    chat.messages.forEach(message => {
      if (message.sender.toString() !== req.user.id && !message.isRead) {
        message.isRead = true;
        message.readAt = new Date();
        hasUnreadMessages = true;
      }
    });

    // Reset unread count for this user
    const unreadEntry = chat.unreadCount.find(entry => entry.user.toString() === req.user.id);
    if (unreadEntry && unreadEntry.count > 0) {
      unreadEntry.count = 0;
      hasUnreadMessages = true;
    }

    if (hasUnreadMessages) {
      await chat.save();
    }

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking messages as read'
    });
  }
};

// @desc    Block user in chat
// @route   PUT /api/chat/:id/block
// @access  Private
export const blockUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Check if the user to block is a participant
    const userToBlock = chat.participants.find(p => p.user.toString() === userId);
    if (!userToBlock) {
      return res.status(400).json({
        success: false,
        message: 'User is not a participant in this chat'
      });
    }

    chat.status = 'blocked';
    await chat.save();

    // Emit real-time update
    if (req.io) {
      req.io.to(userId).emit('chat-blocked', {
        chatId: chat._id,
        blockedBy: req.user.id
      });
    }

    res.status(200).json({
      success: true,
      message: 'User blocked successfully'
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while blocking user'
    });
  }
};

// @desc    Unblock user in chat
// @route   PUT /api/chat/:id/unblock
// @access  Private
export const unblockUser = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    chat.status = 'active';
    await chat.save();

    // Emit real-time update
    if (req.io) {
      chat.participants.forEach(participant => {
        if (participant.user.toString() !== req.user.id) {
          req.io.to(participant.user.toString()).emit('chat-unblocked', {
            chatId: chat._id,
            unblockedBy: req.user.id
          });
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'User unblocked successfully'
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while unblocking user'
    });
  }
};

// @desc    Delete chat
// @route   DELETE /api/chat/:id
// @access  Private
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this chat'
      });
    }

    await Chat.findByIdAndDelete(req.params.id);

    // Emit real-time update
    if (req.io) {
      chat.participants.forEach(participant => {
        if (participant.user.toString() !== req.user.id) {
          req.io.to(participant.user.toString()).emit('chat-deleted', {
            chatId: chat._id,
            deletedBy: req.user.id
          });
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat deleted successfully'
    });
  } catch (error) {
    console.error('Delete chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting chat'
    });
  }
};

// @desc    Archive chat
// @route   PUT /api/chat/:id/archive
// @access  Private
export const archiveChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to archive this chat'
      });
    }

    chat.status = 'archived';
    await chat.save();

    res.status(200).json({
      success: true,
      message: 'Chat archived successfully'
    });
  } catch (error) {
    console.error('Archive chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while archiving chat'
    });
  }
};

// @desc    Get chat participants
// @route   GET /api/chat/:id/participants
// @access  Private
export const getChatParticipants = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('participants.user', 'companyProfile individualProfile customerProfile email userType avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user._id.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    res.status(200).json({
      success: true,
      data: { participants: chat.participants }
    });
  } catch (error) {
    console.error('Get participants error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching participants'
    });
  }
};

// @desc    Search messages in chat
// @route   GET /api/chat/:id/search?q=query
// @access  Private
export const searchMessages = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const chat = await Chat.findById(req.params.id)
      .populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Search messages
    const searchRegex = new RegExp(q.trim(), 'i');
    const matchingMessages = chat.messages.filter(message => 
      searchRegex.test(message.content)
    );

    res.status(200).json({
      success: true,
      data: { 
        messages: matchingMessages,
        totalMatches: matchingMessages.length 
      }
    });
  } catch (error) {
    console.error('Search messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching messages'
    });
  }
};

// @desc    Get message history with pagination
// @route   GET /api/chat/:id/messages?page=1&limit=50
// @access  Private
export const getMessageHistory = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const chat = await Chat.findById(req.params.id)
      .populate('messages.sender', 'companyProfile.companyName individualProfile.firstName individualProfile.lastName customerProfile.firstName customerProfile.lastName avatar');

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found'
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(p => p.user.toString() === req.user.id);
    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this chat'
      });
    }

    // Get paginated messages (sorted by newest first)
    const totalMessages = chat.messages.length;
    const messages = chat.messages
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + parseInt(limit));

    res.status(200).json({
      success: true,
      data: {
        messages: messages.reverse(), // Reverse to show oldest first in the response
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalMessages / parseInt(limit)),
          totalMessages,
          hasMore: skip + messages.length < totalMessages
        }
      }
    });
  } catch (error) {
    console.error('Get message history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching message history'
    });
  }
};