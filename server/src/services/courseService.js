import { getStore } from '../database/db.js';

export class CourseService {
  static getCourses({ language = 'en', category, search, level, featuredOnly = false }) {
    const store = getStore();
    let courses = store.courses.filter(c => c.is_published);

    if (featuredOnly) {
      courses = courses.filter(c => c.is_featured);
    }

    if (category && category !== 'all') {
      courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (level && level !== 'all') {
      courses = courses.filter(c => c.level === level);
    }

    return courses.map(course => {
      const trans = course.translations[language] || course.translations.en;
      const modulesCount = store.modules.filter(m => m.course_id === course.id).length;
      const lessonsCount = store.lessons.filter(l => l.course_id === course.id).length;

      let matchesSearch = true;
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        const titleMatch = trans.title.toLowerCase().includes(query);
        const descMatch = trans.description.toLowerCase().includes(query);
        const taglineMatch = (trans.tagline || '').toLowerCase().includes(query);
        const categoryMatch = course.category.toLowerCase().includes(query);
        matchesSearch = titleMatch || descMatch || taglineMatch || categoryMatch;
      }

      if (!matchesSearch) return null;

      return {
        id: course.id,
        slug: course.slug,
        category: course.category,
        level: course.level,
        durationWeeks: course.duration_weeks,
        totalHours: course.total_hours,
        bannerImage: course.banner_image,
        thumbnailImage: course.thumbnail_image,
        displayOrder: course.display_order,
        instructorName: course.instructor_name,
        partnerName: course.partner_name,
        price: course.price,
        regularPrice: course.regular_price,
        modulesCount,
        lessonsCount,
        title: trans.title,
        tagline: trans.tagline,
        description: trans.description,
        objectives: trans.objectives,
        // Provide both titles for bilingual display/search
        titleEn: course.translations.en?.title,
        titleAm: course.translations.am?.title,
      };
    }).filter(Boolean);
  }

  static getCourseBySlug(slug, { language = 'en', userId = null }) {
    const store = getStore();
    const course = store.courses.find(c => c.slug === slug);
    if (!course) {
      const error = new Error(`Course not found with slug: ${slug}`);
      error.statusCode = 404;
      throw error;
    }

    const trans = course.translations[language] || course.translations.en;

    // Check user enrollment
    const isEnrolled = userId
      ? store.enrollments.some(e => e.user_id === userId && e.course_id === course.id && e.status === 'active')
      : false;

    // Fetch modules & lessons
    const courseModules = store.modules
      .filter(m => m.course_id === course.id)
      .sort((a, b) => a.display_order - b.display_order)
      .map(module => {
        const modTrans = module.translations[language] || module.translations.en;
        const moduleLessons = store.lessons
          .filter(l => l.module_id === module.id)
          .sort((a, b) => a.display_order - b.display_order)
          .map(lesson => {
            const lesTrans = lesson.translations[language] || lesson.translations.en;
            const isCompleted = userId
              ? store.lesson_progress.some(p => p.user_id === userId && p.lesson_id === lesson.id && p.is_completed)
              : false;
            const isBookmarked = userId
              ? store.bookmarks.some(b => b.user_id === userId && b.lesson_id === lesson.id)
              : false;

            return {
              id: lesson.id,
              displayOrder: lesson.display_order,
              videoDurationSeconds: lesson.video_duration_seconds,
              isFreePreview: !!lesson.is_free_preview,
              title: lesTrans.title,
              summary: lesTrans.summary,
              isCompleted,
              isBookmarked,
              resourcesCount: (lesson.resources || []).length,
            };
          });

        return {
          id: module.id,
          displayOrder: module.display_order,
          durationMinutes: module.duration_minutes,
          title: modTrans.title,
          description: modTrans.description,
          lessons: moduleLessons,
        };
      });

    return {
      id: course.id,
      slug: course.slug,
      category: course.category,
      level: course.level,
      durationWeeks: course.duration_weeks,
      totalHours: course.total_hours,
      bannerImage: course.banner_image,
      thumbnailImage: course.thumbnail_image,
      instructorName: course.instructor_name,
      partnerName: course.partner_name,
      price: course.price,
      regularPrice: course.regular_price,
      isEnrolled,
      title: trans.title,
      tagline: trans.tagline,
      description: trans.description,
      objectives: trans.objectives,
      targetAudience: trans.target_audience,
      prerequisites: trans.prerequisites,
      titleEn: course.translations.en?.title,
      titleAm: course.translations.am?.title,
      modules: courseModules,
    };
  }

