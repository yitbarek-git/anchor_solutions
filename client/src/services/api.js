/**
 * Anchor Solution API Client
 * Centralized fetch client communicating with backend REST endpoints
 */

const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('anchor_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If body is FormData, delete Content-Type so browser sets boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || `Request failed with status ${response.status}`);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    me: () => request('/auth/me'),
    updateProfile: (profile) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profile) }),
    google: () => request('/auth/google'),
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  },
  courses: {
    getAll: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/courses${searchParams ? `?${searchParams}` : ''}`);
    },
    getBySlug: (slug, lang = 'en') => request(`/courses/${slug}?lang=${lang}`),
    getLesson: (id, lang = 'en') => request(`/courses/lessons/${id}?lang=${lang}`),
    getResources: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/courses/resources${searchParams ? `?${searchParams}` : ''}`);
    },
  },
  student: {
    getDashboard: (lang = 'en') => request(`/student/dashboard?lang=${lang}`),
    toggleComplete: (lessonId) => request(`/student/lessons/${lessonId}/toggle-complete`, { method: 'POST' }),
    toggleBookmark: (lessonId) => request(`/student/lessons/${lessonId}/toggle-bookmark`, { method: 'POST' }),
    enroll: (courseId) => request('/student/enroll', { method: 'POST', body: JSON.stringify({ courseId }) }),
  },
  admin: {
    getOverview: () => request('/admin/overview'),
    getCourses: () => request('/admin/courses'),
    createCourse: (data) => request('/admin/courses', { method: 'POST', body: JSON.stringify(data) }),
    updateCourse: (id, data) => request(`/admin/courses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCourse: (id) => request(`/admin/courses/${id}`, { method: 'DELETE' }),
    createModule: (data) => request('/admin/modules', { method: 'POST', body: JSON.stringify(data) }),
    createLesson: (data) => request('/admin/lessons', { method: 'POST', body: JSON.stringify(data) }),
    deleteLesson: (id) => request(`/admin/lessons/${id}`, { method: 'DELETE' }),
    getStudents: () => request('/admin/students'),
    updateSettings: (data) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
    uploadMedia: (formData) => request('/admin/upload', { method: 'POST', body: formData }),
    getPayments: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/admin/payments${searchParams ? `?${searchParams}` : ''}`);
    },
    approvePayment: (id, notes = '') => request(`/admin/payments/${id}/approve`, { method: 'POST', body: JSON.stringify({ notes }) }),
    rejectPayment: (id, notes = '') => request(`/admin/payments/${id}/reject`, { method: 'POST', body: JSON.stringify({ notes }) }),
  },
  payments: {
    getConfig: () => request('/payments/config'),
    getStatus: () => request('/payments/status'),
    submit: (data) => request('/payments/submit', { method: 'POST', body: JSON.stringify(data) }),
    getMyPayments: () => request('/payments/my-payments'),
    getCourseStatus: (courseId) => request(`/payments/course/${courseId}`),
    // Admin payment verification
    getAdminPayments: (params = {}) => {
      const searchParams = new URLSearchParams(params).toString();
      return request(`/payments/admin/all${searchParams ? `?${searchParams}` : ''}`);
    },
    approvePayment: (id, notes = '') => request(`/payments/admin/${id}/approve`, { method: 'POST', body: JSON.stringify({ notes }) }),
    rejectPayment: (id, notes = '') => request(`/payments/admin/${id}/reject`, { method: 'POST', body: JSON.stringify({ notes }) }),
  },
  settings: {
    getSettings: () => request('/settings'),
    getHomepage: (lang = 'en') => request(`/settings/homepage?lang=${lang}`),
  },
  ai: {
    chat: (message, conversationHistory = [], language = 'en') =>
      request('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message, conversationHistory, language }),
      }),
  },
};

export default api;
