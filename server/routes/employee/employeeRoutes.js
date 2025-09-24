import express from 'express';
import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee
} from '../../controllers/employee/employeeController.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Admin-only employee management
router.post('/create', protect, createEmployee);
router.get('/', protect, getEmployees);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

export default router;
