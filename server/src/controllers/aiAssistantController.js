import { AIAssistantService } from '../services/aiAssistantService.js';

export class AIAssistantController {
  static async chat(req, res, next) {
    try {
      const { message, conversationHistory, language } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ success: false, error: 'A valid text message is required' });
      }

      const result = await AIAssistantService.ask({
        message,
        conversationHistory,
        language: language || 'en',
      });

      return res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      console.error('[AI Assistant Error]', err);
      return res.status(500).json({
        success: false,
        error: 'Failed to process AI assistant response. Please try again.',
      });
    }
  }
}
