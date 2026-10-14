import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { CourseCard } from '../components/CourseCard.jsx';
import { TisAbayPartnershipSection } from '../components/TisAbayPartnershipSection.jsx';
import { LOCATION_DATA } from '../utils/location.js';
import { Search, Sparkles, Award, ShieldCheck, Laptop, PhoneCall, ArrowRight, CheckCircle2 } from 'lucide-react';

export function HomePage({ navigate }) {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.courses.getAll({ lang: language });
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [language]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            <div>
              <div className="hero-kicker">
                <Sparkles size={16} />
                <span>{t.home.heroBadge}</span>
              </div>
              <h1 className="hero-title">
                {t.home.heroTitle}
              </h1>
              <p className="hero-subtitle">
                {t.home.heroSubtitle}
              </p>

              {/* "What would you like to learn?" Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hero-search-form">
                <div className="hero-search-input-wrap">
                  <Search size={18} className="hero-search-icon" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="form-input hero-search-input"
                  />
                </div>
                <button type="submit" className="btn btn-primary hero-search-btn">
                  {t.actions.search}
                </button>
              </form>

              {/* CTAs */}
              <div className="hero-ctas">
                <button onClick={() => navigate('/courses')} className="btn btn-primary btn-lg">
                  {t.actions.startLearning}
                </button>
                <button onClick={() => navigate('/about')} className="btn btn-secondary btn-lg">
                  {t.nav.about}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="hero-trust-badges">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                  <span>{t.home.partnerCollege}</span>
                </div>
                <span className="hero-trust-separator">·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                  <span>{t.home.campusLocation}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Highlights */}
            <div>
              <div className="hero-visual-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span className="badge badge-gold">
                    {t.common.officialTrainingHub}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Bahir Dar · Kebele 04
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 800 }}>
                  {t.common.vocationalAdvantage}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {t.common.hallmark1}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {t.common.hallmark2}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {t.common.hallmark3}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.common.admissionsHotline}</div>
                    <a href={LOCATION_DATA.phones[0].href} style={{ fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {LOCATION_DATA.phones[0].display}
                    </a>
                  </div>
                  <button onClick={() => navigate('/contact')} className="btn btn-outline btn-sm">
                    {t.nav.contact}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Seven Official Courses Showcase */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
              {language === 'am' ? 'ሰባቱ ይፋዊ ስልጠናዎች' : 'Seven Vocational Tracks'}
            </span>
            <h2 className="section-title">{t.home.trackTitle}</h2>
            <p className="section-subtitle">{t.home.trackSubtitle}</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              {t.common.loadingCatalog}
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} navigate={navigate} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => navigate('/courses')} className="btn btn-secondary btn-lg">
              <span>{t.actions.viewAll}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* Tis Abay College & Anchor Solutions Partnership & Vocational Tracks */}
      <TisAbayPartnershipSection navigate={navigate} />

      {/* Benefits Section */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{t.home.benefitsTitle}</h2>
            <p className="section-subtitle">{t.home.benefitsSubtitle}</p>
          </div>

          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <Laptop size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>{t.home.benefit1Title}</h3>
              <p style={{ fontSize: '0.92rem' }}>{t.home.benefit1Desc}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <Award size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>{t.home.benefit2Title}</h3>
              <p style={{ fontSize: '0.92rem' }}>{t.home.benefit2Desc}</p>
            </div>

            <div className="benefit-card">
              <div className="benefit-icon">
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '0.65rem' }}>{t.home.benefit3Title}</h3>
              <p style={{ fontSize: '0.92rem' }}>{t.home.benefit3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Admissions Call to Action Banner */}
      <section className="section admissions-banner-section">
        <div className="container">
          <div className="admissions-banner-inner">
            <h2 className="admissions-banner-title">
              {t.home.admissionsBannerTitle}
            </h2>
            <p className="admissions-banner-subtitle">
              {t.home.admissionsBannerSubtitle}
            </p>
            <div className="admissions-banner-ctas">
              <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
                {t.nav.register}
              </button>
              <a href={LOCATION_DATA.phones[0].href} className="btn btn-outline btn-lg admissions-banner-phone-btn">
                <PhoneCall size={18} />
                <span>{LOCATION_DATA.phones[0].display}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
