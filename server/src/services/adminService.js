import { getStore } from '../database/db.js';

export class AdminService {
  static getOverviewStats() {
    const store = getStore();
    const totalStudents = store.users.filter(u => u.role === 'student').length;
    const totalCourses = store.courses.length;
    const publishedCourses = store.courses.filter(c => c.is_published).length;
    const totalModules = store.modules.length;
    const totalLessons = store.lessons.length;
    const totalEnrollments = store.enrollments.filter(e => e.status === 'active').length;

    return {
      totalStudents,
      totalCourses,
      publishedCourses,
      totalModules,
      totalLessons,
      totalEnrollments,
    };
  }

  static getCoursesList() {
    const store = getStore();
    return store.courses.map(course => {
      const en = course.translations.en || {};
      const am = course.translations.am || {};
      const modulesCount = store.modules.filter(m => m.course_id === course.id).length;
      const lessonsCount = store.lessons.filter(l => l.course_id === course.id).length;
      const enrolledCount = store.enrollments.filter(e => e.course_id === course.id).length;

      return {
        id: course.id,
        slug: course.slug,
        titleEn: en.title || 'Untitled',
        titleAm: am.title || 'ያልተሰየመ',
        category: course.category,
        level: course.level,
        durationWeeks: course.duration_weeks,
        totalHours: course.total_hours,
        price: course.price,
        regularPrice: course.regular_price,
        isPublished: !!course.is_published,
        isFeatured: !!course.is_featured,
        displayOrder: course.display_order,
        modulesCount,
        lessonsCount,
        enrolledCount,
      };
    });
  }

  static createCourse(data) {
    const store = getStore();
    const newId = store.courses.length > 0 ? Math.max(...store.courses.map(c => c.id)) + 1 : 1;
    const slug = data.slug || `course-${newId}-${Date.now()}`;

    const newCourse = {
      id: newId,
      slug: slug.trim().toLowerCase(),
      category: data.category || 'General',
      level: data.level || 'all_levels',
      duration_weeks: parseInt(data.durationWeeks || 4, 10),
      total_hours: parseInt(data.totalHours || 20, 10),
      banner_image: data.bannerImage || '/assets/courses/default.jpg',
      thumbnail_image: data.thumbnailImage || '/assets/courses/default.jpg',
      is_published: data.isPublished !== undefined ? (data.isPublished ? 1 : 0) : 1,
      is_featured: data.isFeatured ? 1 : 0,
      display_order: parseInt(data.displayOrder || store.courses.length + 1, 10),
      instructor_name: data.instructorName || 'Anchor Solution Instructors',
      partner_name: data.partnerName || 'Tis Abay College',
      price: parseFloat(data.price || 0),
      regular_price: parseFloat(data.regularPrice || 0),
      translations: {
        en: {
          title: data.titleEn || 'New Course',
          tagline: data.taglineEn || '',
          description: data.descriptionEn || '',
          objectives: data.objectivesEn ? (Array.isArray(data.objectivesEn) ? data.objectivesEn : data.objectivesEn.split('\n').filter(Boolean)) : [],
          target_audience: data.targetAudienceEn || '',
          prerequisites: data.prerequisitesEn || '',
        },
        am: {
          title: data.titleAm || data.titleEn || 'አዲስ ኮርስ',
          tagline: data.taglineAm || '',
          description: data.descriptionAm || '',
          objectives: data.objectivesAm ? (Array.isArray(data.objectivesAm) ? data.objectivesAm : data.objectivesAm.split('\n').filter(Boolean)) : [],
          target_audience: data.targetAudienceAm || '',
          prerequisites: data.prerequisitesAm || '',
        },
      },
    };

    store.courses.push(newCourse);
    return newCourse;
  }

  static updateCourse(courseId, data) {
    const store = getStore();
    const course = store.courses.find(c => c.id === parseInt(courseId, 10));
    if (!course) {
      const error = new Error('Course not found.');
      error.statusCode = 404;
      throw error;
    }

    if (data.slug) course.slug = data.slug.trim().toLowerCase();
    if (data.category) course.category = data.category;
    if (data.level) course.level = data.level;
    if (data.durationWeeks !== undefined) course.duration_weeks = parseInt(data.durationWeeks, 10);
    if (data.totalHours !== undefined) course.total_hours = parseInt(data.totalHours, 10);
    if (data.bannerImage) course.banner_image = data.bannerImage;
    if (data.price !== undefined) course.price = parseFloat(data.price);
    if (data.regularPrice !== undefined) course.regular_price = parseFloat(data.regularPrice);
    if (data.isPublished !== undefined) course.is_published = data.isPublished ? 1 : 0;
    if (data.isFeatured !== undefined) course.is_featured = data.isFeatured ? 1 : 0;
    if (data.displayOrder !== undefined) course.display_order = parseInt(data.displayOrder, 10);

    // Translations update
    if (data.titleEn || data.descriptionEn || data.taglineEn || data.objectivesEn) {
      course.translations.en = {
        ...course.translations.en,
        title: data.titleEn ?? course.translations.en.title,
        tagline: data.taglineEn ?? course.translations.en.tagline,
        description: data.descriptionEn ?? course.translations.en.description,
        objectives: data.objectivesEn ? (Array.isArray(data.objectivesEn) ? data.objectivesEn : data.objectivesEn.split('\n').filter(Boolean)) : course.translations.en.objectives,
      };
    }

    if (data.titleAm || data.descriptionAm || data.taglineAm || data.objectivesAm) {
      course.translations.am = {
        ...course.translations.am,
        title: data.titleAm ?? course.translations.am.title,
        tagline: data.taglineAm ?? course.translations.am.tagline,
        description: data.descriptionAm ?? course.translations.am.description,
        objectives: data.objectivesAm ? (Array.isArray(data.objectivesAm) ? data.objectivesAm : data.objectivesAm.split('\n').filter(Boolean)) : course.translations.am.objectives,
      };
    }

    return course;
  }

