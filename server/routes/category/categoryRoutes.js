import express from 'express';
import { body } from 'express-validator';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../../controllers/category/categoryController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();

const categoryValidation = [
  body('name').notEmpty().trim().withMessage('Category name is required'),
  body('description').optional().trim(),
  handleValidationErrors
];

// Public routes
router.get('/', getCategories);
router.get('/:slug', getCategory);

// Admin routes
router.post('/', protect, authorize('admin'), categoryValidation, createCategory);
router.put('/:id', protect, authorize('admin'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;