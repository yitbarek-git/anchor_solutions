import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations.js';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('anchor_language') || 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'am') {
      document.body.classList.add('lang-am');
      document.body.classList.remove('lang-en');
    } else {
      document.body.classList.add('lang-en');
      document.body.classList.remove('lang-am');
    }
    localStorage.setItem('anchor_language', language);
  }, [language]);

  const setLanguage = (lang) => {
    if (['en', 'am'].includes(lang)) {
      setLanguageState(lang);
    }
  };

  const toggleLanguage = () => {
    setLanguageState(prev => (prev === 'en' ? 'am' : 'en'));
  };

  const t = translations[language] || translations.en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
