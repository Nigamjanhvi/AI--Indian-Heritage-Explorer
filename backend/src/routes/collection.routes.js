import { Router } from 'express';
import { createCollection, deleteCollection, getCollections, updateCollection } from '../controllers/collection.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, getCollections);
router.post('/', protect, createCollection);
router.put('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);

export default router;
