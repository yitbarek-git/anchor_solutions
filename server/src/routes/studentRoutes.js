import { Router } from 'express';
import { StudentController } from '../controllers/studentController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', StudentController.getDashboard);
router.post('/lessons/:lessonId/toggle-complete', StudentController.toggleCompletion);
router.post('/lessons/:lessonId/toggle-bookmark', StudentController.toggleBookmark);
router.post('/enroll', StudentController.enroll);

export default router;
