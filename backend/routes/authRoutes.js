import { Router } from 'express';
import { forgotPassword, getProfile, loginUser, registerUser, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.post('/register', requireFields(['name', 'email', 'password']), registerUser);
router.post('/login', requireFields(['email', 'password']), loginUser);
router.post('/forgot-password', requireFields(['email']), forgotPassword);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

export default router;
