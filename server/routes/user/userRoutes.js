import express from 'express';
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  toggleWishlist,
  getWishlist,
  exportUsers
} from '../../controllers/user/userController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { uploadMiddleware } from '../../middleware/upload/uploadMiddleware.js';

const router = express.Router();

// Admin routes
router.get('/', protect, authorize('admin'), getUsers);
router.get('/export', protect, authorize('admin'), exportUsers);

// User routes
router.get('/wishlist', protect, authorize('customer'), getWishlist);
router.post('/wishlist/:productId', protect, authorize('customer'), toggleWishlist);

// Shared routes
router.get('/:id', protect, getUser);
router.put('/:id', protect, uploadMiddleware.single('avatar'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

export default router;