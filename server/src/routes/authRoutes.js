import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', AuthController.me);
router.put('/profile', requireAuth, AuthController.updateProfile);
router.get('/google', AuthController.googleAuth);
router.post('/forgot-password', AuthController.forgotPassword);

export default router;
