// middleware/validation/projectValidation.js
import { body } from 'express-validator';

export const validateProjectCreation = [
  body('title')
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('category')
    .notEmpty()
    .withMessage('Project category is required')
    .isIn(['project-management', 'engineering', 'interior', 'real-estate', 'mineral', 'construction', 'consulting'])
    .withMessage('Invalid project category'),

  body('status')
    .optional()
    .isIn(['completed', 'ongoing', 'planning', 'paused', 'cancelled'])
    .withMessage('Invalid project status'),
];

export const validateProjectUpdate = [
  body('title')
    .optional()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),

  body('description')
    .optional()
    .isLength({ min: 10, max: 500 })
    .withMessage('Description must be between 10 and 500 characters'),

  body('category')
    .optional()
    .isIn(['project-management', 'engineering', 'interior', 'real-estate', 'mineral', 'construction', 'consulting'])
    .withMessage('Invalid project category'),

  body('status')
    .optional()
    .isIn(['completed', 'ongoing', 'planning', 'paused', 'cancelled'])
    .withMessage('Invalid project status'),
];

export const validateProjectStatus = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['completed', 'ongoing', 'planning', 'paused', 'cancelled'])
    .withMessage('Invalid project status'),
];