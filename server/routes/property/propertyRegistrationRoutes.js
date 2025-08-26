// routes/property/propertyRegistrationRoutes.js
import express from 'express';
import { body } from 'express-validator';
import {
  submitRegistration,
  verifyRegistrationPayment,
  getMyRegistrations,
  getCompanyRegistrations,
  updateRegistrationStatus,
  exportRegistrationsCSV
} from '../../controllers/property/propertyRegistrationController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { uploadMiddleware } from '../../middleware/upload/uploadMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();

const registrationValidation = [
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('address.current.city').notEmpty().withMessage('Current city is required'),
  handleValidationErrors
];

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', 
  uploadMiddleware.array('documents', 5),
  registrationValidation,
  submitRegistration
);

router.post('/:id/verify-payment', verifyRegistrationPayment);
router.get('/my-registrations', getMyRegistrations);

// Seller routes
router.get('/company-registrations', 
  authorize('company', 'individual'), 
  getCompanyRegistrations
);

router.put('/:id/status', 
  authorize('company', 'individual', 'admin'),
  updateRegistrationStatus
);

router.get('/export-csv', 
  authorize('company', 'individual'),
  exportRegistrationsCSV
);

export default router;



