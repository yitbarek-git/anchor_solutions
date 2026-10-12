import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { getStore } from '../database/db.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const store = getStore();
    const user = store.users.find(u => u.id === decoded.id);
    if (!user || !user.is_active) {
      req.user = null;
      return next();
    }
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role || 'student',
      preferredLanguage: user.preferred_language,
      themePreference: user.theme_preference,
    };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in to access this resource.',
    });
  }
  next();
}

export function requireRole(allowedRoles = ['admin']) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions for this operation.',
      });
    }
    next();
  };
}

export default {
  authenticate,
  requireAuth,
  requireRole,
};
