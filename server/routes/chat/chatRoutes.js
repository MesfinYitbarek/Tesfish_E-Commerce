import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  getChats,
  getChat,
  createChat,
  sendMessage,
  editMessage,
  deleteMessage,
  archiveChat,
  markAsRead,
  blockUser,
  unblockUser,
  deleteChat,
  getChatParticipants,
  searchMessages,
  getMessageHistory
} from '../../controllers/chat/chatController.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/chat/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images and documents
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and documents are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: fileFilter
});

// Chat routes
router.get('/', protect, getChats);
router.get('/:id', protect, getChat);
router.post('/create', protect, createChat);
router.delete('/:id', protect, deleteChat);

// Message routes
router.post('/:id/message', protect, sendMessage);
router.put('/:id/message/:messageId', protect, editMessage);
router.delete('/:id/message/:messageId', protect, deleteMessage);
router.get('/:id/messages', protect, getMessageHistory);
router.get('/:id/search', protect, searchMessages);

// Chat actions
router.put('/:id/archive', protect, archiveChat);
router.put('/:id/read', protect, markAsRead);
router.put('/:id/block', protect, blockUser);
router.put('/:id/unblock', protect, unblockUser);

// Participants
router.get('/:id/participants', protect, getChatParticipants);

// File upload
router.post('/upload', protect, upload.single('file'), uploadFile);

// Upload file handler
async function uploadFile(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const fileUrl = `/uploads/chat/${req.file.filename}`;
    
    res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while uploading file'
    });
  }
}

export default router;