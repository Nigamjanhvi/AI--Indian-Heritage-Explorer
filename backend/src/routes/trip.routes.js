import { Router } from 'express';
import { createTrip, deleteTrip, getTrips, updateTrip } from '../controllers/trip.controller.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.get('/', protect, getTrips);
router.post('/', protect, createTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

export default router;