  static getLesson(lessonId, { language = 'en', userId = null }) {
    const store = getStore();
    const lesson = store.lessons.find(l => l.id === parseInt(lessonId, 10));
    if (!lesson) {
      const error = new Error(`Lesson #${lessonId} not found.`);
      error.statusCode = 404;
      throw error;
    }

    const course = store.courses.find(c => c.id === lesson.course_id);
    const moduleItem = store.modules.find(m => m.id === lesson.module_id);

    // Check enrollment if lesson is not a free preview
    const isEnrolled = userId
      ? store.enrollments.some(e => e.user_id === userId && e.course_id === lesson.course_id && e.status === 'active')
      : false;

    const lesTrans = lesson.translations[language] || lesson.translations.en;
    const courseTrans = course?.translations[language] || course?.translations.en;
    const modTrans = moduleItem?.translations[language] || moduleItem?.translations.en;

    const isCompleted = userId
      ? store.lesson_progress.some(p => p.user_id === userId && p.lesson_id === lesson.id && p.is_completed)
      : false;
    const isBookmarked = userId
      ? store.bookmarks.some(b => b.user_id === userId && b.lesson_id === lesson.id)
      : false;

    // Navigation: previous and next lessons within the same course
    const allCourseLessons = store.lessons
      .filter(l => l.course_id === lesson.course_id)
      .sort((a, b) => a.id - b.id);
    const currentIndex = allCourseLessons.findIndex(l => l.id === lesson.id);
    const prevLesson = currentIndex > 0 ? allCourseLessons[currentIndex - 1] : null;
    const nextLesson = currentIndex < allCourseLessons.length - 1 ? allCourseLessons[currentIndex + 1] : null;

    // Filter resources: if premium and user not enrolled, mark locked
    const resources = (lesson.resources || []).map(r => ({
      id: r.id,
      title: language === 'am' ? r.title_am : r.title_en,
      resourceType: r.resource_type,
      fileSize: r.file_size_formatted,
      isPremium: r.is_premium,
      isLocked: r.is_premium && !isEnrolled,
      downloadUrl: `/api/courses/resources/${r.id}/download`,
    }));

    return {
      id: lesson.id,
      moduleId: lesson.module_id,
      courseId: lesson.course_id,
      courseSlug: course?.slug,
      courseTitle: courseTrans?.title,
      moduleTitle: modTrans?.title,
      displayOrder: lesson.display_order,
      videoUrl: lesson.video_url,
      videoDurationSeconds: lesson.video_duration_seconds,
      isFreePreview: lesson.is_free_preview,
      isEnrolled,
      title: lesTrans.title,
      summary: lesTrans.summary,
      richContent: lesTrans.rich_content,
      exercises: lesTrans.exercises || [],
      isCompleted,
      isBookmarked,
      resources,
      prevLesson: prevLesson ? { id: prevLesson.id, title: prevLesson.translations[language]?.title || prevLesson.translations.en?.title } : null,
      nextLesson: nextLesson ? { id: nextLesson.id, title: nextLesson.translations[language]?.title || nextLesson.translations.en?.title } : null,
    };
  }

  static getAllResources({ language = 'en', search = '', type = 'all' }) {
    const store = getStore();
    const allRes = [];

    store.lessons.forEach(lesson => {
      const course = store.courses.find(c => c.id === lesson.course_id);
      (lesson.resources || []).forEach(r => {
        const title = language === 'am' ? r.title_am : r.title_en;
        if (type !== 'all' && r.resource_type !== type) return;
        if (search && !title.toLowerCase().includes(search.toLowerCase())) return;

        allRes.push({
          id: r.id,
          title,
          resourceType: r.resource_type,
          fileSize: r.file_size_formatted,
          isPremium: r.is_premium,
          courseTitle: course?.translations[language]?.title || course?.translations.en?.title,
          courseSlug: course?.slug,
          lessonId: lesson.id,
          downloadUrl: `/api/courses/resources/${r.id}/download`,
        });
      });
    });

    return allRes;
  }
}

export default CourseService;
