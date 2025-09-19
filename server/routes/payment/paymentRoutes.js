import express from 'express';
import { chapaWebhook } from '../../controllers/chapa/chapaWebhook.js';
import { protect } from '../../middleware/auth/authMiddleware.js';
import { processPayment, getPayment, getMyPayments, requestRefund } from '../../controllers/payment/paymentController.js';

const router = express.Router();

router.post('/process', protect, processPayment);
router.get('/my-payments', protect, getMyPayments);
router.get('/:id', protect, getPayment);
router.post('/:id/refund', protect, requestRefund);

// ✅ Use raw body parser for webhook only
router.get('/chapa/webhook', express.raw({ type: 'application/json' }), chapaWebhook);
router.post('/chapa/webhook', express.raw({ type: 'application/json' }), chapaWebhook);

export default router;
