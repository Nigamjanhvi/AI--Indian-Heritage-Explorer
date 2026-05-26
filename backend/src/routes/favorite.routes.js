import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favorite.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, getFavorites);
router.post('/', protect, addFavorite);
router.delete('/:siteId', protect, removeFavorite);

export default router;
