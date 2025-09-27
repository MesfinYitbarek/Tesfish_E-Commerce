// routes/property/appointmentRoutes.js
import express from 'express';
import { body } from 'express-validator';
import {
  bookAppointment,
  getMyAppointments,
  getMyAssignments,
  getAdminOverview,
  updateAppointmentStatus,
  reassignAppointment,
  rescheduleAppointment,
  getAppointmentStats,
  exportAppointmentsCSV
} from '../../controllers/Appointment/appointmentController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { handleValidationErrors } from '../../middleware/validation/validationMiddleware.js';

const router = express.Router();

const appointmentValidation = [
  body('contactInfo.name').notEmpty().withMessage('Name is required'),
  body('contactInfo.email').isEmail().withMessage('Valid email is required'),
  body('contactInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('scheduledDateTime').isISO8601().withMessage('Valid date and time is required'),
  body('appointmentType').optional().isIn([
    'property-viewing', 
    'consultation', 
    'property-evaluation',
    'contract-discussion',
    'design-consultation',
    'project-meeting',
    'engineering-consultation'
  ]).withMessage('Invalid appointment type'),
  body('preferredDepartment').optional().isIn([
    'real-estate',
    'interior-design', 
    'project-management',
    'engineering',
    'marketing',
    'sales'
  ]).withMessage('Invalid department'),
  handleValidationErrors
];

const rescheduleValidation = [
  body('newDateTime').isISO8601().withMessage('Valid date and time is required'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  handleValidationErrors
];

const statusUpdateValidation = [
  body('status').isIn([
    'pending', 
    'confirmed', 
    'cancelled', 
    'completed', 
    'rescheduled', 
    'no-show'
  ]).withMessage('Invalid status'),
  body('notes').optional().isString().withMessage('Notes must be a string'),
  handleValidationErrors
];

const reassignValidation = [
  body('employeeId').isMongoId().withMessage('Valid employee ID is required'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
  handleValidationErrors
];

// All routes require authentication
router.use(protect);

// ✅ Customer routes
router.post('/', 
  authorize('customer'), 
  appointmentValidation, 
  bookAppointment
);

router.get('/my-appointments', 
  authorize('customer'), 
  getMyAppointments
);

// ✅ Employee routes
router.get('/my-assignments', 
  authorize('employee'), 
  getMyAssignments
);

router.put('/:id/status', 
  authorize('employee', 'admin'),
  statusUpdateValidation,
  updateAppointmentStatus
);

// ✅ Admin routes (full oversight and management)
router.get('/admin-overview', 
  authorize('admin'), 
  getAdminOverview
);

router.put('/:id/reassign',
  authorize('admin'),
  reassignValidation,
  reassignAppointment
);

router.get('/export-csv',
  authorize('admin'),
  exportAppointmentsCSV
);

// ✅ Shared routes (accessible by multiple user types)
router.get('/stats',
  authorize('employee', 'admin'),
  getAppointmentStats
);

router.put('/:id/reschedule', 
  authorize('customer', 'employee', 'admin'),
  rescheduleValidation,
  rescheduleAppointment
);

// ✅ Additional admin-only routes for comprehensive management
router.get('/department/:department',
  authorize('admin'),
  (req, res, next) => {
    req.query.department = req.params.department;
    next();
  },
  getAdminOverview
);

router.get('/employee/:employeeId',
  authorize('admin'),
  (req, res, next) => {
    req.query.assignedTo = req.params.employeeId;
    next();
  },
  getAdminOverview
);

export default router;