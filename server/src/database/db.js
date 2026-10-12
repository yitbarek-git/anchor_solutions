import mysql from 'mysql2/promise';
import { config } from '../config/index.js';
import { officialCourses } from './coursesData.js';

let pool = null;
let isLiveMySQL = false;

// Flatten modules, lessons, and resources from officialCourses dataset
const flattenedModules = [];
const flattenedLessons = [];

officialCourses.forEach(course => {
  if (course.modules) {
    course.modules.forEach(mod => {
      flattenedModules.push({
        id: mod.id,
        course_id: mod.course_id,
        display_order: mod.display_order,
        duration_minutes: mod.duration_minutes,
        translations: mod.translations,
      });

      if (mod.lessons) {
        mod.lessons.forEach(les => {
          flattenedLessons.push({
            id: les.id,
            module_id: les.module_id,
            course_id: les.course_id,
            display_order: les.display_order,
            video_url: les.video_url,
            video_duration_seconds: les.video_duration_seconds,
            is_free_preview: les.is_free_preview,
            is_published: 1,
            translations: les.translations,
            resources: [
              {
                id: les.id * 10 + 1,
                title_en: `${course.translations.en.title} - ${les.translations.en.title} Guide (PDF)`,
                title_am: `${course.translations.am.title} - ${les.translations.am.title} መመሪያ (PDF)`,
                resource_type: 'pdf',
                file_size_formatted: '2.4 MB',
                is_premium: les.is_free_preview ? 0 : 1,
                download_url: `/api/courses/resources/${les.id * 10 + 1}/download`,
              },
              {
                id: les.id * 10 + 2,
                title_en: `${course.translations.en.title} Exercise Assets Pack (ZIP)`,
                title_am: `${course.translations.am.title} የልምምድ ፋይሎች ጥቅል (ZIP)`,
                resource_type: 'zip',
                file_size_formatted: '8.5 MB',
                is_premium: les.is_free_preview ? 0 : 1,
                download_url: `/api/courses/resources/${les.id * 10 + 2}/download`,
              },
            ],
          });
        });
      }
    });
  }
});

