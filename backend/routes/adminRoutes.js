import { Router } from 'express';
import { dashboardAnalytics } from '../controllers/adminController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/analytics', protect, adminOnly, dashboardAnalytics);

export default router;
