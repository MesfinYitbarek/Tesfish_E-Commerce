// routes/service/serviceInquiryRoutes.js
import express from 'express';
import { body } from 'express-validator';
import {
  createServiceInquiry,
  getMyInquiries,
  getProviderInquiries,
  getServiceInquiry,
  updateInquiryStatus,
  submitQuote,
  respondToQuote,
  addMessage,
  scheduleConsultation,
  getInquiryStats
} from '../../controllers/service/serviceInquiryController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { uploadMiddleware } from '../../middleware/upload/uploadMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();



const quoteValidation = [
  body('amount').isNumeric().withMessage('Quote amount must be a number'),
  body('currency').optional().isIn(['ETB', 'USD', 'EUR']),
  body('validUntil').isISO8601().withMessage('Valid until must be a valid date'),
  handleValidationErrors
];

const statusUpdateValidation = [
  body('status').isIn(['pending', 'under-review', 'quoted', 'negotiating', 'accepted', 'in-progress', 'completed', 'cancelled', 'rejected']),
  body('note').optional().isLength({ max: 1000 }).withMessage('Note cannot exceed 1000 characters'),
  handleValidationErrors
];

const consultationValidation = [
  body('dateTime').isISO8601().withMessage('Date and time must be valid'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('location').isIn(['online', 'office', 'site-visit', 'client-location']),
  body('meetingLink').optional().isURL().withMessage('Meeting link must be a valid URL'),
  handleValidationErrors
];

// All routes require authentication
router.use(protect);

// Customer routes - any authenticated user can create inquiries
router.post('/', 
  uploadMiddleware.array('attachments', 5),
  createServiceInquiry
);

router.get('/my-inquiries', getMyInquiries);

// Admin/Provider routes - only admins can manage service inquiries
router.get('/provider/inquiries', 
  authorize('admin'), 
  getProviderInquiries
);

router.get('/provider/stats', 
  authorize('admin'), 
  getInquiryStats
);

// Shared routes - customers can view their inquiries, admins can view all
router.get('/:id', getServiceInquiry);

// Admin-only routes for managing inquiries
router.put('/:id/status', 
  authorize('admin'),
  statusUpdateValidation,
  updateInquiryStatus
);

router.post('/:id/quote', 
  authorize('admin'),
  quoteValidation,
  submitQuote
);

router.put('/:id/quotes/:quoteId/respond',
  respondToQuote
);

router.post('/:id/consultation',
  authorize('admin'),
  consultationValidation,
  scheduleConsultation
);

// Communication - both customers and admins can send messages
router.post('/:id/message', addMessage);

export default router;