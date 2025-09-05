// routes/property/appointmentRoutes.js
import express from 'express';
import { body } from 'express-validator';
import {
  bookAppointment,
  getMyAppointments,
  getAdminAppointments,
  updateAppointmentStatus,
  rescheduleAppointment,
  getAppointmentStats,
  exportAppointmentsCSV,
  assignAppointmentToAdmin
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

// Admin-only routes (appointment management)
router.get('/admin-appointments', 
  authorize('admin'), 
  getAdminAppointments
);

router.get('/stats',
  authorize('admin'),
  getAppointmentStats
);

router.get('/export-csv',
  authorize('admin'),
  exportAppointmentsCSV
);

router.put('/:id/status', 
  authorize('admin'),
  updateAppointmentStatus
);

router.put('/:id/assign',
  authorize('admin'),
  assignAppointmentToAdmin
);

// Shared routes (customers can reschedule, admins can reschedule)
router.put('/:id/reschedule', rescheduleAppointment);

export default router;