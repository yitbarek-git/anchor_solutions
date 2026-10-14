import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { api } from '../services/api.js';
import { Alert } from '../components/Alert.jsx';
import { formatPrice } from '../utils/formatters.js';
import {
  BookOpen,
  CheckCircle,
  Bookmark,
  Settings,
  Play,
  Award,
  User,
  ArrowRight,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
} from 'lucide-react';

export function StudentDashboardPage({ navigate }) {
  const { t, language, setLanguage } = useLanguage();
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [userPayments, setUserPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'bookmarks', 'completed', 'payments', 'settings'
  const [loading, setLoading] = useState(true);
  const [settingsSuccess, setSettingsSuccess] = useState(null);
  const [settingsData, setSettingsData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    preferredLanguage: user?.preferredLanguage || language,
    themePreference: user?.themePreference || theme,
  });

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const [dashRes, paymentsRes] = await Promise.all([
          api.student.getDashboard(language),
          api.payments.getMyPayments(),
        ]);
        if (dashRes.success && dashRes.data) {
          setDashboardData(dashRes.data);
        }
        if (paymentsRes.success && paymentsRes.data) {
          setUserPayments(paymentsRes.data);
        }
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, [language]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(settingsData);
      setLanguage(settingsData.preferredLanguage);
      setTheme(settingsData.themePreference);
      setSettingsSuccess('Account preferences saved successfully.');
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading student portal...
      </div>
    );
  }

  const { enrolledCourses = [], userBookmarks = [], completedLessons = [], stats = {} } = dashboardData || {};

  return (
    <div className="section" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--color-gold-subtle)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.4rem' }}>
                {user?.firstName?.[0] || 'S'}
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {t.student.welcome}, {user?.firstName} {user?.lastName}!
                </h1>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {user?.email} · {language === 'am' ? 'የተማሪ መለያ' : 'Student Account'}
                </p>
              </div>
            </div>

            {/* Quick Stats Pill */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-gold)' }}>{stats.totalEnrolled || 0}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.student.enrolledCourses}</div>
              </div>
              <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-gold)' }}>{stats.totalCompletedLessons || 0}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.student.completedLessons}</div>
              </div>
              <div style={{ padding: '0.5rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-gold)' }}>{stats.totalBookmarks || 0}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.student.bookmarks}</div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tabs-scroll-container" style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button
              onClick={() => setActiveTab('courses')}
              className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <BookOpen size={16} />
              <span>{t.student.enrolledCourses}</span>
            </button>
            <button
              onClick={() => setActiveTab('bookmarks')}
              className={`btn btn-sm ${activeTab === 'bookmarks' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Bookmark size={16} />
              <span>{t.student.bookmarks} ({userBookmarks.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`btn btn-sm ${activeTab === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <CheckCircle size={16} />
              <span>{t.student.completedLessons} ({completedLessons.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`btn btn-sm ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <CreditCard size={16} />
              <span>{language === 'am' ? 'የክፍያ ታሪክ' : 'Payments & Tuition'} ({userPayments.length})</span>
              {userPayments.some((p) => p.status === 'pending') && (
                <span className="badge badge-gold" style={{ fontSize: '0.68rem', padding: '1px 5px' }}>
                  Pending
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`btn btn-sm ${activeTab === 'settings' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Settings size={16} />
              <span>{t.student.accountSettings}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Enrolled Courses */}
        {activeTab === 'courses' && (
          <div>
            {enrolledCourses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <BookOpen size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3>{t.student.noEnrollments}</h3>
                <button onClick={() => navigate('/courses')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                  {t.coursesPage.title}
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {enrolledCourses.map((c) => (
                  <div key={c.id} className="card" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className="badge badge-gold">{c.category}</span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-gold)' }}>
                        {c.progressPercent}% {t.student.progress}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {c.title}
                    </h3>

                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', overflow: 'hidden', margin: '0.75rem 0 1.25rem' }}>
                      <div
                        style={{
                          width: `${c.progressPercent}%`,
                          height: '100%',
                          backgroundColor: 'var(--color-gold)',
                          borderRadius: '4px',
                          transition: 'width 0.4s ease',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                      <span>{c.completedLessons} of {c.totalLessons} lessons finished</span>
                    </div>

                    <button
                      onClick={() => navigate(`/courses/${c.slug}`)}
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                    >
                      <Play size={16} />
                      <span>{t.actions.continueLearning}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Bookmarks */}
        {activeTab === 'bookmarks' && (
          <div>
            {userBookmarks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <Bookmark size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3>{t.student.noBookmarks}</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userBookmarks.map((b) => (
                  <div
                    key={b.bookmarkId}
                    style={{
                      padding: '1.25rem',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gold)', fontWeight: 600 }}>
                        {b.courseTitle}
                      </div>
                      <div style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.2rem 0' }}>
                        {b.title}
                      </div>
                      {b.summary && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {b.summary}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/courses/${b.courseSlug}/lessons/${b.lessonId}`)}
                      className="btn btn-primary btn-sm"
                    >
                      <span>Open Lesson</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Completed Lessons */}
        {activeTab === 'completed' && (
          <div>
            {completedLessons.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <CheckCircle size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                <h3>{t.student.noCompleted}</h3>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {completedLessons.map((l) => (
                  <div
                    key={l.lessonId}
                    style={{
                      padding: '1rem 1.25rem',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <CheckCircle size={18} style={{ color: 'var(--color-success)' }} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{l.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{l.courseTitle}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate(`/courses/${l.courseSlug}/lessons/${l.lessonId}`)}
                      className="btn btn-secondary btn-sm"
                    >
                      Review
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: My Payments & Invoices */}
        {activeTab === 'payments' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: 0 }}>
                  {language === 'am' ? 'የተማሪው የክፍያ ማረጋገጫዎች' : 'My Tuition Payments & Verifications'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.25rem 0 0' }}>
                  {language === 'am'
                    ? 'በቴሌብር የፈጸሟቸው ክፍያዎች እና የአስተዳዳሪ ማረጋገጫ ሁኔታዎች።'
                    : 'Track submitted Telebirr receipts and administrator verification status.'}
                </p>
              </div>

              <button
                onClick={() => navigate('/courses')}
                className="btn btn-primary btn-sm"
              >
                <span>{language === 'am' ? 'ተጨማሪ ስልጠናዎችን ይመልከቱ' : 'Enroll in Another Course'}</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {userPayments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                <CreditCard size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  {language === 'am' ? 'እስካሁን ምንም የተመዘገበ ክፍያ የለም' : 'No Payment Transactions Yet'}
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                  {language === 'am'
                    ? 'በቴሌብር ክፍያ ፈጽመው የማረጋገጫ ቁጥሩን ሲልኩ፣ ሁኔታውን እዚህ መከታተል ይችላሉ።'
                    : 'When you transfer course tuition via Telebirr and submit your transaction reference, you can track verification here.'}
                </p>
                <button onClick={() => navigate('/courses')} className="btn btn-primary">
                  {language === 'am' ? 'ኮርሶችን ያስሱ' : 'Browse Available Courses'}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {userPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="card"
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem',
                      borderLeft:
                        payment.status === 'approved'
                          ? '4px solid var(--color-success)'
                          : payment.status === 'pending'
                          ? '4px solid var(--color-gold)'
                          : '4px solid var(--color-danger)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>
                          {payment.course_title_en}
                        </h4>
                        <span className="badge badge-gold" style={{ fontSize: '0.72rem' }}>
                          Telebirr
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        <span>
                          Reference:{' '}
                          <strong style={{ color: 'var(--color-gold)', fontFamily: 'monospace' }}>
                            {payment.transaction_reference}
                          </strong>
                        </span>
                        <span>Recipient: <strong>{payment.recipient_phone}</strong> (<em>Tizta</em>)</span>
                        <span>Date: {new Date(payment.created_at).toLocaleDateString()}</span>
                      </div>

                      {payment.status === 'pending' && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-gold)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={14} />
                          <span>{t.student.pendingNotice}</span>
                        </div>
                      )}

                      {payment.status === 'rejected' && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--color-danger)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <XCircle size={14} />
                          <span>{t.student.declinedNotice}{payment.admin_notes || (language === 'am' ? 'የክፍያ ማረጋገጫውን ማረጋገጥ አልተቻለም።' : 'Could not verify transaction reference.')}</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                          {formatPrice(payment.amount)}
                        </div>
                        <div>
                          {payment.status === 'pending' && (
                            <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                              {language === 'am' ? 'በማረጋገጥ ላይ' : 'Pending Review'}
                            </span>
                          )}
                          {payment.status === 'approved' && (
                            <span className="badge badge-success" style={{ fontSize: '0.75rem' }}>
                              ✓ {language === 'am' ? 'ተረጋግጧል' : 'Approved'}
                            </span>
                          )}
                          {payment.status === 'rejected' && (
                            <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>
                              {language === 'am' ? 'አልተረጋገጠም' : 'Declined'}
                            </span>
                          )}
                        </div>
                      </div>

                      {payment.status === 'approved' && (
                        <button
                          onClick={() => navigate(`/courses/${payment.course_slug}`)}
                          className="btn btn-primary btn-sm"
                        >
                          <span>{t.student.goToCourse}</span>
                          <ArrowRight size={14} />
                        </button>
                      )}

                      {payment.status === 'rejected' && (
                        <button
                          onClick={() => navigate(`/checkout/${payment.course_slug}`)}
                          className="btn btn-secondary btn-sm"
                        >
                          <span>{t.student.resubmit}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Account Settings */}
        {activeTab === 'settings' && (
          <div style={{ maxWidth: '600px' }}>
            <div className="card" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
                {t.student.accountSettings}
              </h3>

              {settingsSuccess && <Alert type="success" message={settingsSuccess} />}

              <form onSubmit={handleSettingsSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">{t.auth.firstName}</label>
                    <input
                      type="text"
                      required
                      value={settingsData.firstName}
                      onChange={(e) => setSettingsData({ ...settingsData, firstName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">{t.auth.lastName}</label>
                    <input
                      type="text"
                      required
                      value={settingsData.lastName}
                      onChange={(e) => setSettingsData({ ...settingsData, lastName: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t.auth.phone}</label>
                  <input
                    type="tel"
                    value={settingsData.phone}
                    onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Preferred Language</label>
                    <select
                      value={settingsData.preferredLanguage}
                      onChange={(e) => setSettingsData({ ...settingsData, preferredLanguage: e.target.value })}
                      className="form-select"
                    >
                      <option value="en">English</option>
                      <option value="am">አማርኛ (Amharic)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Interface Theme</label>
                    <select
                      value={settingsData.themePreference}
                      onChange={(e) => setSettingsData({ ...settingsData, themePreference: e.target.value })}
                      className="form-select"
                    >
                      <option value="light">Light Mode</option>
                      <option value="dark">Dark Mode</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  {t.actions.save}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboardPage;
