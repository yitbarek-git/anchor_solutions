import { getStore } from '../database/db.js';

export class StudentService {
  static getDashboard(userId, { language = 'en' }) {
    const store = getStore();

    // Find active enrollments
    const userEnrollments = store.enrollments.filter(e => e.user_id === userId && e.status === 'active');
    const enrolledCourses = userEnrollments.map(enrollment => {
      const course = store.courses.find(c => c.id === enrollment.course_id);
      if (!course) return null;

      const trans = course.translations[language] || course.translations.en;
      const allLessons = store.lessons.filter(l => l.course_id === course.id);
      const completedCount = allLessons.filter(l =>
        store.lesson_progress.some(p => p.user_id === userId && p.lesson_id === l.id && p.is_completed)
      ).length;

      const progressPercent = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;

      return {
        id: course.id,
        slug: course.slug,
        title: trans.title,
        category: course.category,
        bannerImage: course.banner_image,
        enrolledAt: enrollment.enrolled_at,
        totalLessons: allLessons.length,
        completedLessons: completedCount,
        progressPercent,
      };
    }).filter(Boolean);

    // Bookmarked lessons
    const userBookmarks = store.bookmarks
      .filter(b => b.user_id === userId)
      .map(bookmark => {
        const lesson = store.lessons.find(l => l.id === bookmark.lesson_id);
        if (!lesson) return null;
        const course = store.courses.find(c => c.id === lesson.course_id);
        const lesTrans = lesson.translations[language] || lesson.translations.en;
        const courseTrans = course?.translations[language] || course?.translations.en;

        return {
          bookmarkId: bookmark.id,
          lessonId: lesson.id,
          title: lesTrans.title,
          summary: lesTrans.summary,
          courseId: course?.id,
          courseSlug: course?.slug,
          courseTitle: courseTrans?.title,
          bookmarkedAt: bookmark.created_at,
        };
      }).filter(Boolean);

    // Completed lessons list
    const completedLessons = store.lesson_progress
      .filter(p => p.user_id === userId && p.is_completed)
      .map(p => {
        const lesson = store.lessons.find(l => l.id === p.lesson_id);
        if (!lesson) return null;
        const course = store.courses.find(c => c.id === lesson.course_id);
        const lesTrans = lesson.translations[language] || lesson.translations.en;
        const courseTrans = course?.translations[language] || course?.translations.en;

        return {
          lessonId: lesson.id,
          title: lesTrans.title,
          courseSlug: course?.slug,
          courseTitle: courseTrans?.title,
          completedAt: p.completed_at,
        };
      }).filter(Boolean);

    return {
      enrolledCourses,
      userBookmarks,
      completedLessons,
      stats: {
        totalEnrolled: enrolledCourses.length,
        totalCompletedLessons: completedLessons.length,
        totalBookmarks: userBookmarks.length,
      },
    };
  }

  static toggleLessonCompletion(userId, lessonId) {
    const store = getStore();
    const lId = parseInt(lessonId, 10);
    const existing = store.lesson_progress.find(p => p.user_id === userId && p.lesson_id === lId);

    if (existing) {
      existing.is_completed = existing.is_completed ? 0 : 1;
      existing.completed_at = existing.is_completed ? new Date().toISOString() : null;
      return { isCompleted: !!existing.is_completed };
    } else {
      const newProgress = {
        id: store.lesson_progress.length + 1,
        user_id: userId,
        lesson_id: lId,
        is_completed: 1,
        completed_at: new Date().toISOString(),
      };
      store.lesson_progress.push(newProgress);
      return { isCompleted: true };
    }
  }

  static toggleBookmark(userId, lessonId) {
    const store = getStore();
    const lId = parseInt(lessonId, 10);
    const existingIndex = store.bookmarks.findIndex(b => b.user_id === userId && b.lesson_id === lId);

    if (existingIndex !== -1) {
      store.bookmarks.splice(existingIndex, 1);
      return { isBookmarked: false };
    } else {
      store.bookmarks.push({
        id: store.bookmarks.length + 1,
        user_id: userId,
        lesson_id: lId,
        created_at: new Date().toISOString(),
      });
      return { isBookmarked: true };
    }
  }

  static enrollInCourse(userId, courseId) {
    const store = getStore();
    const cId = parseInt(courseId, 10);
    const course = store.courses.find(c => c.id === cId);
    if (!course) {
      const error = new Error('Course not found.');
      error.statusCode = 404;
      throw error;
    }

    const existing = store.enrollments.find(e => e.user_id === userId && e.course_id === cId);
    if (existing) {
      if (existing.status !== 'active') existing.status = 'active';
      return { success: true, message: 'Already enrolled in this course.' };
    }

    store.enrollments.push({
      id: store.enrollments.length + 1,
      user_id: userId,
      course_id: cId,
      status: 'active',
      enrolled_at: new Date().toISOString(),
    });

    return { success: true, message: 'Successfully enrolled in course.' };
  }
}

export default StudentService;
