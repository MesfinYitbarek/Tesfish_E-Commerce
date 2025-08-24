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
  addMessage,
  getInquiryStats,
  respondToQuote,
  scheduleConsultation
} from '../../controllers/service/serviceInquiryController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { uploadMiddleware } from '../../middleware/upload/uploadMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();

// Validation rules
const inquiryValidation = [
  body('serviceType').isIn(['project-management', 'engineering-design', 'interior-design', 'real-estate-consultancy']),
  body('projectDetails.title').notEmpty().withMessage('Project title is required'),
  body('projectDetails.description').notEmpty().withMessage('Project description is required'),
  body('projectDetails.budget.min').optional().isNumeric(),
  body('projectDetails.budget.max').optional().isNumeric(),
  handleValidationErrors
];

const quoteValidation = [
  body('amount').isNumeric().withMessage('Quote amount must be a number'),
  body('currency').optional().isIn(['ETB', 'USD', 'EUR']),
  body('validUntil').optional().isISO8601().withMessage('Valid until must be a valid date'),
  handleValidationErrors
];

const messageValidation = [
  body('message').notEmpty().withMessage('Message is required'),
  handleValidationErrors
];

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/',
  uploadMiddleware.array('attachments', 5),
  inquiryValidation,
  createServiceInquiry
);
router.get('/my-inquiries', getMyInquiries);

// Service provider routes (Admin only)
router.get('/provider/inquiries',
  authorize('admin'),
  getProviderInquiries
);
router.get('/provider/stats',
  authorize('admin'),
  getInquiryStats
);

// Shared routes
router.get('/:id', getServiceInquiry);
router.put('/:id/status', updateInquiryStatus);
router.post('/:id/message', messageValidation, addMessage);

// Provider-only routes
router.post('/:id/quote',
  authorize('admin'),
  quoteValidation,
  submitQuote
);
router.post('/:id/consultation',
  authorize('admin'),
  scheduleConsultation
);

// Customer quote response
router.put('/:id/quotes/:quoteId/respond', respondToQuote);

export default router;