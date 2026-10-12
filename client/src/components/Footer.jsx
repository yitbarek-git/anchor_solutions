import React from 'react';
import { BrandLogo } from '../assets/BrandLogo.jsx';
import { SocialLinks } from './SocialLinks.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { LOCATION_DATA } from '../utils/location.js';
import { MapPin, Phone, GraduationCap, ExternalLink } from 'lucide-react';

export function Footer({ navigate }) {
  const { t, language } = useLanguage();

  const officialCourses = [
    { slug: 'graphics-design', en: 'Graphics Design', am: 'ግራፊክስ ዲዛይን' },
    { slug: 'video-editing', en: 'Video Editing', am: 'ቪዲዮ ኤዲቲንግ' },
    { slug: 'photography', en: 'Photography', am: 'ፎቶግራፊ' },
    { slug: 'digital-marketing', en: 'Digital Marketing', am: 'ዲጂታል ማርኬቲንግ' },
    { slug: 'mobile-computer-maintenance', en: 'Mobile & Computer Maintenance', am: 'የስልክ እና የኮምፒውተር ጥገና' },
    { slug: 'basic-computer-skills', en: 'Basic Computer Skills', am: 'መሰረታዊ የኮምፒውተር እውቀት' },
    { slug: 'artificial-intelligence', en: 'Artificial Intelligence (AI)', am: 'ሰው ሰራሽ አስተውሎት' },
  ];

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Mission Column */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <BrandLogo size={42} />
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.65', color: '#CBD5E0', marginBottom: '1.25rem' }}>
              {t.footer.about}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
              <GraduationCap size={18} />
              <span>{language === 'am' ? 'ከቲስ አባይ ኮሌጅ ጋር በመተባበር' : 'In Partnership with Tis Abay College'}</span>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="footer-heading">{t.footer.quickLinks}</h4>
            <div className="footer-links">
              <button onClick={() => navigate('/')} style={{ textAlign: 'left' }}>{t.nav.home}</button>
              <button onClick={() => navigate('/courses')} style={{ textAlign: 'left' }}>{t.nav.courses}</button>
              <button onClick={() => navigate('/resources')} style={{ textAlign: 'left' }}>{t.nav.resources}</button>
              <button onClick={() => navigate('/about')} style={{ textAlign: 'left' }}>{t.nav.about}</button>
              <button onClick={() => navigate('/contact')} style={{ textAlign: 'left' }}>{t.nav.contact}</button>
            </div>
          </div>

          {/* Official 7 Courses Column */}
          <div>
            <h4 className="footer-heading">{t.footer.officialCourses}</h4>
            <div className="footer-links">
              {officialCourses.map((c) => (
                <button
                  key={c.slug}
                  onClick={() => navigate(`/courses/${c.slug}`)}
                  style={{ textAlign: 'left' }}
                >
                  {language === 'am' ? c.am : c.en}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Bahir Dar Campus Info */}
          <div>
            <h4 className="footer-heading">{language === 'am' ? 'የካምፓስ መረጃ' : 'Campus & Admissions'}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                <a
                  href={LOCATION_DATA.maps.viewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#E2E8F0', textDecoration: 'none', lineHeight: '1.45', transition: 'color var(--transition-fast)' }}
                  className="footer-address-link"
                  title={language === 'am' ? 'በGoogle ካርታ ላይ ይመልከቱ' : 'View on Google Maps'}
                >
                  {language === 'am' ? LOCATION_DATA.address.am : LOCATION_DATA.address.en}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <Phone size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', color: '#E2E8F0' }}>
                  <a href={LOCATION_DATA.phones[0].href} style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
                    {LOCATION_DATA.phones[0].display}
                  </a>
                  <span style={{ color: '#718096' }}>/</span>
                  <a href={LOCATION_DATA.phones[1].href} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {LOCATION_DATA.phones[1].display}
                  </a>
                </div>
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: '#A0AEC0', marginBottom: '0.4rem' }}>
                  {t.footer.followUs}
                </p>
                <SocialLinks />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {t.footer.rightsReserved}</p>
          <p style={{ color: 'var(--color-gold)' }}>{t.footer.bahirDarEthiopia}</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
