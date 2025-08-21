import express from 'express';
import {
  createReview,
  getProductReviews,
  getSellerReviews,
  updateReview,
  deleteReview,
  addHelpfulVote,
  respondToReview
} from '../../controllers/review/reviewController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/seller/:sellerId', getSellerReviews);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, addHelpfulVote);
router.put('/:id/respond', protect, authorize('company', 'individual'), respondToReview);

export default router;