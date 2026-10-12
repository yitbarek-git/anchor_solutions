import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { Alert } from '../components/Alert.jsx';
import { Modal } from '../components/Modal.jsx';
import { api } from '../services/api.js';
import { BrandLogo } from '../assets/BrandLogo.jsx';
import { LogIn, Key, Shield, UserCheck } from 'lucide-react';

export function LoginPage({ navigate }) {
  const { t, language } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotNotice, setForgotNotice] = useState(null);
  const [googleNotice, setGoogleNotice] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role) => {
    if (role === 'admin') {
      setEmail('admin@anchorsolution.et');
      setPassword('Admin@Anchor2026');
    } else {
      setEmail('student@anchorsolution.et');
      setPassword('Student@Anchor2026');
    }
  };

  const handleGoogleClick = async () => {
    try {
      const res = await api.auth.google();
      if (!res.configured) {
        setGoogleNotice(res.message);
      } else if (res.authUrl) {
        window.location.href = res.authUrl;
      }
    } catch (err) {
      setGoogleNotice(err.message);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.auth.forgotPassword(forgotEmail);
      setForgotNotice(res.message + ' (' + res.note + ')');
    } catch (err) {
      setForgotNotice(err.message);
    }
  };

  return (
    <div className="section" style={{ display: 'flex', alignItems: 'center', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '480px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-block', marginBottom: '1rem' }}>
              <BrandLogo size={42} showWordmark={false} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {t.auth.loginTitle}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {t.auth.loginSubtitle}
            </p>
          </div>

          {error && <Alert type="error" message={error} />}
          {googleNotice && <Alert type="info" message={googleNotice} />}

          {/* Demo Credentials Quick Buttons */}
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
              {t.auth.demoLoginNotice}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemoFill('admin')}
                className="btn btn-secondary btn-sm"
              >
                <Shield size={14} />
                <span>Admin Demo</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('student')}
                className="btn btn-secondary btn-sm"
              >
                <UserCheck size={14} />
                <span>Student Demo</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">{t.auth.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                placeholder="name@example.com"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">{t.auth.password}</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600 }}
                >
                  {t.auth.forgotPassword}
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.75rem', marginBottom: '1rem' }}
            >
              <LogIn size={18} />
              <span>{loading ? 'Signing in...' : t.nav.login}</span>
            </button>

            {/* Google OAuth Scaffolded Button */}
            <button
              type="button"
              onClick={handleGoogleClick}
              className="btn btn-secondary"
              style={{ width: '100%', marginBottom: '1.5rem' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>{t.auth.googleSignIn}</span>
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <span>{t.auth.dontHaveAccount} </span>
              <button
                type="button"
                onClick={() => navigate('/register')}
                style={{ color: 'var(--color-gold)', fontWeight: 700 }}
              >
                {t.nav.register}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setForgotNotice(null);
        }}
        title="Reset Password"
      >
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          Enter your registered email address to receive password recovery instructions.
        </p>
        {forgotNotice && <Alert type="info" message={forgotNotice} />}
        <form onSubmit={handleForgotSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="form-input"
              placeholder="name@example.com"
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
            Send Reset Instructions
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default LoginPage;
