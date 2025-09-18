// backend/middleware/validation/propertyRegistrationValidation.js
import { body } from 'express-validator';

export const validatePropertyRegistration = [
  body('propertyId')
    .notEmpty()
    .withMessage('Property ID is required')
    .isMongoId()
    .withMessage('Invalid property ID'),

  // Parse JSON fields if they come as strings (from FormData)
  body('personalInfo').custom((value, { req }) => {
    try {
      if (typeof value === 'string') {
        req.body.personalInfo = JSON.parse(value);
      }
      return true;
    } catch (error) {
      throw new Error('Invalid personalInfo JSON');
    }
  }),

  body('address').custom((value, { req }) => {
    try {
      if (typeof value === 'string') {
        req.body.address = JSON.parse(value);
      }
      return true;
    } catch (error) {
      throw new Error('Invalid address JSON');
    }
  }),

  body('emergencyContact').custom((value, { req }) => {
    try {
      if (typeof value === 'string') {
        req.body.emergencyContact = JSON.parse(value);
      }
      return true;
    } catch (error) {
      throw new Error('Invalid emergencyContact JSON');
    }
  }),

  body('financialInfo').custom((value, { req }) => {
    try {
      if (typeof value === 'string') {
        req.body.financialInfo = JSON.parse(value);
      }
      return true;
    } catch (error) {
      throw new Error('Invalid financialInfo JSON');
    }
  }),

  // Validate personalInfo fields
  body('personalInfo.firstName')
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),

  body('personalInfo.lastName')
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),

  body('personalInfo.email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('personalInfo.phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),

  // Validate address fields
  body('address.current.street')
    .notEmpty()
    .withMessage('Current street address is required'),

  body('address.current.city')
    .notEmpty()
    .withMessage('Current city is required'),

  body('address.current.region')
    .notEmpty()
    .withMessage('Current region is required'),

  // Validate emergency contact
  body('emergencyContact.name')
    .notEmpty()
    .withMessage('Emergency contact name is required'),

  body('emergencyContact.phone')
    .notEmpty()
    .withMessage('Emergency contact phone is required')
    .isMobilePhone('any')
    .withMessage('Please provide a valid emergency contact phone number'),

  body('emergencyContact.relationship')
    .notEmpty()
    .withMessage('Emergency contact relationship is required'),
];