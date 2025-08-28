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

// Middleware to parse JSON strings from FormData
const parseFormDataJSON = (req, res, next) => {
  try {
    // Parse JSON strings from FormData
    if (req.body.personalInfo) {
      req.body.personalInfo = JSON.parse(req.body.personalInfo);
    }
    if (req.body.address) {
      req.body.address = JSON.parse(req.body.address);
    }
    if (req.body.emergencyContact) {
      req.body.emergencyContact = JSON.parse(req.body.emergencyContact);
    }
    if (req.body.financialInfo) {
      req.body.financialInfo = JSON.parse(req.body.financialInfo);
    }
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON data in request',
      error: error.message
    });
  }
};

const registrationValidation = [
  body('propertyId').notEmpty().withMessage('Property ID is required'),
  body('personalInfo.firstName').notEmpty().withMessage('First name is required'),
  body('personalInfo.lastName').notEmpty().withMessage('Last name is required'),
  body('personalInfo.email').isEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('personalInfo.occupation').notEmpty().withMessage('Occupation is required'),
  body('address.current.street').notEmpty().withMessage('Current street address is required'),
  body('address.current.city').notEmpty().withMessage('Current city is required'),
  body('address.current.region').notEmpty().withMessage('Current region is required'),
  body('emergencyContact.name').notEmpty().withMessage('Emergency contact name is required'),
  body('emergencyContact.phone').notEmpty().withMessage('Emergency contact phone is required'),
  body('emergencyContact.relationship').notEmpty().withMessage('Emergency contact relationship is required'),
  handleValidationErrors
];

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', 
  uploadMiddleware.array('documents', 5),
  parseFormDataJSON,
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