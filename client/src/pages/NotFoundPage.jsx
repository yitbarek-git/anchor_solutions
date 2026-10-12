import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Home } from 'lucide-react';

export function NotFoundPage({ navigate }) {
  const { t, language } = useLanguage();

  return (
    <div className="section" style={{ textAlign: 'center', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <div style={{ fontSize: '5rem', fontWeight: 900, color: 'var(--color-gold)', lineHeight: 1, marginBottom: '1rem' }}>
          404
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {language === 'am' ? 'ገጹ አልተገኘም' : 'Page Not Found'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: '1.6' }}>
          {language === 'am'
            ? 'የጠየቁት ገጽ አልተገኘም ወይም ተንቀሳቅሷል። ወደ ዋናው ገጽ ተመልሰው ሌሎች ስልጠናዎችን መመልከት ይችላሉ።'
            : 'The resource or path you requested does not exist. Use the button below to return to the Anchor Solution homepage.'}
        </p>
        <button onClick={() => navigate('/')} className="btn btn-primary btn-lg">
          <Home size={18} />
          <span>{t.nav.home}</span>
        </button>
      </div>
    </div>
  );
}

export default NotFoundPage;
