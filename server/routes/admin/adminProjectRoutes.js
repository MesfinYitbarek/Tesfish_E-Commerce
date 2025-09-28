// routes/admin/projectRoutes.js
import express from 'express';
import {
  getProjectsForAdmin,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
  updateProjectStatus,
  getProjectStats,
  getProjectCategories,
  updateProjectProgress,
  toggleFeaturedProject,
  duplicateProject,
  deleteMultipleProjects
} from '../../controllers/admin/adminProjectController.js';
import { protect, authorize } from '../../middleware/auth/authMiddleware.js';
import { upload } from '../../middleware/upload/uploadMiddleware.js';
import {
  validateProjectCreation,
  validateProjectUpdate,
  validateProjectStatus
} from '../../middleware/validation/projectValidation.js';

const router = express.Router();

// Apply protection and admin authorization to all routes
router.use(protect);
router.use(authorize('admin'));

// Statistics routes
router.get('/stats', getProjectStats);
router.get('/categories', getProjectCategories);

// CRUD routes
router.route('/')
  .get(getProjectsForAdmin)
  .post(upload.array('images', 10), validateProjectCreation, createProject);

router.route('/:id')
  .get(getProjectById)
  .put(upload.array('images', 10), validateProjectUpdate, updateProject)
  .delete(deleteProject);

// Special actions
router.put('/:id/status', validateProjectStatus, updateProjectStatus);
router.put('/:id/progress', updateProjectProgress);
router.put('/:id/featured', toggleFeaturedProject);
router.post('/:id/duplicate', duplicateProject);
router.delete('/bulk', deleteMultipleProjects);

export default router;