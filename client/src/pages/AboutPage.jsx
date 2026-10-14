import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { TisAbayPartnershipSection } from '../components/TisAbayPartnershipSection.jsx';
import { LOCATION_DATA } from '../utils/location.js';
import { Award, Compass, HeartHandshake, MapPin, CheckCircle2 } from 'lucide-react';

export function AboutPage({ navigate }) {
  const { t, language } = useLanguage();

  return (
    <div>
      {/* Hero Banner */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '4rem 0' }}>
        <div className="container">
          <div style={{ maxWidth: '820px' }}>
            <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
              {language === 'am' ? 'ስለ አንከር ሶሉሽን' : 'About Anchor Solution'}
            </span>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.25rem', fontWeight: 800 }}>
              {t.aboutPage.title}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>
              {t.aboutPage.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <div className="benefit-icon">
                <Compass size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem' }}>{t.aboutPage.missionTitle}</h3>
              <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>{t.aboutPage.missionDesc}</p>
            </div>

            <div className="card" style={{ padding: '2rem' }}>
              <div className="benefit-icon">
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem' }}>{t.aboutPage.visionTitle}</h3>
              <p style={{ lineHeight: '1.7', color: 'var(--text-secondary)' }}>{t.aboutPage.visionDesc}</p>
            </div>
          </div>

          {/* Academic Partnership & Vocational Programs */}
          <div style={{ marginBottom: '4rem' }}>
            <TisAbayPartnershipSection navigate={navigate} />
          </div>

          {/* Physical Presence in Bahir Dar */}
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto' }}>
            <MapPin size={32} style={{ color: 'var(--color-gold)', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem' }}>{t.aboutPage.leadershipTitle}</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1.5rem' }}>
              {t.aboutPage.leadershipDesc}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/contact')} className="btn btn-primary">
                {t.nav.contact}
              </button>
              <a
                href={LOCATION_DATA.maps.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                {t.aboutPage.viewOnMaps}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
