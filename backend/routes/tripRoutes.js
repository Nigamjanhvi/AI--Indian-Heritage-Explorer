import { Router } from 'express';
import { createTrip, generateTripItinerary, getTrips } from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validate.js';

const router = Router();

router.get('/', protect, getTrips);
router.post('/', protect, requireFields(['days']), createTrip);
router.post('/generate', protect, requireFields(['days']), generateTripItinerary);

export default router;
