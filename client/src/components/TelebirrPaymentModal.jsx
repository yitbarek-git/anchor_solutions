import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { Modal } from './Modal.jsx';
import { Alert } from './Alert.jsx';
import { formatPrice } from '../utils/formatters.js';
import {
  Smartphone,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Info,
  ShieldCheck,
  LogIn,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export function TelebirrPaymentModal({
  isOpen,
  onClose,
  course,
  onPaymentSuccess,
  navigate,
}) {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, login } = useAuth();

  // Selected payment gateway tab: 'telebirr' or 'cbe'
  const [selectedGateway, setSelectedGateway] = useState('telebirr');

  // Selected recipient phone option: '0902 18 44 40' vs '0952 58 77 50'
  const [selectedPhone, setSelectedPhone] = useState('0902 18 44 40');
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Form inputs
  const [transactionRef, setTransactionRef] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderName, setSenderName] = useState('');

  // Submission state
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successInfo, setSuccessInfo] = useState(null);

  // Existing course payment status
  const [courseStatus, setCourseStatus] = useState(null);

  // Check existing course payment status when opened
  useEffect(() => {
    if (isOpen && course && isAuthenticated) {
      checkExistingPaymentStatus();
    } else {
      setCourseStatus(null);
      setSuccessInfo(null);
      setErrorMessage(null);
    }
  }, [isOpen, course?.id, isAuthenticated]);

  async function checkExistingPaymentStatus() {
    if (!course?.id) return;
    setCheckingStatus(true);
    try {
      const res = await api.payments.getCourseStatus(course.id);
      if (res.success && res.data) {
        setCourseStatus(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch existing payment status', err);
    } finally {
      setCheckingStatus(false);
    }
  }

  const handleCopyPhone = (phoneNumber) => {
    const rawNumber = phoneNumber.replace(/\s+/g, '');
    navigator.clipboard.writeText(rawNumber).then(() => {
      setCopiedPhone(phoneNumber);
      setTimeout(() => setCopiedPhone(null), 2500);
    }).catch(() => {
      // Fallback
      setCopiedPhone(phoneNumber);
      setTimeout(() => setCopiedPhone(null), 2500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage(t.payment.signInToPay || 'Please sign in first to submit payment.');
      return;
    }

    const cleanRef = transactionRef.trim();
    if (!cleanRef || cleanRef.length < 4) {
      setErrorMessage(
        language === 'am'
          ? 'እባክዎ ትክክለኛ የቴሌብር ግብይት ማረጋገጫ ቁጥር (ቢያንስ 4 ፊደላት/ቁጥሮች) ያስገቡ።'
          : 'Please enter a valid Telebirr transaction reference (at least 4 characters).'
      );
      return;
    }

    setLoading(true);
    try {
      const res = await api.payments.submit({
        courseId: course.id,
        recipientPhone: selectedPhone,
        transactionReference: cleanRef,
        senderPhone: senderPhone.trim() || user?.phone || '',
        senderName: senderName.trim() || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
      });

      if (res.success) {
        setSuccessInfo(res.payment);
        setCourseStatus((prev) => ({
          ...prev,
          hasPendingPayment: true,
          pendingPayment: res.payment,
        }));
        if (onPaymentSuccess) {
          onPaymentSuccess(res.payment);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Payment submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAsStudent = async () => {
    try {
      setLoading(true);
      await login({ email: 'student@anchorsolution.et', password: 'Student@Anchor2026' });
      setErrorMessage(null);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!course) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.payment.title}
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Selected Course Summary Header */}
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.15rem 1.25rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div style={{ minWidth: '200px', flex: '1 1 200px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {t.payment.selectedCourse}
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {course.title || course.translations?.[language]?.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--color-gold)' }}>
              {course.category} · {course.durationWeeks || 4} {t.coursesPage?.weeks || 'Weeks'}
            </div>
          </div>

          <div style={{ textAlign: 'right', minWidth: '130px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {t.payment.totalTuition}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-gold)' }}>
              {formatPrice(course.price)}
            </div>
            {course.regularPrice > course.price && (
              <div style={{ fontSize: '0.85rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                {formatPrice(course.regularPrice)}
              </div>
            )}
          </div>
        </div>

        {/* Existing Status: Already Approved */}
        {courseStatus?.isEnrolled && (
          <div className="alert alert-success">
            <CheckCircle2 size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                {t.payment.approvedStatus}
              </div>
              <div style={{ fontSize: '0.88rem', marginTop: '3px' }}>
                {t.payment.approvedDesc}
              </div>
              <div style={{ marginTop: '0.75rem' }}>
                <button
                  onClick={() => {
                    onClose();
                    const firstLesson = course.modules?.[0]?.lessons?.[0];
                    if (firstLesson && navigate) {
                      navigate(`/courses/${course.slug}/lessons/${firstLesson.id}`);
                    }
                  }}
                  className="btn btn-primary btn-sm"
                >
                  <span>{t.payment.startLearning}</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Status: Pending Verification */}
        {courseStatus?.hasPendingPayment && !courseStatus?.isEnrolled && (
          <div
            style={{
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              border: '1px solid rgba(217, 119, 6, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <Clock size={20} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
              <strong style={{ fontSize: '1rem', color: 'var(--color-gold)' }}>
                {t.payment.pendingStatus}
              </strong>
            </div>

            <p style={{ fontSize: '0.88rem', lineHeight: '1.55', color: 'var(--text-secondary)', marginBottom: '0.85rem' }}>
              {t.payment.pendingDesc}
            </p>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.75rem 1rem',
                fontSize: '0.85rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '0.5rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'am' ? 'የግብይት መለያ (Reference):' : 'Transaction Reference:'} </span>
                <strong style={{ color: 'var(--color-gold)', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                  {courseStatus.pendingPayment?.transaction_reference || successInfo?.transaction_reference}
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'am' ? 'የተላከበት ስልክ:' : 'Recipient Number:'} </span>
                <strong>{courseStatus.pendingPayment?.recipient_phone || selectedPhone}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'am' ? 'የሂሳብ ስም:' : 'Account Name:'} </span>
                <strong>Tizta</strong>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>{language === 'am' ? 'የቀረበበት ሰዓት:' : 'Submitted:'} </span>
                <span>{new Date(courseStatus.pendingPayment?.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div style={{ marginTop: '0.85rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {language === 'am' ? (
                <>አስቸኳይ ማረጋገጫ ይፈልጋሉ? ወደ ባሕር ዳር ማዕከሉ በቀጥታ ይደውሉ፡ <strong>0902 18 44 40</strong> ወይም <strong>0952 58 77 50</strong>።</>
              ) : (
                <>Need urgent activation? Call our Bahir Dar campus desk directly: <strong>0902 18 44 40</strong> or <strong>0952 58 77 50</strong>.</>
              )}
            </div>
          </div>
        )}

        {/* If user is not authenticated: prompt for login */}
        {!isAuthenticated && (
          <div
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
            }}
          >
            <LogIn size={28} style={{ color: 'var(--color-gold)', margin: '0 auto 0.5rem' }} />
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.35rem' }}>
              {t.payment.signInToPay}
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {language === 'am'
                ? 'ክፍያዎ ከመለያዎ ጋር ተያይዞ እንዲረጋገጥ እባክዎ መጀመሪያ ይግቡ።'
                : 'Sign in so this payment can be securely associated with your student profile and verified.'}
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={handleQuickLoginAsStudent}
                disabled={loading}
                className="btn btn-primary btn-sm"
              >
                <span>
                  {loading
                    ? (language === 'am' ? 'በመግባት ላይ...' : 'Signing in...')
                    : (language === 'am' ? 'በተማሪ መለያ ግባ' : 'Sign In as Student')}
                </span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (navigate) navigate('/login');
                }}
                className="btn btn-secondary btn-sm"
              >
                <span>{t.nav?.login || (language === 'am' ? 'ግባ / ተመዝገብ' : 'Sign In / Register')}</span>
              </button>
            </div>
          </div>
        )}

        {/* If not already enrolled and no pending payment: show payment checkout form */}
        {(!courseStatus?.hasPendingPayment || successInfo) && !courseStatus?.isEnrolled && isAuthenticated && (
          <div>
            {/* Gateway Selector Tabs: Telebirr (Online) + CBE (In-Person Desk) */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {language === 'am' ? 'የክፍያ አማራጮች' : 'Payment Method Options'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {/* 1. Telebirr - First and Primary */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('telebirr')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedGateway === 'telebirr' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedGateway === 'telebirr' ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-dark)',
                      color: 'var(--color-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Smartphone size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>Telebirr</strong>
                      <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        {language === 'am' ? 'ዋና' : 'Primary'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t.payment.accountName}: <strong>Tizta</strong>
                    </div>
                  </div>
                </button>

                {/* 2. CBE Bank Transfer - Structured for future */}
                <button
                  type="button"
                  onClick={() => setSelectedGateway('cbe')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedGateway === 'cbe' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedGateway === 'cbe' ? 'rgba(217, 119, 6, 0.08)' : 'var(--bg-subtle)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    opacity: 0.85,
                  }}
                >
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-surface)',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <strong style={{ fontSize: '0.95rem' }}>CBE (Bank Transfer)</strong>
                      <span className="badge badge-neutral" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                        {t.payment.cbeBadge}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {t.payment.cbeBankName || 'Commercial Bank of Ethiopia'}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* If CBE is selected: show In-Person campus desk notice */}
            {selectedGateway === 'cbe' && (
              <div className="alert alert-info" style={{ marginBottom: '1.25rem' }}>
                <Info size={20} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700 }}>{t.payment.cbeTitle} ({t.payment.cbeBadge})</div>
                  <div style={{ fontSize: '0.88rem', marginTop: '4px' }}>
                    {t.payment.cbeDesc}
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGateway('telebirr')}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: '0.75rem' }}
                  >
                    {language === 'am' ? 'ወደ ቴሌብር ክፍያ ቀይር' : 'Switch to Telebirr Payment'}
                  </button>
                </div>
              </div>
            )}

            {/* Telebirr Payment Details & Submission Form */}
            {selectedGateway === 'telebirr' && (
              <form onSubmit={handleSubmit}>
                {/* Verified Recipient Account Box */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShieldCheck size={18} style={{ color: 'var(--color-gold)' }} />
                      <strong style={{ fontSize: '0.92rem' }}>
                        {language === 'am' ? 'የተረጋገጠ የቴሌብር ተቀባይ አካውንት' : 'Verified Telebirr Recipient Account'}
                      </strong>
                    </div>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {t.payment.accountName}: <strong style={{ color: 'var(--color-gold)' }}>Tizta</strong>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    {t.payment.recipientPhones}:
                  </div>

                  {/* Two Verified Phone Number Options */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                    {/* Option 1: 0902 18 44 40 */}
                    <div
                      onClick={() => setSelectedPhone('0902 18 44 40')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedPhone === '0902 18 44 40' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedPhone === '0902 18 44 40' ? 'rgba(217, 119, 6, 0.06)' : 'var(--bg-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {language === 'am' ? 'አማራጭ 1 (Admissions 1)' : 'Option 1 (Admissions 1)'}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                          0902 18 44 40
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Name: <strong>Tizta</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPhone('0902 18 44 40');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        title="Copy 0902 18 44 40"
                      >
                        {copiedPhone === '0902 18 44 40' ? (
                          <>
                            <Check size={14} style={{ color: 'var(--color-gold)' }} />
                            <span>{t.payment.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>{t.payment.copyNumber}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Option 2: 0952 58 77 50 */}
                    <div
                      onClick={() => setSelectedPhone('0952 58 77 50')}
                      style={{
                        padding: '0.85rem 1rem',
                        borderRadius: 'var(--radius-sm)',
                        border: selectedPhone === '0952 58 77 50' ? '2px solid var(--color-gold)' : '1px solid var(--border-subtle)',
                        backgroundColor: selectedPhone === '0952 58 77 50' ? 'rgba(217, 119, 6, 0.06)' : 'var(--bg-subtle)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {language === 'am' ? 'አማራጭ 2 (Admissions 2)' : 'Option 2 (Admissions 2)'}
                        </div>
                        <div style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                          0952 58 77 50
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Name: <strong>Tizta</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyPhone('0952 58 77 50');
                        }}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                        title="Copy 0952 58 77 50"
                      >
                        {copiedPhone === '0952 58 77 50' ? (
                          <>
                            <Check size={14} style={{ color: 'var(--color-gold)' }} />
                            <span>{t.payment.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            <span>{t.payment.copyNumber}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Payment Guide */}
                <div
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.15rem',
                    marginBottom: '1.25rem',
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Info size={16} style={{ color: 'var(--color-gold)' }} />
                    <span>{t.payment.howToPay}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    <div>{t.payment.step1}</div>
                    <div>
                      {t.payment.step2} (<strong>{formatPrice(course.price)}</strong> to <strong>{selectedPhone}</strong> - <em>Tizta</em>)
                    </div>
                    <div>{t.payment.step3}</div>
                    <div>{t.payment.step4}</div>
                    <div>{t.payment.step5}</div>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div style={{ marginBottom: '1rem' }}>
                    <Alert type="error" message={errorMessage} onClose={() => setErrorMessage(null)} />
                  </div>
                )}

                {/* Verification Submission Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Transaction Reference (Required) */}
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
                      style={{ fontFamily: 'monospace', fontSize: '1rem', textTransform: 'uppercase' }}
                    />
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                      {language === 'am'
                        ? 'ከቴሌብር የደረሰዎትን የክፍያ ማረጋገጫ ቁጥር ያስገቡ (ምሳሌ፡ TLB68314 ወይም በSMS የመጣውን ኮድ)።'
                        : 'Enter the exact transaction reference number received in the Telebirr SMS receipt.'}
                    </div>
                  </div>

                  {/* Sender Phone (Optional / Recommended) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
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

                  {/* Security & Verification Notice */}
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0.65rem 0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)' }}>
                    {language === 'am' ? (
                      <>🔒 <strong>የአስተዳዳሪ ማረጋገጫ ያስፈልጋል፡</strong> የግብይት ቁጥሩን ሲልኩ ክፍያዎ በ<strong>በማረጋገጥ ላይ (Pending Verification)</strong> ሁኔታ ይመዘገባል። የባሕር ዳር ቢሯችን ከቴሌብር ስቴትመንት ጋር ካረጋገጠ በኋላ የስልጠናውን ሙሉ መዳረሻ ይከፍታል። ሚስጥራዊ የቴሌብር ፒን (PIN) ቁጥርዎን በፍጹም አንጠይቅም።</>
                    ) : (
                      <>🔒 <strong>Administrator Verification Required:</strong> Submitting will record your payment as <strong>Pending Verification</strong>. Our Bahir Dar admissions team verifies transactions against our Telebirr statements before unlocking course access. We never request your Telebirr PIN or passwords.</>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !transactionRef.trim()}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  >
                    <span>{loading ? t.payment.submitting : t.payment.submitVerification}</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default TelebirrPaymentModal;
