// routes/property/appointmentRoutes.js
import express from 'express';
import { body } from 'express-validator';
import {
  bookAppointment,
  getMyAppointments,
  getSellerAppointments,
  updateAppointmentStatus,
  rescheduleAppointment
} from '../../controllers/Appointment/appointmentController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();

const appointmentValidation = [
  body('contactInfo.name').notEmpty().withMessage('Name is required'),
  body('contactInfo.email').isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('scheduledDateTime').isISO8601().withMessage('Valid date and time is required'),
  handleValidationErrors
];

// All routes require authentication
router.use(protect);

// Customer routes
router.post('/', appointmentValidation, bookAppointment);
router.get('/my-appointments', getMyAppointments);

// Seller routes
router.get('/seller-appointments', 
  authorize('company', 'individual'), 
  getSellerAppointments
);

router.put('/:id/status', 
  authorize('company', 'individual', 'admin'),
  updateAppointmentStatus
);

// Shared routes
router.put('/:id/reschedule', rescheduleAppointment);

export default router;