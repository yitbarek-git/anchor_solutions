import { Router } from 'express';
import { CourseController } from '../controllers/courseController.js';

const router = Router();

router.get('/', CourseController.getCourses);
router.get('/resources', CourseController.getResources);
router.get('/resources/:id/download', CourseController.downloadResource);
router.get('/lessons/:id', CourseController.getLesson);
router.get('/:slug', CourseController.getCourseBySlug);

export default router;
