import { Router } from 'express';
import { AIAssistantController } from '../controllers/aiAssistantController.js';

const router = Router();

// Public chat endpoint with built-in sanitization and defensive guardrails
router.post('/chat', AIAssistantController.chat);

export default router;
