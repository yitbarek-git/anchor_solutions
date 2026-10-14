import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { Alert } from '../components/Alert.jsx';
import {
  CheckCircle,
  Bookmark,
  Download,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Lock,
  PlayCircle,
  CheckCircle2,
  ListOrdered,
  FileText,
} from 'lucide-react';

export function LessonPage({ lessonId, navigate }) {
  const { t, language } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchLessonData() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.courses.getLesson(lessonId, language);
        if (res.success && res.data) {
          setLesson(res.data);
          setIsCompleted(!!res.data.isCompleted);
          setIsBookmarked(!!res.data.isBookmarked);

          // Also load the course structure for sidebar navigation
          if (res.data.courseSlug) {
            const courseRes = await api.courses.getBySlug(res.data.courseSlug, language);
            if (courseRes.success && courseRes.data) {
              setCourse(courseRes.data);
            }
          }
        } else {
          setError('Lesson could not be found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    }
    fetchLessonData();
  }, [lessonId, language]);

  const handleToggleCompletion = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setActionLoading(true);
    try {
      const res = await api.student.toggleComplete(lesson.id);
      if (res.success && res.data) {
        setIsCompleted(res.data.isCompleted);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.student.toggleBookmark(lesson.id);
      if (res.success && res.data) {
        setIsBookmarked(res.data.isBookmarked);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDownload = async (resource) => {
    if (resource.isLocked) {
      alert(language === 'am' ? 'ይህ መርጃ ለተመዘገቡ ተማሪዎች ብቻ የተፈቀደ ነው።' : 'This resource is reserved for enrolled students.');
      return;
    }
    window.location.href = resource.downloadUrl;
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        {t.actions.loading}
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
        <h2>{language === 'am' ? 'ትምህርቱ አልተገኘም' : 'Lesson Not Found'}</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          {error || (language === 'am' ? 'የትምህርቱ ይዘት ሊከፈት አልቻለም።' : 'The requested lesson could not be loaded.')}
        </p>
        <button onClick={() => navigate('/courses')} className="btn btn-primary">
          {t.common.backToCourses}
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: 'calc(100vh - 4.5rem)' }}>
      {/* Lesson Header Breadcrumbs Bar */}
      <div style={{ backgroundColor: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)', padding: '0.85rem 0' }}>
        <div className="container">
          <div className="lesson-breadcrumbs-bar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(`/courses/${lesson.courseSlug}`)}
                style={{ color: 'var(--color-gold)', fontWeight: 600 }}
              >
                ← {lesson.courseTitle || 'Course Overview'}
              </button>
              <span>/</span>
              <span>{lesson.moduleTitle}</span>
              <span>/</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{lesson.title}</span>
            </div>

            {/* Action buttons: Bookmark & Complete */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={handleToggleBookmark}
                className={`btn btn-sm ${isBookmarked ? 'btn-primary' : 'btn-secondary'}`}
                title="Save bookmark"
              >
                <Bookmark size={16} fill={isBookmarked ? 'currentColor' : 'none'} />
                <span>{isBookmarked ? t.actions.bookmarked : t.actions.bookmark}</span>
              </button>

              <button
                onClick={handleToggleCompletion}
                disabled={actionLoading}
                className={`btn btn-sm ${isCompleted ? 'btn-primary' : 'btn-secondary'}`}
              >
                <CheckCircle size={16} />
                <span>{isCompleted ? t.actions.completed : t.actions.markComplete}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Lesson Body & Sidebar */}
      <div className="container" style={{ padding: '2rem var(--container-padding) 4rem' }}>
        <div className="lesson-layout-grid">
          {/* Main Lesson Content (Left Column) */}
          <div>
            {/* Valid Responsive Video Embed */}
            {lesson.videoUrl && (
              <div style={{ backgroundColor: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2rem', boxShadow: 'var(--shadow-md)', position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={lesson.videoUrl}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
            )}

            {/* Lesson Title & Summary */}
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', fontWeight: 800 }}>
                {lesson.title}
              </h1>

              {lesson.summary && (
                <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '1.5rem', fontStyle: 'italic' }}>
                  {lesson.summary}
                </p>
              )}

              {/* Rich Content rendering */}
              <div
                style={{ fontSize: '1rem', lineHeight: '1.75', color: 'var(--text-primary)' }}
                dangerouslySetInnerHTML={{ __html: lesson.richContent }}
              />
            </div>

            {/* Practical Exercises */}
            {lesson.exercises && lesson.exercises.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ListOrdered size={20} style={{ color: 'var(--color-gold)' }} />
                  <span>{t.lessonPage.practicalExercise}</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {lesson.exercises.map((ex, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>0{i + 1}.</span>
                      <span style={{ fontSize: '0.95rem' }}>{ex}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Downloadable Resources */}
            {lesson.resources && lesson.resources.length > 0 && (
              <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={20} style={{ color: 'var(--color-gold)' }} />
                  <span>{t.lessonPage.downloadableResources}</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {lesson.resources.map((res) => (
                    <div
                      key={res.id}
                      style={{
                        padding: '1rem 1.25rem',
                        backgroundColor: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span className="badge badge-gold" style={{ textTransform: 'uppercase' }}>
                          {res.resourceType}
                        </span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.92rem' }}>{res.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{res.fileSize}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDownload(res)}
                        className={`btn btn-sm ${res.isLocked ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        {res.isLocked ? <Lock size={15} /> : <Download size={15} />}
                        <span>{res.isLocked ? t.lessonPage.lockedResource : t.actions.download}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Previous & Next Lesson Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              {lesson.prevLesson ? (
                <button
                  onClick={() => navigate(`/courses/${lesson.courseSlug}/lessons/${lesson.prevLesson.id}`)}
                  className="btn btn-secondary"
                >
                  <ArrowLeft size={16} />
                  <span>{t.actions.prev}</span>
                </button>
              ) : <div />}

              {lesson.nextLesson ? (
                <button
                  onClick={() => navigate(`/courses/${lesson.courseSlug}/lessons/${lesson.nextLesson.id}`)}
                  className="btn btn-primary"
                >
                  <span>{t.actions.next}</span>
                  <ArrowRight size={16} />
                </button>
              ) : <div />}
            </div>
          </div>

          {/* Sidebar: Course Curriculum Index (Right Column) */}
          <div>
            <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'sticky', top: '5.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={18} style={{ color: 'var(--color-gold)' }} />
                <span>{t.lessonPage.courseNavigation}</span>
              </h3>

              {course ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {(course.modules || []).map((modItem) => (
                    <div key={modItem.id}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                        {modItem.title}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {(modItem.lessons || []).map((lesItem) => {
                          const isActive = lesItem.id === lesson.id;
                          return (
                            <button
                              key={lesItem.id}
                              onClick={() => navigate(`/courses/${course.slug}/lessons/${lesItem.id}`)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.75rem',
                                borderRadius: 'var(--radius-md)',
                                textAlign: 'left',
                                fontSize: '0.88rem',
                                backgroundColor: isActive ? 'var(--color-gold-subtle)' : 'transparent',
                                color: isActive ? 'var(--color-gold)' : 'var(--text-secondary)',
                                fontWeight: isActive ? 700 : 500,
                              }}
                            >
                              <PlayCircle size={15} style={{ flexShrink: 0 }} />
                              <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {lesItem.title}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Loading curriculum navigation...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
