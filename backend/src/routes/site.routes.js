import { Router } from 'express';
import { adminOnly, protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createSite, deleteSite, getAllSites, getSiteById, getSuggestions, updateSite } from '../controllers/site.controller.js';

const router = Router();
router.get('/getall', getAllSites);
router.get('/suggestions', getSuggestions);
router.get('/getbyid/:id', getSiteById);
router.post('/create', protect, adminOnly, upload.array('images', 6), createSite);
router.put('/update/:id', protect, adminOnly, upload.array('images', 6), updateSite);
router.delete('/delete/:id', protect, adminOnly, deleteSite);

export default router;