// Relational In-Memory Store pre-seeded with complete official 7-course curriculum
const inMemoryStore = {
  roles: [
    { id: 1, name: 'admin', description: 'Platform Administrator' },
    { id: 2, name: 'student', description: 'Enrolled Student' },
    { id: 3, name: 'instructor', description: 'Course Instructor' },
  ],
  users: [
    {
      id: 1,
      email: 'admin@anchorsolution.et',
      password_hash: '$2b$10$ItWysfz/yPfUPR/RUOeS4uCqdycfOWIC3kVFim2BTczXuNC2K/QK.',
      first_name: 'Anchor',
      last_name: 'Administrator',
      phone_number: '+251902184440',
      preferred_language: 'en',
      theme_preference: 'dark',
      is_active: 1,
      role: 'admin',
      created_at: new Date().toISOString(),
    },
    {
      id: 2,
      email: 'student@anchorsolution.et',
      password_hash: '$2b$10$0usjrjfCPG4sS1lwvnnfmel8P5tYI/F7Ts3197wJ8OKND5RG3gwFi',
      first_name: 'Abebe',
      last_name: 'Kebede',
      phone_number: '+251952587750',
      preferred_language: 'am',
      theme_preference: 'light',
      is_active: 1,
      role: 'student',
      created_at: new Date().toISOString(),
    },
  ],
  courses: officialCourses.map(c => ({
    id: c.id,
    slug: c.slug,
    category: c.category,
    level: c.level,
    duration_weeks: c.duration_weeks,
    total_hours: c.total_hours,
    banner_image: c.banner_image,
    thumbnail_image: c.thumbnail_image,
    is_published: c.is_published,
    is_featured: c.is_featured,
    display_order: c.display_order,
    instructor_name: c.instructor_name,
    partner_name: c.partner_name,
    price: c.price,
    regular_price: c.regular_price,
    difficulty: c.difficulty,
    translations: c.translations,
  })),
  modules: flattenedModules,
  lessons: flattenedLessons,
  enrollments: [
    { id: 1, user_id: 2, course_id: 1, status: 'active', enrolled_at: new Date().toISOString() },
    { id: 2, user_id: 2, course_id: 6, status: 'active', enrolled_at: new Date().toISOString() },
  ],
  lesson_progress: [
    { id: 1, user_id: 2, lesson_id: 1001, is_completed: 1, completed_at: new Date().toISOString() },
    { id: 2, user_id: 2, lesson_id: 6001, is_completed: 1, completed_at: new Date().toISOString() },
  ],
  bookmarks: [
    { id: 1, user_id: 2, lesson_id: 1001, created_at: new Date().toISOString() },
    { id: 2, user_id: 2, lesson_id: 6001, created_at: new Date().toISOString() },
  ],
  site_settings: {
    brand_name: { en: 'Anchor Solution', am: 'አንከር ሶሉሽን' },
    brand_tagline: {
      en: 'Your trusted partner for practical skills, career growth, and digital success in Bahir Dar.',
      am: 'በተግባራዊ ሙያ፣ በስራ እድል እና በዲጂታል እውቀት አስተማማኝ አጋርዎ በባህር ዳር።',
    },
    office_location: {
      en: 'Bahir Dar, Kebele 04, Meskerem/Meseret Building 4th Floor',
      am: 'ባህር ዳር ቀበሌ 04፣ መሰረት ያስከብራል ህንጻ 4ኛ ፎቅ',
    },
    phone_primary: '+251 902 18 44 40',
    phone_secondary: '+251 952 58 77 50',
    phone_tertiary: '+251 990 09 21 23',
    phone_quaternary: '+251 970 13 57 90',
    telegram_url: 'https://t.me/Anchor_Solutions',
    facebook_url: 'https://www.facebook.com/profile.php?id=61594683434691',
    tiktok_url: 'https://www.tiktok.com/@anchor_solutions1',
    partner_institution: { en: 'Tis Abay College', am: 'ቲስ አባይ ኮሌጅ' },
  },
  orders: [],
  payment_transactions: [],
  payments: [],
};

// Initialize database pool
export async function initDatabase() {
  try {
    const testPool = mysql.createPool({
      host: config.mysql.host,
      port: config.mysql.port,
      user: config.mysql.user,
      password: config.mysql.password,
      database: config.mysql.database,
      connectionLimit: config.mysql.connectionLimit,
    });
    const connection = await testPool.getConnection();
    await connection.ping();
    connection.release();
    pool = testPool;
    isLiveMySQL = true;
    console.log(`[Database] Connected successfully to MySQL database "${config.mysql.database}" on ${config.mysql.host}:${config.mysql.port}.`);
  } catch (err) {
    isLiveMySQL = false;
    console.warn(`[Database Notice] Live MySQL server is not connected (${err.code || err.message}).`);
    console.log(`[Database] Operating in Demonstration Mode with official Anchor Solution relational dataset:`);
    console.log(`[Database] - 7 Official Courses populated (Graphics Design, Video Editing, Photography, Digital Marketing, Hardware, Basic Computer, AI)`);
    console.log(`[Database] - ${inMemoryStore.modules.length} Modules & ${inMemoryStore.lessons.length} Substantive Lessons loaded with English/Amharic translations`);
    console.log(`[Database] - To connect a live MySQL instance, start mysqld on port 3306 and run "node database/migrate.js && node database/seed.js"`);
  }
}

export function isConnectedToLiveMySQL() {
  return isLiveMySQL;
}

export function getDatabasePool() {
  return pool;
}

export function getStore() {
  return inMemoryStore;
}

export default {
  initDatabase,
  isConnectedToLiveMySQL,
  getDatabasePool,
  getStore,
};
