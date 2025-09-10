import express from 'express';
import { body, query } from 'express-validator';
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
import { uploadConfigs } from "../../middleware/upload/uploadMiddleware.js"; 
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();


// All routes require authentication
router.use(protect);

// Admin routes for user management
router.get('/',
  authorize('admin'),
  getUsers
);

router.get('/export',
  authorize('admin'),
  exportUsers
);

// Customer wishlist routes
router.get('/wishlist',
  authorize('customer'),
  getWishlist
);

router.post('/wishlist/:productId',
  authorize('customer'),
  toggleWishlist
);

// User profile routes (accessible by the user themselves or admin)
router.get('/:id', getUser);

router.put('/:id',
  uploadConfigs.profileImage, // Using predefined configuration
  updateUser
);

// Admin only - delete user
router.delete('/:id',
  authorize('admin'),
  deleteUser
);

export default router;