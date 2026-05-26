import { Router } from 'express';
import { chat, itinerary } from '../controllers/aiController.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.post('/chat', requireFields(['message']), chat);
router.post('/itinerary', requireFields(['days']), itinerary);

export default router;
