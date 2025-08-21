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
  getInquiryStats
} from '../../controllers/service/serviceInquiryController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { uploadMiddleware } from '../../middleware/upload/uploadMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();

// Validation rules
const inquiryValidation = [
  body('serviceProvider').notEmpty().withMessage('Service provider is required'),
  body('serviceType').isIn(['project-management', 'engineering-design', 'interior-design', 'consultancy', 'other']),
  body('projectDetails.title').notEmpty().withMessage('Project title is required'),
  body('projectDetails.description').notEmpty().withMessage('Project description is required'),
  handleValidationErrors
];

const quoteValidation = [
  body('amount').isNumeric().withMessage('Quote amount must be a number'),
  body('currency').optional().isIn(['ETB', 'USD', 'EUR']),
  body('validUntil').optional().isISO8601().withMessage('Valid until must be a valid date'),
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

// Service provider routes
router.get('/provider/inquiries', 
  authorize('company', 'individual'), 
  getProviderInquiries
);

router.get('/provider/stats', 
  authorize('company', 'individual'), 
  getInquiryStats
);

// Shared routes (customer, provider, admin)
router.get('/:id', getServiceInquiry);
router.put('/:id/status', updateInquiryStatus);
router.post('/:id/message', addMessage);

// Provider-only routes
router.post('/:id/quote', 
  authorize('company', 'individual'),
  quoteValidation,
  submitQuote
);

export default router;