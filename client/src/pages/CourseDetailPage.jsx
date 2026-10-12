import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { CourseArtwork } from '../assets/CourseIllustrations.jsx';
import { Modal } from '../components/Modal.jsx';
import { TelebirrPaymentModal } from '../components/TelebirrPaymentModal.jsx';
import { formatPrice } from '../utils/formatters.js';
import { Clock, BookOpen, Award, CheckCircle2, PlayCircle, Lock, PhoneCall, Send, ChevronRight, FileText } from 'lucide-react';

export function CourseDetailPage({ slug, navigate }) {
  const { t, language } = useLanguage();
  const { user, isAuthenticated, login } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  useEffect(() => {
    async function fetchCourse() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.courses.getBySlug(slug, language);
        if (res.success && res.data) {
          setCourse(res.data);
        } else {
          setError('Course details could not be loaded.');
        }
      } catch (err) {
        setError(err.message || 'Course not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [slug, language]);

  const handleEnrollClick = () => {
    setShowPaymentModal(true);
  };

  const handleDemoInstantEnroll = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      if (!isAuthenticated) {
        // Automatically authenticate with demo student account
        await login({ email: 'student@anchorsolution.et', password: 'Student@Anchor2026' });
      }
      const res = await api.student.enroll(course.id);
      if (res.success) {
        setEnrollSuccess(true);
        setCourse((prev) => ({ ...prev, isEnrolled: true }));
        setTimeout(() => {
          setShowPaymentModal(false);
          // Route to first lesson
          const firstLesson = course.modules?.[0]?.lessons?.[0];
          if (firstLesson) {
            navigate(`/courses/${course.slug}/lessons/${firstLesson.id}`);
          }
        }, 1200);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading course curriculum...
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1rem' }}>Course Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          {error || 'The requested course does not exist.'}
        </p>
        <button onClick={() => navigate('/courses')} className="btn btn-primary">
          Back to Courses
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Course Header Banner */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '3.5rem 0 3rem' }}>
        <div className="container">
          <div className="course-detail-hero-grid">
            {/* Course Information */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <span className="badge badge-gold">{course.category}</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {course.level === 'beginner' ? (language === 'am' ? 'ጀማሪ ደረጃ' : 'Beginner Level') : (language === 'am' ? 'ለሁሉም ደረጃዎች' : 'All Levels')}
                </span>
              </div>

              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>
                {course.title}
              </h1>
              {/* Alternate Bilingual Title */}
              <h2 style={{ fontSize: '1.15rem', color: 'var(--color-gold)', fontWeight: 600, marginBottom: '1.25rem' }}>
                {language === 'am' ? course.titleEn : course.titleAm}
              </h2>

              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '1.75rem' }}>
                {course.tagline || course.description}
              </p>

              {/* Meta stats */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', padding: '1rem 0', borderTop: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Clock size={18} style={{ color: 'var(--color-gold)' }} />
                  <span>{course.durationWeeks} {t.coursesPage.weeks} ({course.totalHours} {t.coursesPage.hrs})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <Award size={18} style={{ color: 'var(--color-gold)' }} />
                  <span>{course.partnerName}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <BookOpen size={18} style={{ color: 'var(--color-gold)' }} />
                  <span>{course.modules?.length || 4} {t.courseDetail.modulesCount}</span>
                </div>
              </div>
            </div>

            {/* Course Enrollment Card */}
            <div>
              <div className="card" style={{ boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ height: '220px', overflow: 'hidden' }}>
                  <CourseArtwork slug={course.slug} />
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {formatPrice(course.price)}
                    </span>
                    {course.regularPrice > course.price && (
                      <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        {formatPrice(course.regularPrice)}
                      </span>
                    )}
                  </div>

                  {course.isEnrolled ? (
                    <div style={{ marginBottom: '1rem' }}>
                      <span className="badge badge-success" style={{ width: '100%', padding: '0.65rem', justifyContent: 'center', fontSize: '0.9rem' }}>
                        ✓ {t.actions.enrolled}
                      </span>
                      <button
                        onClick={() => {
                          const firstLesson = course.modules?.[0]?.lessons?.[0];
                          if (firstLesson) navigate(`/courses/${course.slug}/lessons/${firstLesson.id}`);
                        }}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '0.75rem' }}
                      >
                        {t.actions.continueLearning}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleEnrollClick}
                      className="btn btn-primary btn-lg"
                      style={{ width: '100%', marginBottom: '1.25rem' }}
                    >
                      {t.actions.enroll}
                    </button>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-gold)' }} />
                      <span>{t.courseDetail.practicalProjects}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-gold)' }} />
                      <span>{t.courseDetail.physicalLabs}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-gold)' }} />
                      <span>{t.courseDetail.certificate}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle2 size={16} style={{ color: 'var(--color-gold)' }} />
                      <span>{t.courseDetail.offlineNotes}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Content */}
      <div className="section">
        <div className="container">
          <div className="course-detail-body-grid">
            {/* Left Column: Objectives & Curriculum */}
            <div>
              {/* Objectives */}
              {course.objectives && course.objectives.length > 0 && (
                <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                    {t.courseDetail.objectives}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                    {course.objectives.map((obj, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                        <CheckCircle2 size={18} style={{ color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }} />
                        <span style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Description */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', fontWeight: 700 }}>
                  {t.courseDetail.overview}
                </h3>
                <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                  {course.description}
                </p>
              </div>

              {/* Curriculum & Modules */}
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', fontWeight: 700 }}>
                  {t.courseDetail.curriculum}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(course.modules || []).map((moduleItem, modIdx) => (
                    <div
                      key={moduleItem.id}
                      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}
                    >
                      {/* Module Title Header */}
                      <div style={{ padding: '1rem 1.25rem', backgroundColor: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>
                            {moduleItem.title}
                          </h4>
                          {moduleItem.description && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                              {moduleItem.description}
                            </p>
                          )}
                        </div>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {moduleItem.durationMinutes} min
                        </span>
                      </div>

                      {/* Module Lessons */}
                      <div>
                        {(moduleItem.lessons || []).map((lesson) => (
                          <div
                            key={lesson.id}
                            onClick={() => {
                              if (lesson.isFreePreview || course.isEnrolled) {
                                navigate(`/courses/${course.slug}/lessons/${lesson.id}`);
                              } else {
                                handleEnrollClick();
                              }
                            }}
                            style={{
                              padding: '0.85rem 1.25rem',
                              borderBottom: '1px solid var(--border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease',
                            }}
                            className="card-clickable"
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {lesson.isFreePreview || course.isEnrolled ? (
                                <PlayCircle size={18} style={{ color: 'var(--color-gold)', flexShrink: 0 }} />
                              ) : (
                                <Lock size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                              )}
                              <div>
                                <div style={{ fontSize: '0.92rem', fontWeight: 600 }}>
                                  {lesson.title}
                                </div>
                                {lesson.summary && (
                                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {lesson.summary}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              {lesson.isFreePreview && (
                                <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                                  {t.courseDetail.freePreviewBadge}
                                </span>
                              )}
                              <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Audience & Requirements */}
            <div>
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  {t.courseDetail.targetAudience}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {course.targetAudience || 'Beginners, working professionals, and career switchers looking for real-world vocational mastery.'}
                </p>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', fontWeight: 700 }}>
                  {t.courseDetail.prerequisites}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {course.prerequisites || 'Basic computer literacy and a passion for hands-on learning. No prior design or engineering background required.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Telebirr & Course Checkout Modal */}
      <TelebirrPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        course={course}
        onPaymentSuccess={(payment) => {
          // Keep modal open or show pending verification
        }}
        navigate={navigate}
      />
    </div>
  );
}

export default CourseDetailPage;
