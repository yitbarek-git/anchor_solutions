import React from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
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

          {/* Academic Partnership */}
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', marginBottom: '4rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
              <div>
                <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
                  {language === 'am' ? 'የትምህርት አጋርነት' : 'Academic Synergy'}
                </span>
                <h2 style={{ fontSize: '1.85rem', marginBottom: '1rem' }}>
                  {language === 'am' ? 'ከቲስ አባይ ኮሌጅ ጋር የተጣመረ ጥራት' : 'Partnered with Tis Abay College'}
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '1.5rem' }}>
                  {language === 'am'
                    ? 'አንከር ሶሉሽን ከቲስ አባይ ኮሌጅ ጋር በቅርበት በመተባበር ደረጃቸውን የጠበቁ የስርዓተ-ትምህርት መመሪያዎችን እና ህጋዊ ሰርተፊኬቶችን ያቀርባል። ስልጠናውን ያጠናቀቁ ተማሪዎች በአገር ውስጥና በውጭ አገር የስራ ገበያ ውስጥ ተወዳዳሪ እንዲሆኑ ይደረጋል።'
                    : 'Through our academic alliance with Tis Abay College, Anchor Solution provides verified vocational certifications, validated syllabi, and structured evaluation rubrics recognized by Ethiopian institutions and international freelance employers.'}
                </p>
                <button onClick={() => navigate('/courses')} className="btn btn-primary">
                  {t.actions.viewAll}
                </button>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: 700 }}>
                  {language === 'am' ? 'የስልጠና መለያዎቻችን' : 'Core Training Hallmarks'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.92rem' }}>100% Practical laboratory execution on modern equipment</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.92rem' }}>Bilingual instruction tailored for local and foreign freelance markets</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ fontSize: '0.92rem' }}>Verified certificate awarded upon practical project completion</span>
                  </div>
                </div>
              </div>
            </div>
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
                {language === 'am' ? 'በGoogle ካርታ ይመልከቱ' : 'View on Google Maps'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
