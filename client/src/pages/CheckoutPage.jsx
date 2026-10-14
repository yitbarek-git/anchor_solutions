import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { formatPrice } from '../utils/formatters.js';
import { Alert } from '../components/Alert.jsx';
import { CourseArtwork } from '../assets/CourseIllustrations.jsx';
import {
  Smartphone,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  LogIn,
  Info,
} from 'lucide-react';

export function CheckoutPage({ slug, navigate }) {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, login } = useAuth();

  const [course, setCourse] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [errorCourse, setErrorCourse] = useState(null);

  // Gateway selector: 'telebirr' or 'cbe'
  const [selectedGateway, setSelectedGateway] = useState('telebirr');

  // Recipient phone: '0902 18 44 40' vs '0952 58 77 50'
  const [selectedPhone, setSelectedPhone] = useState('0902 18 44 40');
  const [copiedPhone, setCopiedPhone] = useState(null);

  // Form inputs
  const [transactionRef, setTransactionRef] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderName, setSenderName] = useState('');

  // Status & submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [courseStatus, setCourseStatus] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoadingCourse(true);
      setErrorCourse(null);
      try {
        const res = await api.courses.getBySlug(slug, language);
        if (res.success && res.data) {
          setCourse(res.data);
          if (isAuthenticated) {
            const statusRes = await api.payments.getCourseStatus(res.data.id);
            if (statusRes.success) {
              setCourseStatus(statusRes.data);
            }
          }
        } else {
          setErrorCourse('Course details could not be found.');
        }
      } catch (err) {
        setErrorCourse(err.message || 'Failed to load course details.');
      } finally {
        setLoadingCourse(false);
      }
    }
    loadData();
  }, [slug, language, isAuthenticated]);

  const handleCopyPhone = (phoneNumber) => {
    const rawNumber = phoneNumber.replace(/\s+/g, '');
    navigator.clipboard.writeText(rawNumber).then(() => {
      setCopiedPhone(phoneNumber);
      setTimeout(() => setCopiedPhone(null), 2500);
    }).catch(() => {
      setCopiedPhone(phoneNumber);
      setTimeout(() => setCopiedPhone(null), 2500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!isAuthenticated) {
      setSubmitError(t.payment.signInToPay || 'Please sign in first.');
      return;
    }

    const cleanRef = transactionRef.trim();
    if (!cleanRef || cleanRef.length < 4) {
      setSubmitError(
        language === 'am'
          ? 'እባክዎ ትክክለኛ የቴሌብር ግብይት ማረጋገጫ ቁጥር (ቢያንስ 4 ፊደላት/ቁጥሮች) ያስገቡ።'
          : 'Please enter a valid Telebirr transaction reference (at least 4 characters).'
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.payments.submit({
        courseId: course.id,
        recipientPhone: selectedPhone,
        transactionReference: cleanRef,
        senderPhone: senderPhone.trim() || user?.phone || '',
        senderName: senderName.trim() || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      });

      if (res.success) {
        setCourseStatus({
          hasPendingPayment: true,
          pendingPayment: res.payment,
          isEnrolled: false,
        });
      }
    } catch (err) {
      setSubmitError(err.message || 'Payment submission failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickLoginAsStudent = async () => {
    try {
      setSubmitting(true);
      await login({ email: 'student@anchorsolution.et', password: 'Student@Anchor2026' });
      setSubmitError(null);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCourse) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        {t.common.loadingCheckout}
      </div>
    );
  }

  if (errorCourse || !course) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>{t.common.courseNotFound}</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>{errorCourse || t.common.courseNotFoundDesc}</p>
        <button onClick={() => navigate('/courses')} className="btn btn-primary">
          {t.common.backToCourses}
        </button>
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Navigation back breadcrumb */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(`/courses/${course.slug}`)}
            className="btn btn-ghost btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.25rem 0' }}
          >
            <ArrowLeft size={16} />
            <span>{language === 'am' ? 'ወደ ስልጠናው ዝርዝር ተመለስ' : 'Back to Course Details'}</span>
          </button>
        </div>

        {/* Checkout Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {t.payment.title}
          </h1>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
            {language === 'am'
              ? 'ደህንነቱ የተጠበቀ የክፍያ ገጽ። ክፍያዎን በቴሌብር ይፈጽሙና ወዲያውኑ ለምዝገባ ይላኩ።'
              : 'Secure checkout page. Transfer tuition via verified Telebirr accounts and submit reference for prompt verification.'}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
          {/* Left Column: Order Summary */}
          <div>
            <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <CourseArtwork slug={course.slug} />
              </div>

              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>{course.category}</span>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                {course.title}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--color-gold)', marginBottom: '1rem' }}>
                {language === 'am' ? course.titleEn : course.titleAm}
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                  <strong>{course.durationWeeks} {t.coursesPage?.weeks || 'Weeks'} ({course.totalHours} hrs)</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Certification:</span>
                  <strong>{course.partnerName}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>{t.payment.totalTuition}:</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                      {formatPrice(course.price)}
                    </div>
                    {course.regularPrice > course.price && (
                      <span style={{ fontSize: '0.9rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        {formatPrice(course.regularPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Campus Contact info */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>📍 Bahir Dar Admissions Campus</div>
              <div style={{ color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                {language === 'am' ? 'ባሕር ዳር ከተማ፣ ቀበሌ 04፣ መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ' : 'Mesrat Yaskeberal Building, Kebele 04, 4th Floor, Bahir Dar, Ethiopia'}
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                Direct Phones: <strong>0902 18 44 40</strong> / <strong>0952 58 77 50</strong>
              </div>
            </div>
          </div>

          {/* Right Column: Payment Methods & Submission Form */}
          <div>
            {/* If Enrolled Already */}
            {courseStatus?.isEnrolled && (
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '2px solid var(--color-success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <CheckCircle2 size={26} style={{ color: 'var(--color-success)' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
                    {t.payment.approvedStatus}
                  </h3>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                  {t.payment.approvedDesc}
                </p>
                <button
                  onClick={() => {
                    const firstLesson = course.modules?.[0]?.lessons?.[0];
                    if (firstLesson) navigate(`/courses/${course.slug}/lessons/${firstLesson.id}`);
                  }}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <span>{t.payment.startLearning}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}

            {/* If Pending Verification */}
            {courseStatus?.hasPendingPayment && !courseStatus?.isEnrolled && (
              <div className="card" style={{ padding: '1.75rem', marginBottom: '1.5rem', border: '2px solid var(--color-gold)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <Clock size={24} style={{ color: 'var(--color-gold)' }} />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: 'var(--color-gold)' }}>
                    {t.payment.pendingStatus}
                  </h3>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                  {t.payment.pendingDesc}
                </p>

                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.25rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Transaction Reference: </span>
                    <strong style={{ color: 'var(--color-gold)', fontFamily: 'monospace' }}>
                      {courseStatus.pendingPayment?.transaction_reference}
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Recipient Number: </span>
                    <strong>{courseStatus.pendingPayment?.recipient_phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Telebirr Account: </span>
                    <strong>Tizta</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Amount: </span>
                    <strong>{formatPrice(course.price)}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                    View Student Dashboard
                  </button>
                  <button onClick={() => navigate('/contact')} className="btn btn-secondary btn-sm">
                    Contact Office
                  </button>
                </div>
              </div>
            )}

            {/* If Not Logged In */}
            {!isAuthenticated && (
              <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
                <LogIn size={32} style={{ color: 'var(--color-gold)', margin: '0 auto 0.75rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {t.payment.signInToPay}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                  {language === 'am'
                    ? 'ክፍያዎን ለማረጋገጫ ከማስገባትዎ በፊት የስልጠና መዳረሻው ከመለያዎ ጋር እንዲያያዝ እባክዎ ወደ መለያዎ ይግቡ።'
                    : 'To link your payment reference with your profile and grant curriculum access upon approval, please sign in.'}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button onClick={handleQuickLoginAsStudent} disabled={submitting} className="btn btn-primary">
                    <span>
                      {submitting
                        ? (language === 'am' ? 'በመግባት ላይ...' : 'Signing in...')
                        : (language === 'am' ? 'በተማሪ መለያ ግባ' : 'Sign In as Student')}
                    </span>
                  </button>
                  <button onClick={() => navigate('/login')} className="btn btn-secondary">
                    <span>{language === 'am' ? 'በሌላ መለያ ግባ' : 'Sign In With Existing Account'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Standard Payment Checkout Form */}
            {isAuthenticated && !courseStatus?.isEnrolled && !courseStatus?.hasPendingPayment && (
              <div className="card" style={{ padding: '1.75rem' }}>
                {/* Method selector */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    Payment Method
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedGateway('telebirr')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedGateway === 'telebirr' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedGateway === 'telebirr' ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-subtle)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <Smartphone size={22} style={{ color: 'var(--color-gold)' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Telebirr</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Primary Option</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedGateway('cbe')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: selectedGateway === 'cbe' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedGateway === 'cbe' ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-subtle)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <Building2 size={22} style={{ color: 'var(--text-muted)' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>CBE Bank Deposit</div>
                        <span className="badge badge-neutral" style={{ fontSize: '0.65rem' }}>
                          {language === 'am' ? 'በአካል በቢሮ' : 'Campus Desk'}
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                {selectedGateway === 'cbe' && (
                  <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                    <Info size={18} style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        {language === 'am' ? 'የኢትዮጵያ ንግድ ባንክ (CBE) ክፍያ' : 'Commercial Bank of Ethiopia (CBE) Bank Deposit'}
                      </div>
                      <div style={{ fontSize: '0.85rem', marginTop: '4px', lineHeight: '1.5' }}>
                        {language === 'am'
                          ? 'የባንክ ክፍያ ደረሰኝ (Deposit Slip) በመያዝ በባሕር ዳር ቢሯችን (ቀበሌ 04፣ መስራት ያስከብራል ህንፃ፣ 4ኛ ፎቅ) በአካል መመዝገብ ይችላሉ። ፈጣን የኦንላይን ምዝገባ ለማድረግ ቴሌብርን ይጠቀሙ።'
                          : 'To pay via bank deposit, bring your CBE bank deposit slip to our Bahir Dar campus desk (Kebele 04, Mesrat Yaskeberal Building, 4th Floor) for in-person activation, or use Telebirr for instant online verification.'}
                      </div>
                      <button onClick={() => setSelectedGateway('telebirr')} className="btn btn-primary btn-sm" style={{ marginTop: '0.75rem' }}>
                        {language === 'am' ? 'ወደ ቴሌብር ክፍያ ቀይር' : 'Pay Online with Telebirr'}
                      </button>
                    </div>
                  </div>
                )}

                {selectedGateway === 'telebirr' && (
                  <form onSubmit={handleSubmit}>
                    {/* Telebirr Recipient Box */}
                    <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                          <ShieldCheck size={18} style={{ color: 'var(--color-gold)' }} />
                          <strong style={{ fontSize: '0.92rem' }}>Verified Telebirr Recipient</strong>
                        </div>
                        <span style={{ fontSize: '0.85rem' }}>
                          Account Name: <strong style={{ color: 'var(--color-gold)' }}>Tizta</strong>
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        Select verified recipient phone:
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        {/* 0902 18 44 40 */}
                        <div
                          onClick={() => setSelectedPhone('0902 18 44 40')}
                          style={{
                            padding: '0.75rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: selectedPhone === '0902 18 44 40' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Option 1</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace' }}>0902 18 44 40</div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPhone('0902 18 44 40');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {copiedPhone === '0902 18 44 40' ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>

                        {/* 0952 58 77 50 */}
                        <div
                          onClick={() => setSelectedPhone('0952 58 77 50')}
                          style={{
                            padding: '0.75rem 0.85rem',
                            borderRadius: 'var(--radius-sm)',
                            border: selectedPhone === '0952 58 77 50' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-surface)',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Option 2</div>
                            <div style={{ fontSize: '1rem', fontWeight: 800, fontFamily: 'monospace' }}>0952 58 77 50</div>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyPhone('0952 58 77 50');
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {copiedPhone === '0952 58 77 50' ? <Check size={13} /> : <Copy size={13} />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Step Guide */}
                    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
                      <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{t.payment.howToPay}:</div>
                      <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem', color: 'var(--text-secondary)' }}>
                        <li>{t.payment.step1}</li>
                        <li>{t.payment.step2} (<strong>{formatPrice(course.price)}</strong> / <strong>{selectedPhone}</strong> — <em>Tizta</em>)</li>
                        <li>{t.payment.step3}</li>
                        <li>{t.payment.step4}</li>
                        <li>{t.payment.step5}</li>
                      </ol>
                    </div>

                    {submitError && (
                      <div style={{ marginBottom: '1rem' }}>
                        <Alert type="error" message={submitError} onClose={() => setSubmitError(null)} />
                      </div>
                    )}

                    {/* Form Fields */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                          {t.payment.enterReference} <span style={{ color: 'var(--color-error)' }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="input"
                          placeholder={t.payment.refPlaceholder}
                          value={transactionRef}
                          onChange={(e) => setTransactionRef(e.target.value)}
                          required
                          style={{ fontFamily: 'monospace', fontSize: '1.05rem', textTransform: 'uppercase' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                            {t.payment.senderPhoneLabel}
                          </label>
                          <input
                            type="tel"
                            className="input"
                            placeholder="09XXXXXXXX"
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                            {t.payment.senderNameLabel}
                          </label>
                          <input
                            type="text"
                            className="input"
                            placeholder="e.g. Abebe Kebede"
                            value={senderName}
                            onChange={(e) => setSenderName(e.target.value)}
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={submitting || !transactionRef.trim()}
                        className="btn btn-primary btn-lg"
                        style={{ width: '100%', marginTop: '0.5rem' }}
                      >
                        <span>{submitting ? t.payment.submitting : t.payment.submitVerification}</span>
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