  static deleteCourse(courseId) {
    const store = getStore();
    const id = parseInt(courseId, 10);
    const index = store.courses.findIndex(c => c.id === id);
    if (index === -1) {
      const error = new Error('Course not found.');
      error.statusCode = 404;
      throw error;
    }

    store.courses.splice(index, 1);
    // Cascade remove modules, lessons, enrollments
    store.modules = store.modules.filter(m => m.course_id !== id);
    store.lessons = store.lessons.filter(l => l.course_id !== id);
    store.enrollments = store.enrollments.filter(e => e.course_id !== id);

    return { success: true, message: `Course #${id} deleted successfully.` };
  }

  static createModule(data) {
    const store = getStore();
    const newId = store.modules.length > 0 ? Math.max(...store.modules.map(m => m.id)) + 1 : 1;
    const newModule = {
      id: newId,
      course_id: parseInt(data.courseId, 10),
      display_order: parseInt(data.displayOrder || 1, 10),
      duration_minutes: parseInt(data.durationMinutes || 60, 10),
      translations: {
        en: { title: data.titleEn || 'New Module', description: data.descriptionEn || '' },
        am: { title: data.titleAm || data.titleEn || 'አዲስ ምዕራፍ', description: data.descriptionAm || '' },
      },
    };
    store.modules.push(newModule);
    return newModule;
  }

  static createLesson(data) {
    const store = getStore();
    const newId = store.lessons.length > 0 ? Math.max(...store.lessons.map(l => l.id)) + 1 : 1;
    const newLesson = {
      id: newId,
      module_id: parseInt(data.moduleId, 10),
      course_id: parseInt(data.courseId, 10),
      display_order: parseInt(data.displayOrder || 1, 10),
      video_url: data.videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      video_duration_seconds: parseInt(data.videoDurationSeconds || 600, 10),
      is_free_preview: data.isFreePreview ? 1 : 0,
      is_published: 1,
      translations: {
        en: {
          title: data.titleEn || 'New Lesson',
          summary: data.summaryEn || '',
          rich_content: data.richContentEn || '<p>Lesson contents...</p>',
          exercises: data.exercisesEn ? (Array.isArray(data.exercisesEn) ? data.exercisesEn : [data.exercisesEn]) : [],
        },
        am: {
          title: data.titleAm || data.titleEn || 'አዲስ ትምህርት',
          summary: data.summaryAm || '',
          rich_content: data.richContentAm || '<p>የትምህርት ይዘት...</p>',
          exercises: data.exercisesAm ? (Array.isArray(data.exercisesAm) ? data.exercisesAm : [data.exercisesAm]) : [],
        },
      },
      resources: [],
    };
    store.lessons.push(newLesson);
    return newLesson;
  }

  static deleteLesson(lessonId) {
    const store = getStore();
    const id = parseInt(lessonId, 10);
    const index = store.lessons.findIndex(l => l.id === id);
    if (index === -1) {
      const error = new Error('Lesson not found.');
      error.statusCode = 404;
      throw error;
    }
    store.lessons.splice(index, 1);
    store.lesson_progress = store.lesson_progress.filter(p => p.lesson_id !== id);
    store.bookmarks = store.bookmarks.filter(b => b.lesson_id !== id);
    return { success: true, message: `Lesson #${id} deleted successfully.` };
  }

  static getStudentsList() {
    const store = getStore();
    return store.users
      .filter(u => u.role === 'student')
      .map(u => {
        const enrollments = store.enrollments
          .filter(e => e.user_id === u.id)
          .map(e => {
            const course = store.courses.find(c => c.id === e.course_id);
            return {
              courseId: e.course_id,
              courseTitle: course?.translations.en?.title || 'Unknown',
              status: e.status,
              enrolledAt: e.enrolled_at,
            };
          });

        return {
          id: u.id,
          email: u.email,
          firstName: u.first_name,
          lastName: u.last_name,
          phone: u.phone_number,
          isActive: !!u.is_active,
          createdAt: u.created_at,
          enrollments,
        };
      });
  }

  static updateSettings(settingsData) {
    const store = getStore();
    Object.assign(store.site_settings, settingsData);
    return store.site_settings;
  }
}

export default AdminService;
