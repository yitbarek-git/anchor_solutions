import React, { useState, useEffect } from 'react';
import { BrandLogo } from '../assets/BrandLogo.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { LOCATION_DATA } from '../utils/location.js';
import { Sun, Moon, Menu, X, User, Shield, LogOut } from 'lucide-react';

export function Header({ currentPath, navigate }) {
  const { language, setLanguage, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setMobileMenuOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const handleNav = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { path: '/', label: t.nav.home },
    { path: '/courses', label: t.nav.courses },
    { path: '/resources', label: t.nav.resources },
    { path: '/about', label: t.nav.about },
    { path: '/contact', label: t.nav.contact },
  ];

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-inner">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNav('/')}
            className="brand-container"
            style={{ cursor: 'pointer', minWidth: 0, flexShrink: 1 }}
            role="link"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleNav('/')}
            aria-label="Anchor Solution Home"
          >
            <BrandLogo />
          </div>

          {/* Desktop Navigation */}
          <nav className="nav-links" aria-label="Main Navigation">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`nav-item ${currentPath === item.path ? 'active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Controls: Language, Theme, Auth */}
          <div className="header-actions">
            {/* Desktop Language Switcher (EN | አማ) */}
            <div className="control-pill desktop-lang-pill" role="group" aria-label="Language Selector">
              <button
                onClick={() => setLanguage('en')}
                className={`control-pill-btn ${language === 'en' ? 'active' : ''}`}
                aria-pressed={language === 'en'}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('am')}
                className={`control-pill-btn ${language === 'am' ? 'active' : ''}`}
                aria-pressed={language === 'am'}
              >
                አማ
              </button>
            </div>

            {/* Mobile Compact Language Toggle: One button displaying EN or አማ */}
            <button
              onClick={toggleLanguage}
              className="icon-btn mobile-lang-toggle"
              aria-label={language === 'en' ? 'Current language: English. Switch to Amharic' : 'ቋንቋ፡ አማርኛ። ወደ እንግሊዝኛ ለመቀየር ይጫኑ'}
              title={language === 'en' ? 'Switch to አማርኛ' : 'Switch to English'}
            >
              <span className="lang-toggle-text">{language === 'en' ? 'EN' : 'አማ'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="icon-btn"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Desktop Auth Actions */}
            <div className="header-auth-desktop">
              {isAuthenticated ? (
                <>
                  {isAdmin ? (
                    <button
                      onClick={() => handleNav('/admin')}
                      className={`btn btn-sm ${currentPath.startsWith('/admin') ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <Shield size={15} />
                      <span>{t.nav.admin}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleNav('/dashboard')}
                      className={`btn btn-sm ${currentPath === '/dashboard' ? 'btn-primary' : 'btn-secondary'}`}
                    >
                      <User size={15} />
                      <span>{t.nav.dashboard}</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      handleNav('/');
                    }}
                    className="icon-btn"
                    title={t.nav.logout}
                    aria-label={t.nav.logout}
                  >
                    <LogOut size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNav('/login')}
                    className="btn btn-secondary btn-sm"
                  >
                    {t.nav.login}
                  </button>
                  <button
                    onClick={() => handleNav('/register')}
                    className="btn btn-primary btn-sm"
                  >
                    {t.nav.register}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="icon-btn mobile-nav-toggle"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer Backdrop & Modal Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div
            id="mobile-navigation-drawer"
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <span className="mobile-drawer-title">{t.nav.courses} & Navigation</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="icon-btn"
                aria-label="Close navigation menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`nav-item mobile-nav-link ${currentPath === item.path ? 'active' : ''}`}
                >
                  <span>{item.label}</span>
                  {currentPath === item.path && <span className="mobile-nav-indicator">●</span>}
                </button>
              ))}
            </div>

            <div className="mobile-drawer-auth">
              {isAuthenticated ? (
                <div className="mobile-drawer-btn-stack">
                  <button
                    onClick={() => handleNav(isAdmin ? '/admin' : '/dashboard')}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {isAdmin ? <Shield size={16} /> : <User size={16} />}
                    <span>{isAdmin ? t.nav.admin : t.nav.dashboard}</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      handleNav('/');
                    }}
                    className="btn btn-secondary"
                    style={{ width: '100%' }}
                  >
                    <LogOut size={16} />
                    <span>{t.nav.logout}</span>
                  </button>
                </div>
              ) : (
                <div className="mobile-drawer-auth-grid">
                  <button
                    onClick={() => handleNav('/login')}
                    className="btn btn-secondary"
                  >
                    {t.nav.login}
                  </button>
                  <button
                    onClick={() => handleNav('/register')}
                    className="btn btn-primary"
                  >
                    {t.nav.register}
                  </button>
                </div>
              )}

              <a
                href={LOCATION_DATA.phones[0].href}
                className="btn btn-outline"
                style={{ width: '100%' }}
              >
                <span>📞 {LOCATION_DATA.phones[0].display}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
