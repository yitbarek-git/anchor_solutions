import React from 'react';
import { CourseImage } from './CourseImage.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { formatPrice } from '../utils/formatters.js';
import { Clock, BookOpen, Award } from 'lucide-react';

export function CourseCard({ course, navigate }) {
  const { language, t } = useLanguage();

  const handleCardClick = () => {
    navigate(`/courses/${course.slug}`);
  };

  return (
    <article
      className="card card-clickable"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      aria-label={`View ${course.title} course details`}
    >
      {/* Thumbnail artwork / uploaded poster */}
      <div className="course-card-thumb">
        <CourseImage slug={course.slug} title={course.title} />
        <span className="badge badge-gold course-card-category">
          {course.category}
        </span>
        <div className="course-card-price">
          {formatPrice(course.price)}
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', fontWeight: 700 }}>
          {course.title}
        </h3>
        {/* Bilingual Subtitle */}
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem', fontWeight: 500 }}>
          {language === 'am' ? course.titleEn : course.titleAm}
        </p>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.tagline || course.description}
        </p>

        {/* Course Metrics */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={15} />
            <span>{course.durationWeeks} {t.coursesPage.weeks} ({course.totalHours} {t.coursesPage.hrs})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <BookOpen size={15} />
            <span>{course.modulesCount || 4} {t.courseDetail.modulesCount}</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="card-footer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)' }}>
          {course.level === 'beginner' ? (language === 'am' ? 'ጀማሪ' : 'Beginner') : (language === 'am' ? 'ሁሉም ደረጃዎች' : 'All Levels')}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gold)' }}>
          {t.actions.viewCourse} →
        </span>
      </div>
    </article>
  );
}

export default CourseCard;
