import { Router } from 'express';
import { createPlace, deletePlace, getPlaceById, getPlaces, updatePlace } from '../controllers/placeController.js';
import { adminOnly, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.get('/', getPlaces);
router.get('/:id', getPlaceById);
router.post('/', protect, adminOnly, upload.single('image'), requireFields(['name', 'state', 'city', 'category', 'description']), createPlace);
router.put('/:id', protect, adminOnly, upload.single('image'), updatePlace);
router.delete('/:id', protect, adminOnly, deletePlace);

export default router;
