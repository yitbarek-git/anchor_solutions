import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { CourseCard } from '../components/CourseCard.jsx';
import { TisAbayPartnershipSection } from '../components/TisAbayPartnershipSection.jsx';
import { Search, Filter, RotateCcw } from 'lucide-react';

export function CoursesPage({ navigate, initialSearch = '' }) {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      try {
        const res = await api.courses.getAll({
          lang: language,
          search: search.trim() || undefined,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          level: selectedLevel !== 'all' ? selectedLevel : undefined,
        });
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err) {
        console.error('Error fetching courses', err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, [language, search, selectedCategory, selectedLevel]);

  const categories = [
    { id: 'all', label: t.coursesPage.categoryAll },
    { id: 'Design & Creative', label: language === 'am' ? 'ዲዛይን እና ፈጠራ' : 'Design & Creative' },
    { id: 'Media Production', label: language === 'am' ? 'ሚዲያ እና ቪዲዮ' : 'Media Production' },
    { id: 'Visual Arts', label: language === 'am' ? 'ቪዥዋል አርት' : 'Visual Arts' },
    { id: 'Business & Growth', label: language === 'am' ? 'ንግድ እና ማርኬቲንግ' : 'Business & Growth' },
    { id: 'Hardware & IT', label: language === 'am' ? 'ሃርድዌር እና ጥገና' : 'Hardware & IT' },
    { id: 'Foundations', label: language === 'am' ? 'መሰረታዊ እውቀት' : 'Foundations' },
    { id: 'Emerging Tech', label: language === 'am' ? 'አዳዲስ ቴክኖሎጂ' : 'Emerging Tech' },
  ];

  const levels = [
    { id: 'all', label: t.coursesPage.levelAll },
    { id: 'beginner', label: language === 'am' ? 'ጀማሪ' : 'Beginner' },
    { id: 'intermediate', label: language === 'am' ? 'መካከለኛ' : 'Intermediate' },
    { id: 'all_levels', label: language === 'am' ? 'ሁሉም ደረጃዎች' : 'All Levels' },
  ];

  const handleReset = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedLevel('all');
  };

  return (
    <div className="section">
      <div className="container">
        {/* Page Title */}
        <div className="section-header">
          <h1 style={{ marginBottom: '0.5rem' }}>{t.coursesPage.title}</h1>
          <p className="section-subtitle">{t.coursesPage.subtitle}</p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.coursesPage.searchPlaceholder}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="form-select"
                aria-label="Filter by domain"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>

            {/* Level Dropdown */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="form-select"
                aria-label="Filter by level"
              >
                {levels.map((l) => (
                  <option key={l.id} value={l.id}>{l.label}</option>
                ))}
              </select>
            </div>

            {/* Reset Button */}
            <div>
              <button
                onClick={handleReset}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                <RotateCcw size={16} />
                <span>{t.coursesPage.resetFilters}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Courses Result */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            {t.common.loadingCatalog}
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <Filter size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>{t.coursesPage.noCoursesFound}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              {t.coursesPage.noCoursesSubtitle}
            </p>
            <button onClick={handleReset} className="btn btn-primary">
              {t.coursesPage.resetFilters}
            </button>
          </div>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} navigate={navigate} />
            ))}
          </div>
        )}
      </div>

      {/* Tis Abay College Collaboration & Vocational Tracks */}
      <TisAbayPartnershipSection navigate={navigate} />
    </div>
  );
}

export default CoursesPage;
