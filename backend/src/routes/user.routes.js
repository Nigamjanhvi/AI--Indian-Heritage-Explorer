import { Router } from 'express';
import { getAdminStats, getProfile, updateProfile } from '../controllers/user.controller.js';
import { adminOnly, protect } from '../middleware/auth.js';

const router = Router();
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.get('/admin/stats', protect, adminOnly, getAdminStats);

export default router;
