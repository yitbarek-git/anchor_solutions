import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { getStore } from '../database/db.js';

export class AuthService {
  static generateToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );
  }

  static async register({ email, password, firstName, lastName, phone, language = 'en' }) {
    const store = getStore();
    const normalizedEmail = email.trim().toLowerCase();

    const existing = store.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      const error = new Error('An account with this email address already exists.');
      error.statusCode = 409;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: store.users.length > 0 ? Math.max(...store.users.map(u => u.id)) + 1 : 1,
      email: normalizedEmail,
      password_hash: passwordHash,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone_number: phone ? phone.trim() : null,
      preferred_language: ['en', 'am'].includes(language) ? language : 'en',
      theme_preference: 'light',
      is_active: 1,
      role: 'student', // Public registration is strictly student role
      created_at: new Date().toISOString(),
    };

    store.users.push(newUser);

    const token = this.generateToken(newUser);
    return {
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        phone: newUser.phone_number,
        role: newUser.role,
        preferredLanguage: newUser.preferred_language,
        themePreference: newUser.theme_preference,
      },
    };
  }

  static async login({ email, password }) {
    const store = getStore();
    const normalizedEmail = email.trim().toLowerCase();

    const user = store.users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (!user || !user.is_active) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone_number,
        role: user.role,
        preferredLanguage: user.preferred_language,
        themePreference: user.theme_preference,
      },
    };
  }

  static async updateProfile(userId, updates) {
    const store = getStore();
    const user = store.users.find(u => u.id === userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (updates.firstName) user.first_name = updates.firstName.trim();
    if (updates.lastName) user.last_name = updates.lastName.trim();
    if (updates.phone !== undefined) user.phone_number = updates.phone ? updates.phone.trim() : null;
    if (updates.preferredLanguage && ['en', 'am'].includes(updates.preferredLanguage)) {
      user.preferred_language = updates.preferredLanguage;
    }
    if (updates.themePreference && ['light', 'dark'].includes(updates.themePreference)) {
      user.theme_preference = updates.themePreference;
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone_number,
      role: user.role,
      preferredLanguage: user.preferred_language,
      themePreference: user.theme_preference,
    };
  }

  static async handleGoogleAuth() {
    // Honest interface documentation: Google OAuth requires verified client ID & secret
    if (!config.googleOAuth.clientId || !config.googleOAuth.clientSecret) {
      return {
        configured: false,
        message: 'Google Sign-In is not configured yet. Please configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in environment variables to enable Google authentication.',
      };
    }
    return {
      configured: true,
      authUrl: `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.googleOAuth.clientId}&redirect_uri=${encodeURIComponent(config.googleOAuth.callbackUrl)}&response_type=code&scope=openid%20email%20profile`,
    };
  }

  static async requestPasswordReset(email) {
    const store = getStore();
    const user = store.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    // Safe response: does not leak whether email exists
    return {
      success: true,
      message: 'If an account with that email exists, password reset instructions have been sent.',
      isSimulated: true,
      note: 'SMTP Mailer service interface ready. In production, configure SMTP credentials to dispatch live reset emails.',
    };
  }
}

export default AuthService;
