import { Router } from 'express';
import { chat, recommend } from '../controllers/ai.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/recommend', protect, recommend);
router.post('/chat', protect, chat);

export default router;
