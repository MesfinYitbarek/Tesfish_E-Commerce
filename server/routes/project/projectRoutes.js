// routes/projectRoutes.js (Public routes)
import express from 'express';
import {
  getPublicProjects,
  getProjectBySlug,
  getFeaturedProjects,
  getProjectsByCategory,
  searchProjects,
  incrementProjectViews
} from '../../controllers/project/projectController.js';

const router = express.Router();

// Public routes
router.get('/', getPublicProjects);
router.get('/featured', getFeaturedProjects);
router.get('/search', searchProjects);
router.get('/category/:category', getProjectsByCategory);
router.get('/:slug', getProjectBySlug);
router.post('/:slug/view', incrementProjectViews);

export default router;