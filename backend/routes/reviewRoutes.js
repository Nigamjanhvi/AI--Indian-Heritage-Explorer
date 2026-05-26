import { Router } from 'express';
import { addReview, deleteReview, getReviewsByPlace } from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.post('/', protect, requireFields(['place', 'rating', 'comment']), addReview);
router.get('/:placeId', getReviewsByPlace);
router.delete('/:id', protect, deleteReview);

export default router;
