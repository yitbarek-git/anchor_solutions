import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { CourseCard } from '../components/CourseCard.jsx';
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
      {/* Demonstration Banner */}
      <div style={{ backgroundColor: 'var(--color-gold-subtle)', borderBottom: '1px solid rgba(212, 175, 55, 0.25)', padding: '0.45rem 1rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <span>
          {language === 'am'
            ? 'ማስታወሻ፡ ይህ ይፋዊው የአንከር ሶሉሽን የትምህርት ፖርታል ነው። የስልጠና ምዝገባ በባህር ዳር ካምፓስ ክፍት ነው።'
            : 'Demonstration Environment: Anchor Solution bilingual educational platform active with official curriculum.'}
        </span>
      </div>

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
              <form onSubmit={handleSearchSubmit} className="hero-search-form" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '540px', marginBottom: '1.5rem', width: '100%' }}>
                <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 0 }}>
                  <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.home.searchPlaceholder}
                    className="form-input"
                    style={{ paddingLeft: '2.75rem', height: '48px', borderRadius: 'var(--radius-md)' }}
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ height: '48px', padding: '0 1.5rem', flexShrink: 0 }}>
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
                  <Award size={18} style={{ color: 'var(--color-gold)' }} />
                  <span>{t.home.partnerCollege}</span>
                </div>
                <span>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={18} style={{ color: 'var(--color-gold)' }} />
                  <span>{t.home.campusLocation}</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Highlights */}
            <div>
              <div className="hero-visual-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span className="badge badge-gold">
                    {language === 'am' ? 'ይፋዊ የስልጠና ማዕከል' : 'Official Training Hub'}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Bahir Dar · Kebele 04
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 800 }}>
                  {language === 'am' ? 'የተግባራዊ ስልጠናዎች መግቢያ' : 'Vocational Advantage'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {language === 'am'
                        ? 'በአዶቤ፣ ካፕከት፣ ፎቶሾፕ እና ፕሪሚየር ፕሮ የተሟላ የቪዲዮ እና ዲዛይን ላብራቶሪ'
                        : 'Dedicated multimedia labs equipped for Photoshop, Premiere Pro, and After Effects'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {language === 'am'
                        ? 'የስልክ እና የኮምፒውተር ሃርድዌር መገጣጠም፣ ስክሪን መቀየር እና የቦርድ ጥገና'
                        : 'Real hardware diagnostics workstations: screen swaps, board checks, and PC assembly'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '3px' }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {language === 'am'
                        ? 'የቴሌግራም ቻናል ማሳደግ፣ የኦንላይን ማርኬቲንግ እና የAI መሳሪያዎች አጠቃቀም'
                        : 'Telegram marketing funnels, commercial advertising campaigns, and workplace AI tools'}
                    </span>
                  </div>
                </div>

                <div style={{ padding: '1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{language === 'am' ? 'የመረጃ ስልክ' : 'Admissions Hotline'}</div>
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
              {language === 'am' ? 'ሰባቱ ኦፊሴላዊ ኮርሶች' : 'Curriculum Showcase'}
            </span>
            <h2 className="section-title">{t.home.trackTitle}</h2>
            <p className="section-subtitle">{t.home.trackSubtitle}</p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading courses...
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
      <section className="section" style={{ background: 'linear-gradient(135deg, #171717 0%, #252525 100%)', color: '#FFFFFF' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
            <h2 style={{ color: '#FFFFFF', fontSize: '2.2rem', marginBottom: '1rem' }}>
              {t.home.admissionsBannerTitle}
            </h2>
            <p style={{ color: '#CBD5E0', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: '1.6' }}>
              {t.home.admissionsBannerSubtitle}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => navigate('/register')} className="btn btn-primary btn-lg">
                {t.nav.register}
              </button>
              <a href={LOCATION_DATA.phones[0].href} className="btn btn-outline btn-lg" style={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.3)' }}>
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
