import { AuthService } from '../services/authService.js';

export class AuthController {
  static async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, phone, language } = req.body;
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email, password, first name, and last name.',
        });
      }
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters.',
        });
      }
      const result = await AuthService.register({ email, password, firstName, lastName, phone, language });
      res.status(201).json({
        success: true,
        message: 'Registration successful.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both email and password.',
        });
      }
      const result = await AuthService.login({ email, password });
      res.json({
        success: true,
        message: 'Login successful.',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static async me(req, res) {
    if (!req.user) {
      return res.status(401).json({ success: false, user: null });
    }
    res.json({
      success: true,
      user: req.user,
    });
  }

  static async updateProfile(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }
      const updated = await AuthService.updateProfile(req.user.id, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  static async googleAuth(req, res, next) {
    try {
      const result = await AuthService.handleGoogleAuth();
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required.' });
      }
      const result = await AuthService.requestPasswordReset(email);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}

export default AuthController;
