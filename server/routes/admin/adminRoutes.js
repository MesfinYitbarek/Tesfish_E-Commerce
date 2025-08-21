import express from 'express';
import {
  getDashboardStats,
  getAnalytics,
  updateSettings,
  moderateReview,
  exportData
} from '../../controllers/admin/adminController.js';
import { authorize } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// All admin routes require admin authorization
router.use(authorize('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/analytics', getAnalytics);
router.put('/settings', updateSettings);
router.put('/reviews/:id/moderate', moderateReview);
router.get('/export/:type', exportData);

export default router;