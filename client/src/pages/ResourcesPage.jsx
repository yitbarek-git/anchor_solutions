import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { api } from '../services/api.js';
import { Search, Download, FileText } from 'lucide-react';

export function ResourcesPage({ navigate }) {
  const { t, language } = useLanguage();
  const [resources, setResources] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResources() {
      setLoading(true);
      try {
        const res = await api.courses.getResources({
          lang: language,
          search: search.trim() || undefined,
          type: selectedType !== 'all' ? selectedType : undefined,
        });
        if (res.success && res.data) {
          setResources(res.data);
        }
      } catch (err) {
        console.error('Failed to load resources', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResources();
  }, [language, search, selectedType]);

  const handleDownload = (resItem) => {
    window.location.href = resItem.downloadUrl;
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h1 style={{ marginBottom: '0.5rem' }}>{t.resourcesPage.title}</h1>
          <p className="section-subtitle">{t.resourcesPage.subtitle}</p>
        </div>

        {/* Search & Type Filter */}
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.25rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.resourcesPage.searchPlaceholder}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="form-select"
                aria-label={language === 'am' ? 'በፋይል አይነት አጣራ' : 'Filter by format'}
              >
                <option value="all">{t.resourcesPage.filterAll}</option>
                <option value="pdf">{t.resourcesPage.filterPdf}</option>
                <option value="zip">{t.resourcesPage.filterZip}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            {t.common.loadingMaterials}
          </div>
        ) : resources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
            <FileText size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>{t.resourcesPage.noResources}</h3>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {resources.map((item) => (
              <div
                key={item.id}
                className="card"
                style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="badge badge-gold" style={{ textTransform: 'uppercase' }}>
                      {item.resourceType}
                    </span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {item.fileSize}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                    {item.courseTitle}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button
                    onClick={() => navigate(`/courses/${item.courseSlug}/lessons/${item.lessonId}`)}
                    className="btn btn-secondary btn-sm"
                  >
                    {t.actions.reviewLesson || 'View Lesson'}
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    className="btn btn-primary btn-sm"
                  >
                    <Download size={15} />
                    <span>{t.actions.download}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResourcesPage;
