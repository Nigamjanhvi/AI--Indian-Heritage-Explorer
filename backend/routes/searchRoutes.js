import { Router } from 'express';
import { searchPlaces } from '../controllers/placeController.js';

const router = Router();

router.get('/', searchPlaces);

export default router;
