import { Router } from 'express';
import { SettingsController } from '../controllers/settingsController.js';

const router = Router();

router.get('/', SettingsController.getSettings);
router.get('/homepage', SettingsController.getHomepage);

export default router;
