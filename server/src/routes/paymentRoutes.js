import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Public payment configuration & Telebirr instructions
router.get('/config', PaymentController.getConfig);
router.get('/methods', PaymentController.getConfig);
router.get('/status', PaymentController.getConfig);

// Student payment submission and personal payment history
router.post('/submit', requireAuth, PaymentController.submit);
router.get('/my-payments', requireAuth, PaymentController.getMyPayments);
router.get('/course/:courseId', requireAuth, PaymentController.getCourseStatus);

// Admin verification and management routes
router.get('/admin/all', requireRole(['admin']), PaymentController.getAdminPayments);
router.post('/admin/:id/approve', requireRole(['admin']), PaymentController.approveAdmin);
router.post('/admin/:id/reject', requireRole(['admin']), PaymentController.rejectAdmin);

export default router;
