import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { SocialLinks } from '../components/SocialLinks.jsx';
import { Alert } from '../components/Alert.jsx';
import { LOCATION_DATA } from '../utils/location.js';
import { MapPin, Phone, Send, Clock, Navigation, ExternalLink, Map } from 'lucide-react';

export function ContactPage() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const currentAddress = language === 'am' ? LOCATION_DATA.address.am : LOCATION_DATA.address.en;

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h1 style={{ marginBottom: '0.5rem' }}>{t.contactPage.title}</h1>
          <p className="section-subtitle">{t.contactPage.subtitle}</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          {/* Contact Details & Socials (Left Column) */}
          <div>
            <div className="card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontWeight: 700 }}>
                  {language === 'am' ? 'የካምፓስ መረጃ' : 'Campus Information'}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Clickable Address that opens Google Maps */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <MapPin size={22} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {t.contactPage.officeAddress}
                      </div>
                      <a
                        href={LOCATION_DATA.maps.viewUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.92rem',
                          lineHeight: '1.55',
                          textDecoration: 'none',
                          display: 'inline-block',
                          wordBreak: 'break-word',
                          transition: 'color var(--transition-fast)',
                        }}
                        className="contact-address-link"
                        title={language === 'am' ? 'በGoogle ካርታ ላይ ይመልከቱ' : 'Open in Google Maps'}
                      >
                        <span style={{ borderBottom: '1px dashed var(--border-medium)', paddingBottom: '2px' }}>
                          {currentAddress}
                        </span>
                        <ExternalLink size={14} style={{ display: 'inline', marginLeft: '6px', verticalAlign: 'middle', color: 'var(--color-gold)' }} />
                      </a>
                    </div>
                  </div>

                  {/* Clickable Phone Numbers */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <Phone size={22} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                        {t.contactPage.phoneNumbers}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.92rem' }}>
                        {LOCATION_DATA.phones.map((phone) => (
                          <a
                            key={phone.display}
                            href={phone.href}
                            style={{
                              color: phone.isPrimary ? 'var(--text-primary)' : 'var(--text-secondary)',
                              fontWeight: phone.isPrimary ? 700 : 500,
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              transition: 'color var(--transition-fast)',
                            }}
                            className="phone-contact-link"
                          >
                            <span>📞 {phone.display}</span>
                            {phone.isPrimary ? (
                              <span className="badge badge-gold" style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem' }}>
                                {language === 'am' ? 'ዋና መስመር' : 'Primary'}
                              </span>
                            ) : (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                ({language === 'am' ? phone.labelAm : phone.labelEn})
                              </span>
                            )}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Office Hours */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <Clock size={22} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                        {language === 'am' ? 'የስራ ሰዓት' : 'Office Hours'}
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {language === 'am' ? LOCATION_DATA.hours.am : LOCATION_DATA.hours.en}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels Section */}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                  {t.contactPage.officialSocials}
                </div>
                <SocialLinks />
              </div>
            </div>
          </div>

          {/* Interactive Inquiry Form (Right Column) */}
          <div>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                {t.contactPage.sendMessageTitle}
              </h3>

              {submitted ? (
                <Alert type="success" title={language === 'am' ? 'መልዕክትዎ ደርሶናል' : 'Message Delivered'}>
                  <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>
                    {t.contactPage.messageSent}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1rem' }}
                  >
                    {language === 'am' ? 'ሌላ መልዕክት ይላኩ' : 'Send Another Inquiry'}
                  </button>
                </Alert>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label className="form-label">{t.contactPage.fullName} *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Abebe Kebede"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">{t.contactPage.emailAddress} *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                        placeholder="abebe@example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t.contactPage.phone} *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="form-input"
                        placeholder="0911..."
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.contactPage.subject}</label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Inquiring about Video Editing"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t.contactPage.message} *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="form-textarea"
                      placeholder="Write your questions here..."
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                    <Send size={18} />
                    <span>{t.contactPage.sendMessageBtn}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Interactive Google Maps Section */}
        <section className="card" style={{ padding: '1.75rem', overflow: 'hidden' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Map size={22} style={{ color: 'var(--color-gold)' }} />
                <h2 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                  {t.contactPage.mapTitle || (language === 'am' ? 'በGoogle ካርታ ላይ ያግኙን' : 'Find Us on Google Maps')}
                </h2>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, wordBreak: 'break-word' }}>
                📍 {currentAddress}
              </p>
            </div>

            {/* Clearly visible Get Directions button */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              <a
                href={LOCATION_DATA.maps.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                title="Get driving and walking directions to Anchor Solution"
              >
                <Navigation size={18} />
                <span>{t.contactPage.getDirections || (language === 'am' ? 'በGoogle ካርታ አቅጣጫ አሳይ' : 'Get Directions')}</span>
              </a>
              <a
                href={LOCATION_DATA.maps.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ExternalLink size={16} />
                <span>{language === 'am' ? 'ትልቅ ካርታ ክፈት' : 'Open Larger Map'}</span>
              </a>
            </div>
          </div>

          {/* Responsive Map Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-subtle)',
              minHeight: '340px',
              height: '380px',
            }}
          >
            <iframe
              title="Anchor Solution Campus Google Map"
              src={LOCATION_DATA.maps.embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, display: 'block' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

export default ContactPage;
