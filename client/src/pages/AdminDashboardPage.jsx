import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { Modal } from '../components/Modal.jsx';
import { Alert } from '../components/Alert.jsx';
import { formatPrice } from '../utils/formatters.js';
import {
  Shield,
  BookOpen,
  Users,
  Plus,
  Edit2,
  Trash2,
  Upload,
  CheckCircle,
  Eye,
  Settings,
  FolderPlus,
  Video,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

export function AdminDashboardPage({ navigate }) {
  const { t, language } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [paymentStats, setPaymentStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [activeTab, setActiveTab] = useState('courses'); // 'courses', 'students', 'payments', 'upload'
  const [loading, setLoading] = useState(true);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [paymentActionMessage, setPaymentActionMessage] = useState(null);
  const [selectedRejectPayment, setSelectedRejectPayment] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processingPaymentId, setProcessingPaymentId] = useState(null);

  // Modals state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseFormData, setCourseFormData] = useState({
    titleEn: '',
    titleAm: '',
    taglineEn: '',
    taglineAm: '',
    descriptionEn: '',
    descriptionAm: '',
    category: 'Design & Creative',
    level: 'beginner',
    price: 1500,
    regularPrice: 2000,
    durationWeeks: 4,
    totalHours: 20,
    isPublished: true,
  });

  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleFormData, setModuleFormData] = useState({
    courseId: '',
    titleEn: '',
    titleAm: '',
    descriptionEn: '',
    descriptionAm: '',
    durationMinutes: 60,
  });

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [lessonFormData, setLessonFormData] = useState({
    courseId: '',
    moduleId: '',
    titleEn: '',
    titleAm: '',
    summaryEn: '',
    summaryAm: '',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    videoDurationSeconds: 600,
    isFreePreview: false,
    richContentEn: '<p>Interactive educational material...</p>',
    richContentAm: '<p>ተግባራዊ የትምህርት ይዘት...</p>',
  });

  const [deleteConfirmCourse, setDeleteConfirmCourse] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login');
      return;
    }
    loadAdminData();
  }, [isAdmin]);

  async function loadAdminData() {
    setLoading(true);
    try {
      const [overviewRes, coursesRes, studentsRes, paymentsRes] = await Promise.all([
        api.admin.getOverview(),
        api.admin.getCourses(),
        api.admin.getStudents(),
        api.payments.getAdminPayments(),
      ]);
      if (overviewRes.success) setStats(overviewRes.data);
      if (coursesRes.success) setCourses(coursesRes.data);
      if (studentsRes.success) setStudents(studentsRes.data);
      if (paymentsRes.success) {
        setPayments(paymentsRes.data);
        if (paymentsRes.stats) setPaymentStats(paymentsRes.stats);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPayments(filter = paymentFilter, search = paymentSearch) {
    setLoadingPayments(true);
    try {
      const res = await api.payments.getAdminPayments({
        status: filter,
        search,
      });
      if (res.success) {
        setPayments(res.data);
        if (res.stats) setPaymentStats(res.stats);
      }
    } catch (err) {
      console.error('Failed to load payments', err);
    } finally {
      setLoadingPayments(false);
    }
  }

  const handleApprovePayment = async (payment) => {
    if (!window.confirm(`Approve Telebirr payment ${payment.transaction_reference} for ${payment.user_name} (${payment.course_title_en})?\n\nThis will immediately grant active course access to the student.`)) {
      return;
    }
    setProcessingPaymentId(payment.id);
    setPaymentActionMessage(null);
    try {
      const res = await api.payments.approvePayment(payment.id, 'Verified via Telebirr merchant record');
      if (res.success) {
        setPaymentActionMessage({ type: 'success', text: res.message });
        await loadPayments();
        // Also refresh stats and students
        const [overviewRes, studentsRes] = await Promise.all([
          api.admin.getOverview(),
          api.admin.getStudents(),
        ]);
        if (overviewRes.success) setStats(overviewRes.data);
        if (studentsRes.success) setStudents(studentsRes.data);
      }
    } catch (err) {
      setPaymentActionMessage({ type: 'error', text: err.message });
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleOpenReject = (payment) => {
    setSelectedRejectPayment(payment);
    setRejectReason('Transaction reference could not be matched on Telebirr statement.');
  };

  const handleConfirmReject = async () => {
    if (!selectedRejectPayment) return;
    setProcessingPaymentId(selectedRejectPayment.id);
    setPaymentActionMessage(null);
    try {
      const res = await api.payments.rejectPayment(selectedRejectPayment.id, rejectReason);
      if (res.success) {
        setPaymentActionMessage({ type: 'info', text: res.message });
        setSelectedRejectPayment(null);
        await loadPayments();
      }
    } catch (err) {
      setPaymentActionMessage({ type: 'error', text: err.message });
    } finally {
      setProcessingPaymentId(null);
    }
  };

  const handleOpenCreateCourse = () => {
    setEditingCourse(null);
    setCourseFormData({
      titleEn: '',
      titleAm: '',
      taglineEn: '',
      taglineAm: '',
      descriptionEn: '',
      descriptionAm: '',
      category: 'Design & Creative',
      level: 'beginner',
      price: 1500,
      regularPrice: 2000,
      durationWeeks: 4,
      totalHours: 20,
      isPublished: true,
    });
    setShowCourseModal(true);
  };

  const handleOpenEditCourse = (course) => {
    setEditingCourse(course);
    setCourseFormData({
      titleEn: course.titleEn,
      titleAm: course.titleAm,
      taglineEn: course.tagline || '',
      taglineAm: '',
      descriptionEn: course.description || '',
      descriptionAm: '',
      category: course.category,
      level: course.level,
      price: course.price,
      regularPrice: course.regularPrice,
      durationWeeks: course.durationWeeks,
      totalHours: course.totalHours,
      isPublished: course.isPublished,
    });
    setShowCourseModal(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.admin.updateCourse(editingCourse.id, courseFormData);
      } else {
        await api.admin.createCourse(courseFormData);
      }
      setShowCourseModal(false);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteConfirmCourse) return;
    try {
      await api.admin.deleteCourse(deleteConfirmCourse.id);
      setDeleteConfirmCourse(null);
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await api.admin.updateCourse(course.id, { isPublished: !course.isPublished });
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createModule(moduleFormData);
      setShowModuleModal(false);
      alert('Module created successfully.');
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await api.admin.createLesson(lessonFormData);
      setShowLessonModal(false);
      alert('Lesson created successfully.');
      loadAdminData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.admin.uploadMedia(formData);
      if (res.success) {
        setUploadMessage(`File "${file.name}" uploaded successfully. Storage path: ${res.file.url}`);
      }
    } catch (err) {
      setUploadMessage(`Upload error: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading admin console...
      </div>
    );
  }

  return (
    <div className="section" style={{ minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-dark)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} />
              </div>
              <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
                  {t.admin.title}
                </h1>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Platform Administrator: {user?.email} · Bahir Dar Campus
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleOpenCreateCourse} className="btn btn-primary btn-sm">
                <Plus size={16} />
                <span>{t.admin.addNewCourse}</span>
              </button>
            </div>
          </div>

          {/* Stat Cards Grid */}
          <div className="dashboard-stats-grid">
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.admin.totalCourses}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats?.totalCourses || courses.length}</div>
            </div>
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t.admin.totalStudents}</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats?.totalStudents || students.length}</div>
            </div>
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {language === 'am' ? 'አጠቃላይ ሞጁሎች' : 'Total Modules'}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)' }}>{stats?.totalModules || 28}</div>
            </div>
            <div style={{ padding: '0.85rem 1rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {language === 'am' ? 'ተጠቃሚ ተማሪዎች' : 'Active Enrollments'}
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-gold)' }}>{stats?.totalEnrollments || 2}</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="tabs-scroll-container" style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => setActiveTab('courses')}
              className={`btn btn-sm ${activeTab === 'courses' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <BookOpen size={16} />
              <span>{t.admin.manageCourses} ({courses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`btn btn-sm ${activeTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Users size={16} />
              <span>{t.admin.students} ({students.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('payments');
                loadPayments();
              }}
              className={`btn btn-sm ${activeTab === 'payments' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <CreditCard size={16} />
              <span>{language === 'am' ? 'ክፍያዎችና ቴሌብር' : 'Payments & Telebirr'}</span>
              {paymentStats?.pending > 0 && (
                <span className="badge badge-gold" style={{ fontSize: '0.72rem', padding: '1px 6px', fontWeight: 800 }}>
                  {paymentStats.pending} {language === 'am' ? 'በማረጋገጥ ላይ' : 'pending'}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`btn btn-sm ${activeTab === 'upload' ? 'btn-primary' : 'btn-secondary'}`}
            >
              <Upload size={16} />
              <span>{language === 'am' ? 'ፋይሎች እና ሚዲያ' : 'Media & Files'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Course Management Table */}
        {activeTab === 'courses' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {language === 'am' ? 'የስልጠና መርሃ ግብሮች' : 'Curriculum & Tracks'}
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => setShowModuleModal(true)} className="btn btn-secondary btn-sm">
                  <FolderPlus size={15} />
                  <span>{language === 'am' ? 'ሞጁል ጨምር' : 'Add Module'}</span>
                </button>
                <button onClick={() => setShowLessonModal(true)} className="btn btn-secondary btn-sm">
                  <Video size={15} />
                  <span>{language === 'am' ? 'ትምህርት ጨምር' : 'Add Lesson'}</span>
                </button>
              </div>
            </div>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>{language === 'am' ? 'የስልጠና ርዕስ' : 'Track / Course Title'}</th>
                    <th>{language === 'am' ? 'ዘርፍ' : 'Category'}</th>
                    <th>{language === 'am' ? 'ዋጋ' : 'Tuition'}</th>
                    <th>{language === 'am' ? 'ይዘት' : 'Curriculum'}</th>
                    <th>{language === 'am' ? 'ተመዝጋቢዎች' : 'Enrollments'}</th>
                    <th>{language === 'am' ? 'ሁኔታ' : 'Status'}</th>
                    <th>{language === 'am' ? 'ተግባራት' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>{course.titleEn}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{course.titleAm}</div>
                      </td>
                      <td>
                        <span className="badge badge-gold">{course.category}</span>
                      </td>
                      <td>
                        <strong>{formatPrice(course.price)}</strong>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85rem' }}>
                          {course.modulesCount} mods · {course.lessonsCount} lessons
                        </span>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{course.enrolledCount}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleTogglePublish(course)}
                          className={`badge ${course.isPublished ? 'badge-success' : 'badge-neutral'}`}
                          style={{ cursor: 'pointer' }}
                        >
                          {course.isPublished ? t.admin.published : t.admin.draft}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.35rem' }}>
                          <button
                            onClick={() => navigate(`/courses/${course.slug}`)}
                            className="icon-btn"
                            title="Preview course"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => handleOpenEditCourse(course)}
                            className="icon-btn"
                            title="Edit course"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmCourse(course)}
                            className="icon-btn"
                            style={{ color: 'var(--color-error)' }}
                            title="Delete course"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Students List */}
        {activeTab === 'students' && (
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Enrolled Students Directory
            </h3>

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Enrolled Courses</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td style={{ fontWeight: 600 }}>
                        {student.firstName} {student.lastName}
                      </td>
                      <td>{student.email}</td>
                      <td>{student.phone || 'N/A'}</td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {student.enrollments?.map((e, idx) => (
                            <span key={idx} className="badge badge-neutral" style={{ fontSize: '0.75rem' }}>
                              {e.courseTitle}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-success">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Upload Media */}
        {activeTab === 'upload' && (
          <div className="card" style={{ padding: '2rem', maxWidth: '640px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Upload Educational Media & Files
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Upload syllabus PDFs, exercise ZIP files, or banner images. Server validates file extension, mimetype, and max 25MB size limit.
            </p>

            {uploadMessage && <Alert type="info" message={uploadMessage} />}

            <div style={{ border: '2px dashed var(--border-medium)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center', backgroundColor: 'var(--bg-subtle)' }}>
              <Upload size={36} style={{ color: 'var(--color-gold)', marginBottom: '1rem' }} />
              <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Choose an asset file to upload</div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Supported: JPEG, PNG, WebP, PDF, DOCX, PPTX, XLSX, ZIP
              </p>
              <input
                type="file"
                onChange={handleFileUpload}
                id="mediaUploadInput"
                style={{ display: 'none' }}
              />
              <label htmlFor="mediaUploadInput" className="btn btn-primary">
                Select File from Computer
              </label>
            </div>
          </div>
        )}

        {/* Tab 4: Payments & Telebirr Verification */}
        {activeTab === 'payments' && (
          <div>
            {paymentActionMessage && (
              <div style={{ marginBottom: '1.25rem' }}>
                <Alert
                  type={paymentActionMessage.type}
                  message={paymentActionMessage.text}
                  onClose={() => setPaymentActionMessage(null)}
                />
              </div>
            )}

            {/* Quick Payment Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Submissions</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{paymentStats.total}</div>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-gold)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pending Review</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-gold)' }}>{paymentStats.pending}</div>
              </div>
              <div className="card" style={{ padding: '1.25rem', borderLeft: '4px solid var(--color-success)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Approved Access</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)' }}>{paymentStats.approved}</div>
              </div>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Primary Gateway</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>Telebirr (Tizta)</div>
              </div>
            </div>

            {/* Payment Filter & Search Toolbar */}
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
                    {language === 'am' ? 'የቴሌብር ግብይት ማረጋገጫዎች' : 'Telebirr Transaction Verifications'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                    {language === 'am'
                      ? 'የቀረቡ የቴሌብር ክፍያዎችን ከስቴትመንቱ (0902 18 44 40 / 0952 58 77 50 - Tizta) ጋር በማመሳከር የስልጠናውን መዳረሻ ይፍቀዱ።'
                      : 'Verify Telebirr transactions against recipient statements (0902 18 44 40 / 0952 58 77 50 - Tizta) to grant course access.'}
                  </p>
                </div>

                <button
                  onClick={() => loadPayments(paymentFilter, paymentSearch)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <RefreshCw size={14} className={loadingPayments ? 'spin' : ''} />
                  <span>{language === 'am' ? 'አድስ' : 'Refresh'}</span>
                </button>
              </div>

              {/* Filter pills & search */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {['all', 'pending', 'approved', 'rejected'].map((statusKey) => {
                    const statusLabelsAm = {
                      all: `ሁሉም (${paymentStats.total})`,
                      pending: `በማረጋገጥ ላይ (${paymentStats.pending || 0})`,
                      approved: `የተፈቀደ (${paymentStats.approved || 0})`,
                      rejected: `ውድቅ የተደረገ (${paymentStats.rejected || 0})`,
                    };
                    return (
                      <button
                        key={statusKey}
                        onClick={() => {
                          setPaymentFilter(statusKey);
                          loadPayments(statusKey, paymentSearch);
                        }}
                        className={`btn btn-sm ${paymentFilter === statusKey ? 'btn-primary' : 'btn-ghost'}`}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {language === 'am'
                          ? statusLabelsAm[statusKey]
                          : statusKey === 'all'
                          ? `All (${paymentStats.total})`
                          : `${statusKey} (${paymentStats[statusKey] || 0})`}
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', minWidth: '240px' }}>
                  <input
                    type="text"
                    className="input"
                    placeholder={language === 'am' ? 'በመለያ ቁጥር፣ ስም ወይም ስልክ ፈልግ...' : 'Search by ref, name, phone...'}
                    value={paymentSearch}
                    onChange={(e) => {
                      setPaymentSearch(e.target.value);
                      loadPayments(paymentFilter, e.target.value);
                    }}
                    style={{ fontSize: '0.85rem', padding: '0.4rem 0.75rem' }}
                  />
                </div>
              </div>

              {/* Payments Table */}
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{language === 'am' ? 'የግብይት መለያ እና ቀን' : 'Ref ID & Date'}</th>
                      <th>{language === 'am' ? 'ተማሪ' : 'Student'}</th>
                      <th>{language === 'am' ? 'ስልጠና' : 'Course'}</th>
                      <th>{language === 'am' ? 'መጠን' : 'Amount'}</th>
                      <th>{language === 'am' ? 'የተላከበት አካውንት' : 'Recipient Account'}</th>
                      <th>{language === 'am' ? 'ሁኔታ' : 'Status'}</th>
                      <th>{language === 'am' ? 'ተግባራት' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                          {language === 'am' ? 'ምንም አይነት የተመዘገበ ክፍያ አልተገኘም።' : 'No transactions found matching criteria.'}
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment) => (
                        <tr key={payment.id} style={{ backgroundColor: payment.status === 'pending' ? 'rgba(217, 119, 6, 0.03)' : undefined }}>
                          <td>
                            <div style={{ fontWeight: 800, fontFamily: 'monospace', color: 'var(--color-gold)', letterSpacing: '0.5px' }}>
                              {payment.transaction_reference}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(payment.created_at).toLocaleDateString()} {new Date(payment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{payment.user_name || 'Student'}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{payment.user_email}</div>
                            {payment.sender_phone && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                {language === 'am' ? 'የላኪ ስልክ:' : 'Sender Tel:'} {payment.sender_phone}
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600 }}>{payment.course_title_en}</div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{payment.course_title_am}</div>
                          </td>
                          <td>
                            <strong style={{ fontSize: '1rem' }}>{formatPrice(payment.amount)}</strong>
                          </td>
                          <td>
                            <div><strong>Telebirr</strong> ({payment.telebirr_account_name || 'Tizta'})</div>
                            <div style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--color-gold)' }}>
                              {payment.recipient_phone}
                            </div>
                          </td>
                          <td>
                            {payment.status === 'pending' && (
                              <span className="badge badge-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <Clock size={12} />
                                <span>{language === 'am' ? 'በማረጋገጥ ላይ' : 'Pending'}</span>
                              </span>
                            )}
                            {payment.status === 'approved' && (
                              <span className="badge badge-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <CheckCircle2 size={12} />
                                <span>{language === 'am' ? 'የተፈቀደ' : 'Approved'}</span>
                              </span>
                            )}
                            {payment.status === 'rejected' && (
                              <span className="badge badge-danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                <XCircle size={12} />
                                <span>{language === 'am' ? 'ውድቅ የተደረገ' : 'Rejected'}</span>
                              </span>
                            )}
                          </td>
                          <td>
                            {payment.status === 'pending' && (
                              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                                <button
                                  onClick={() => handleApprovePayment(payment)}
                                  disabled={processingPaymentId === payment.id}
                                  className="btn btn-success btn-sm"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                  title={language === 'am' ? 'ክፍያውን አረጋግጥና መዳረሻ ስጥ' : 'Approve and grant course access'}
                                >
                                  <CheckCircle2 size={14} />
                                  <span>
                                    {processingPaymentId === payment.id
                                      ? (language === 'am' ? 'በማረጋገጥ ላይ...' : 'Approving...')
                                      : (language === 'am' ? 'አረጋግጥና ፍቀድ' : 'Approve')}
                                  </span>
                                </button>
                                <button
                                  onClick={() => handleOpenReject(payment)}
                                  disabled={processingPaymentId === payment.id}
                                  className="btn btn-danger btn-sm"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                  title={language === 'am' ? 'ክፍያውን ውድቅ አድርግ' : 'Reject payment'}
                                >
                                  <XCircle size={14} />
                                  <span>{language === 'am' ? 'ውድቅ አድርግ' : 'Reject'}</span>
                                </button>
                              </div>
                            )}
                            {payment.status === 'approved' && (
                              <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 600 }}>
                                ✓ {language === 'am' ? 'መዳረሻ ተፈቅዷል' : 'Access Active'}
                              </div>
                            )}
                            {payment.status === 'rejected' && (
                              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                                {payment.admin_notes || (language === 'am' ? 'ውድቅ ተደርጓል' : 'Declined')}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reject Payment Confirmation Modal */}
      <Modal
        isOpen={!!selectedRejectPayment}
        onClose={() => setSelectedRejectPayment(null)}
        title={language === 'am' ? 'የቴሌብር ክፍያን ውድቅ አድርግ' : 'Decline Telebirr Payment'}
      >
        {selectedRejectPayment && (
          <div>
            <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>
              {language === 'am' ? (
                <>
                  በ<strong>{selectedRejectPayment.user_name}</strong> ለ<strong>{selectedRejectPayment.course_title_am || selectedRejectPayment.course_title_en}</strong> የቀረበውን የቴሌብር ግብይት መለያ <strong>{selectedRejectPayment.transaction_reference}</strong> ውድቅ ማድረግ ይፈልጋሉ?
                </>
              ) : (
                <>
                  Are you sure you want to decline Telebirr transaction <strong>{selectedRejectPayment.transaction_reference}</strong> submitted by <strong>{selectedRejectPayment.user_name}</strong> for <strong>{selectedRejectPayment.course_title_en}</strong>?
                </>
              )}
            </p>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label className="form-label">
                {language === 'am' ? 'የውድቅ ምክንያት / ለአስተማሪ ወይም ለተማሪ የሚሰጥ ማስታወሻ' : 'Reason / Administrator Note for Student'}
              </label>
              <textarea
                rows={3}
                className="form-textarea"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder={
                  language === 'am'
                    ? 'ክፍያው ያልተረጋገጠበትን ምክንያት ይግለጹ (ምሳሌ፡ የተሳሳተ የግብይት ቁጥር፣ ያልተሟላ መጠን ወዘተ)...'
                    : 'Explain why the transaction could not be verified (e.g. invalid reference, incorrect amount)...'
                }
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setSelectedRejectPayment(null)}
                className="btn btn-secondary"
                disabled={processingPaymentId === selectedRejectPayment.id}
              >
                {language === 'am' ? 'ይቅር' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmReject}
                className="btn btn-danger"
                disabled={processingPaymentId === selectedRejectPayment.id}
              >
                {processingPaymentId === selectedRejectPayment.id
                  ? (language === 'am' ? 'ውድቅ በማድረግ ላይ...' : 'Declining...')
                  : (language === 'am' ? 'ውድቅ አድርግ' : 'Confirm Decline')}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Course Edit/Create Modal */}
      <Modal
        isOpen={showCourseModal}
        onClose={() => setShowCourseModal(false)}
        title={editingCourse ? 'Edit Course Track' : 'Create New Educational Track'}
      >
        <form onSubmit={handleSaveCourse}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Course Title (English) *</label>
              <input
                type="text"
                required
                value={courseFormData.titleEn}
                onChange={(e) => setCourseFormData({ ...courseFormData, titleEn: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Course Title (Amharic) *</label>
              <input
                type="text"
                required
                value={courseFormData.titleAm}
                onChange={(e) => setCourseFormData({ ...courseFormData, titleAm: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                value={courseFormData.category}
                onChange={(e) => setCourseFormData({ ...courseFormData, category: e.target.value })}
                className="form-select"
              >
                <option value="Design & Creative">Design & Creative</option>
                <option value="Media Production">Media Production</option>
                <option value="Visual Arts">Visual Arts</option>
                <option value="Business & Growth">Business & Growth</option>
                <option value="Hardware & IT">Hardware & IT</option>
                <option value="Foundations">Foundations</option>
                <option value="Emerging Tech">Emerging Tech</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Level</label>
              <select
                value={courseFormData.level}
                onChange={(e) => setCourseFormData({ ...courseFormData, level: e.target.value })}
                className="form-select"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="all_levels">All Levels</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Tuition Price (ETB)</label>
              <input
                type="number"
                value={courseFormData.price}
                onChange={(e) => setCourseFormData({ ...courseFormData, price: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Duration (Weeks)</label>
              <input
                type="number"
                value={courseFormData.durationWeeks}
                onChange={(e) => setCourseFormData({ ...courseFormData, durationWeeks: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (English)</label>
            <textarea
              rows={3}
              value={courseFormData.descriptionEn}
              onChange={(e) => setCourseFormData({ ...courseFormData, descriptionEn: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description (Amharic)</label>
            <textarea
              rows={3}
              value={courseFormData.descriptionAm}
              onChange={(e) => setCourseFormData({ ...courseFormData, descriptionAm: e.target.value })}
              className="form-textarea"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Course Track
          </button>
        </form>
      </Modal>

      {/* Delete Course Confirmation Modal */}
      <Modal
        isOpen={!!deleteConfirmCourse}
        onClose={() => setDeleteConfirmCourse(null)}
        title="Confirm Course Deletion"
      >
        <p style={{ marginBottom: '1.25rem', lineHeight: '1.6' }}>
          Are you sure you want to delete <strong>{deleteConfirmCourse?.titleEn}</strong>? This action will cascade and remove all associated modules, lessons, and enrollment records.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button onClick={() => setDeleteConfirmCourse(null)} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleDeleteCourse} className="btn btn-danger">
            Confirm & Delete
          </button>
        </div>
      </Modal>

      {/* Create Module Modal */}
      <Modal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        title="Add Curriculum Module"
      >
        <form onSubmit={handleCreateModule}>
          <div className="form-group">
            <label className="form-label">Target Course *</label>
            <select
              required
              value={moduleFormData.courseId}
              onChange={(e) => setModuleFormData({ ...moduleFormData, courseId: e.target.value })}
              className="form-select"
            >
              <option value="">-- Select Course --</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.titleEn} ({c.titleAm})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Module Title (English) *</label>
            <input
              type="text"
              required
              value={moduleFormData.titleEn}
              onChange={(e) => setModuleFormData({ ...moduleFormData, titleEn: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Module Title (Amharic) *</label>
            <input
              type="text"
              required
              value={moduleFormData.titleAm}
              onChange={(e) => setModuleFormData({ ...moduleFormData, titleAm: e.target.value })}
              className="form-input"
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Create Module
          </button>
        </form>
      </Modal>

      {/* Create Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title="Add Interactive Lesson"
      >
        <form onSubmit={handleCreateLesson}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Course *</label>
              <select
                required
                value={lessonFormData.courseId}
                onChange={(e) => setLessonFormData({ ...lessonFormData, courseId: e.target.value })}
                className="form-select"
              >
                <option value="">-- Select Course --</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.titleEn}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Module ID *</label>
              <input
                type="number"
                required
                value={lessonFormData.moduleId}
                onChange={(e) => setLessonFormData({ ...lessonFormData, moduleId: e.target.value })}
                className="form-input"
                placeholder="e.g. 1"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Lesson Title (English) *</label>
              <input
                type="text"
                required
                value={lessonFormData.titleEn}
                onChange={(e) => setLessonFormData({ ...lessonFormData, titleEn: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Lesson Title (Amharic) *</label>
              <input
                type="text"
                required
                value={lessonFormData.titleAm}
                onChange={(e) => setLessonFormData({ ...lessonFormData, titleAm: e.target.value })}
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Video Embed URL (YouTube/Vimeo)</label>
            <input
              type="url"
              value={lessonFormData.videoUrl}
              onChange={(e) => setLessonFormData({ ...lessonFormData, videoUrl: e.target.value })}
              className="form-input"
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              id="freePreviewCheck"
              checked={lessonFormData.isFreePreview}
              onChange={(e) => setLessonFormData({ ...lessonFormData, isFreePreview: e.target.checked })}
            />
            <label htmlFor="freePreviewCheck" style={{ fontSize: '0.9rem' }}>
              Allow Free Preview for non-enrolled students
            </label>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Save Lesson
          </button>
        </form>
      </Modal>
    </div>
  );
}

export default AdminDashboardPage;
