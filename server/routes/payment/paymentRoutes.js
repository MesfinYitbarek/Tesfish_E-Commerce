import express from 'express';
import {
  processPayment,
  getPayment,
  getMyPayments,
  requestRefund
} from '../../controllers/payment/paymentController.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

router.post('/process', protect, processPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/:id', protect, getPayment);
router.post('/:id/refund', protect, requestRefund);

export default router;