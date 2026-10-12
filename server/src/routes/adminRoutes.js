import { Router } from 'express';
import { AdminController } from '../controllers/adminController.js';
import { PaymentController } from '../controllers/paymentController.js';
import { requireRole } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Protect all admin routes with requireRole(['admin'])
router.use(requireRole(['admin']));

router.get('/overview', AdminController.getOverview);
router.get('/courses', AdminController.getCourses);
router.post('/courses', AdminController.createCourse);
router.put('/courses/:id', AdminController.updateCourse);
router.delete('/courses/:id', AdminController.deleteCourse);

router.post('/modules', AdminController.createModule);
router.post('/lessons', AdminController.createLesson);
router.delete('/lessons/:id', AdminController.deleteLesson);

router.get('/students', AdminController.getStudents);
router.put('/settings', AdminController.updateSettings);
router.post('/upload', upload.single('file'), AdminController.uploadMedia);

// Admin payments verification
router.get('/payments', PaymentController.getAdminPayments);
router.post('/payments/:id/approve', PaymentController.approveAdmin);
router.post('/payments/:id/reject', PaymentController.rejectAdmin);

export default router;
