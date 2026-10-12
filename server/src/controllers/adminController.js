import { AdminService } from '../services/adminService.js';

export class AdminController {
  static getOverview(req, res, next) {
    try {
      const stats = AdminService.getOverviewStats();
      res.json({ success: true, data: stats });
    } catch (err) {
      next(err);
    }
  }

  static getCourses(req, res, next) {
    try {
      const courses = AdminService.getCoursesList();
      res.json({ success: true, data: courses });
    } catch (err) {
      next(err);
    }
  }

  static createCourse(req, res, next) {
    try {
      const course = AdminService.createCourse(req.body);
      res.status(201).json({ success: true, message: 'Course created successfully.', data: course });
    } catch (err) {
      next(err);
    }
  }

  static updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const course = AdminService.updateCourse(id, req.body);
      res.json({ success: true, message: 'Course updated successfully.', data: course });
    } catch (err) {
      next(err);
    }
  }

  static deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      const result = AdminService.deleteCourse(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static createModule(req, res, next) {
    try {
      const moduleItem = AdminService.createModule(req.body);
      res.status(201).json({ success: true, message: 'Module created successfully.', data: moduleItem });
    } catch (err) {
      next(err);
    }
  }

  static createLesson(req, res, next) {
    try {
      const lesson = AdminService.createLesson(req.body);
      res.status(201).json({ success: true, message: 'Lesson created successfully.', data: lesson });
    } catch (err) {
      next(err);
    }
  }

  static deleteLesson(req, res, next) {
    try {
      const { id } = req.params;
      const result = AdminService.deleteLesson(id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  static getStudents(req, res, next) {
    try {
      const students = AdminService.getStudentsList();
      res.json({ success: true, data: students });
    } catch (err) {
      next(err);
    }
  }

  static uploadMedia(req, res, next) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
      }
      res.status(201).json({
        success: true,
        message: 'File uploaded successfully.',
        file: {
          originalName: req.file.originalname,
          filename: req.file.filename,
          size: req.file.size,
          mimetype: req.file.mimetype,
          url: `/uploads/${req.file.filename}`,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  static updateSettings(req, res, next) {
    try {
      const updated = AdminService.updateSettings(req.body);
      res.json({ success: true, message: 'Settings updated successfully.', data: updated });
    } catch (err) {
      next(err);
    }
  }
}

export default AdminController;
