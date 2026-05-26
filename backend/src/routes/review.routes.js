import { Router } from 'express';
import { addReview, deleteReview, updateReview } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, addReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
