import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, getFavorites);
router.post('/:placeId', protect, addFavorite);
router.delete('/:placeId', protect, removeFavorite);

export default router;
