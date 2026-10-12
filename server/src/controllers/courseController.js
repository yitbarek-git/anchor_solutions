import { CourseService } from '../services/courseService.js';
import path from 'path';
import fs from 'fs';

export class CourseController {
  static getCourses(req, res, next) {
    try {
      const { lang = 'en', category, search, level, featured } = req.query;
      const courses = CourseService.getCourses({
        language: lang,
        category,
        search,
        level,
        featuredOnly: featured === 'true',
      });
      res.json({
        success: true,
        count: courses.length,
        data: courses,
      });
    } catch (err) {
      next(err);
    }
  }

  static getCourseBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const { lang = 'en' } = req.query;
      const userId = req.user ? req.user.id : null;
      const course = CourseService.getCourseBySlug(slug, { language: lang, userId });
      res.json({
        success: true,
        data: course,
      });
    } catch (err) {
      next(err);
    }
  }

  static getLesson(req, res, next) {
    try {
      const { id } = req.params;
      const { lang = 'en' } = req.query;
      const userId = req.user ? req.user.id : null;
      const lesson = CourseService.getLesson(id, { language: lang, userId });
      res.json({
        success: true,
        data: lesson,
      });
    } catch (err) {
      next(err);
    }
  }

  static getResources(req, res, next) {
    try {
      const { lang = 'en', search, type } = req.query;
      const resources = CourseService.getAllResources({ language: lang, search, type });
      res.json({
        success: true,
        count: resources.length,
        data: resources,
      });
    } catch (err) {
      next(err);
    }
  }

  static downloadResource(req, res, next) {
    try {
      const { id } = req.params;
      // In production, stream authorized file from disk or signed cloud storage URL
      // Provide clean text file payload or generated educational resource
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="anchor-resource-${id}.txt"`);
      res.send(`Anchor Solution Educational Platform\nResource ID: ${id}\nOfficial Course Materials & Practical Guide.\nFor full curriculum files, visit our Bahir Dar campus or contact Telegram: @Anchor_Solutions`);
    } catch (err) {
      next(err);
    }
  }
}

export default CourseController;
