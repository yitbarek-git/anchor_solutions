import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { LOCATION_DATA } from '../utils/location.js';
import { Award, CheckCircle2, PhoneCall, MapPin, Sparkles, Scissors, Palette, Briefcase, GraduationCap } from 'lucide-react';

export function TisAbayPartnershipSection({ navigate }) {
  const { language } = useLanguage();
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const vocationalTracks = [
    {
      titleEn: 'Pre-Departure Vocational Training',
      titleAm: 'የአረብ ሀገር ሲቪሊ ስልጠናዎች',
      descEn: 'Comprehensive job readiness, cultural preparation, and home management skills for overseas employment.',
      descAm: 'ለውጭ አገር የስራ እድል የሚሆን አጠቃላይ የስራ ዝግጁነት፣ የቤት አስተዳደርና የባህል ስልጠና።',
      icon: <Briefcase size={20} style={{ color: 'var(--color-gold)' }} />,
    },
    {
      titleEn: 'Exhibition Crafts & Traditional Jewelry',
      titleAm: 'የኤግዚቢሽን እና ጌጣጌጥ ስራ',
      descEn: 'Authentic Ethiopian jewelry design, beadcraft, cultural artifacts, and commercial exhibition display.',
      descAm: 'የባህላዊ ጌጣጌጥ፣ የዶቃ ስራዎች፣ የባህል አልባሳትና የኤግዚቢሽን ጥበባት አሰራር ስልጠና።',
      icon: <Sparkles size={20} style={{ color: 'var(--color-gold)' }} />,
    },
    {
      titleEn: 'Footwear Design & Leathercraft',
      titleAm: 'የጫማ አሰራር',
      descEn: 'Practical cutting, pattern making, stitching, sole assembly, and commercial shoe manufacturing.',
      descAm: 'የቆዳ ጫማ ንድፍ፣ ቆረጣ፣ ስፌት፣ ሶል ገጣጠማ እና ለገበያ የሚቀርብ የጫማ ምርት ስራ።',
      icon: <Scissors size={20} style={{ color: 'var(--color-gold)' }} />,
    },
    {
      titleEn: 'Henna Artistry & Beauty Care',
      titleAm: 'የሂና አሰራር እና ውበት ጥበቃ',
      descEn: 'Traditional and modern henna styling, bridal beauty art, skin safety, and salon business techniques.',
      descAm: 'ዘመናዊና ባህላዊ የሂና ዲዛይን፣ የሙሽራ ውበት አሰራር እና የሳሎን ስራዎች ጥበብ።',
      icon: <Palette size={20} style={{ color: 'var(--color-gold)' }} />,
    },
  ];

  return (
    <section className="section" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header text-center" style={{ maxWidth: '820px', margin: '0 auto 3rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem' }}>
              <Award size={15} />
              <span>{language === 'am' ? 'ይፋዊ የትብብር ስልጠና' : 'Official Partnership Initiative'}</span>
            </span>
          </div>

          <h2 className="section-title" style={{ fontSize: '2.1rem', marginBottom: '0.85rem' }}>
            {language === 'am' ? 'አንከር ሶሉሽንስ እና ጢስ አባይ ኮሌጅ' : 'Anchor Solutions & Tis Abay College'}
          </h2>
          <p className="section-subtitle" style={{ fontSize: '1.05rem', lineHeight: '1.65' }}>
            {language === 'am'
              ? 'በአዲስ ዓመት ትልቅ እድል — በአንድነት አጫጭር የቴክኖሎጂ እና የሙያ ስልጠናዎችን በባሕር ዳር ከተማ መስጠት ጀመርን።'
              : 'Joint educational collaboration bringing certified short-term technology and vocational career programs to Bahir Dar.'}
          </p>
        </div>

        {/* Partnership Grid: Poster & Vocational Tracks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Column: Official Partnership Flyer Display */}
          <div
            className="card"
            style={{
              overflow: 'hidden',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              backgroundColor: 'var(--bg-subtle)',
            }}
          >
            <div style={{ position: 'relative', width: '100%', minHeight: '360px', backgroundColor: '#0f1117' }}>
              {!posterError ? (
                <img
                  src="/images/partners/tis-abay-college-partnership.jpg"
                  alt="Anchor Solutions & Tis Abay College official short courses announcement poster"
                  loading="lazy"
                  onLoad={() => setPosterLoaded(true)}
                  onError={() => setPosterError(true)}
                  style={{
                    width: '100%',
                    height: '100%',
                    maxHeight: '520px',
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: '#111',
                  }}
                />
              ) : null}

              {/* Graphic Fallback if file not yet uploaded to public/ */}
              {(posterError || !posterLoaded) && (
                <div
                  style={{
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    minHeight: '360px',
                    background: 'linear-gradient(145deg, #181920 0%, #0d0e12 100%)',
                  }}
                >
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(212, 175, 55, 0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--color-gold)',
                      marginBottom: '1.25rem',
                      border: '1px solid rgba(212, 175, 55, 0.4)',
                    }}
                  >
                    <GraduationCap size={32} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                    TIS ABAY COLLEGE & ANCHOR SOLUTIONS
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1rem' }}>
                    {language === 'am' ? 'በአንድነት አጫጭር ስልጠናዎችን መስጠት ጀመረ' : 'Official Short Courses Initiative'}
                  </p>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '380px' }}>
                    {language === 'am'
                      ? 'የቴክኖሎጂ እና የሙያ ስልጠናዎች በባሕር ዳር ከተማ ቀበሌ 04 መስራት ያስከብራል ህንፃ 4ኛ ፎቅ።'
                      : 'Certified vocational & tech programs at Kebele 04, Mesrat Yaskeberal Building 4th Floor, Bahir Dar.'}
                  </div>
                </div>
              )}
            </div>

            <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                {language === 'am' ? 'ይፋዊ የመመዝገቢያ ስልኮች፡' : 'Official Registration Hotlines:'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontWeight: 700, fontSize: '0.92rem' }}>
                <a href="tel:+251902184440" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>0902 18 44 40</a>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <a href="tel:+251924398113" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>0924 39 81 13</a>
                <span style={{ color: 'var(--text-muted)' }}>·</span>
                <a href="tel:+251952587750" style={{ color: 'var(--color-gold)', textDecoration: 'none' }}>0952 58 77 50</a>
              </div>
            </div>
          </div>

          {/* Right Column: Vocational & Career Skills Catalog */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
                {language === 'am' ? 'በሙያ ዘርፍ የሚሰጡ ስልጠናዎች' : 'Vocational Career Programs'}
              </span>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                {language === 'am' ? 'ተግባራዊ የገቢ ማስገኛ ስልጠናዎች' : 'Hands-On Career & Income Skills'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: '1.6' }}>
                {language === 'am'
                  ? 'ከኮሌጁ ጋር በመተባበር ለስራ አጥነት መፍትሄ የሚሆኑና ወዲያውኑ ገቢ የሚያስገኙ አጫጭር የሙያ ስልጠናዎችን ያግኙ።'
                  : 'Targeted vocational tracks designed for immediate practical employment, entrepreneurship, and specialized trades.'}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {vocationalTracks.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '1.15rem 1.25rem',
                    backgroundColor: 'var(--bg-subtle)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(212, 175, 55, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem', color: 'var(--text-primary)' }}>
                      {language === 'am' ? item.titleAm : item.titleEn}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
                      {language === 'am' ? item.descAm : item.descEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* In-Person Campus Registration Notice */}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1rem 1.25rem',
                backgroundColor: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <MapPin size={20} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                <div style={{ fontSize: '0.85rem' }}>
                  <strong>{language === 'am' ? 'የምዝገባ ቦታ፦' : 'Registration Campus:'}</strong>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>
                    {language === 'am' ? 'ባሕር ዳር፣ ቀበሌ 04፣ መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ' : 'Kebele 04, Mesrat Yaskeberal 4th Floor, Bahir Dar'}
                  </span>
                </div>
              </div>

              <button onClick={() => navigate('/contact')} className="btn btn-primary btn-sm">
                <span>{language === 'am' ? 'አድራሻ እና ምዝገባ' : 'Admissions & Map'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TisAbayPartnershipSection;
