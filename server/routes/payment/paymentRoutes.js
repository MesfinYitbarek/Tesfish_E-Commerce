import express from 'express';
import {
  processPayment,
  getPayment,
  getMyPayments,
  requestRefund
} from '../../controllers/payment/paymentController.js';
import { protect } from '../../middleware/auth/authMiddleware.js';
import { chapaWebhook } from '../../controllers/chapa/chapaWebhook.js';

const router = express.Router();

// Chapa Webhook (both GET and POST, for safety)
router.get('/chapa/webhook', chapaWebhook);
router.post('/chapa/webhook', chapaWebhook);

// Payment routes
router.post('/process', protect, processPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/:id', protect, getPayment);
router.post('/:id/refund', protect, requestRefund);

export default router;