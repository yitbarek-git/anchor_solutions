import { StudentService } from '../services/studentService.js';

export class StudentController {
  static getDashboard(req, res, next) {
    try {
      const { lang = 'en' } = req.query;
      const data = StudentService.getDashboard(req.user.id, { language: lang });
      res.json({
        success: true,
        data,
      });
    } catch (err) {
      next(err);
    }
  }

  static toggleCompletion(req, res, next) {
    try {
      const { lessonId } = req.params;
      const result = StudentService.toggleLessonCompletion(req.user.id, lessonId);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static toggleBookmark(req, res, next) {
    try {
      const { lessonId } = req.params;
      const result = StudentService.toggleBookmark(req.user.id, lessonId);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  static enroll(req, res, next) {
    try {
      const { courseId } = req.body;
      if (!courseId) {
        return res.status(400).json({ success: false, message: 'Course ID is required.' });
      }
      const result = StudentService.enrollInCourse(req.user.id, courseId);
      res.json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

export default StudentController;
