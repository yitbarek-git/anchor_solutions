import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { LanguageProvider, useLanguage } from './context/LanguageContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';

// Pages
import { HomePage } from './pages/HomePage.jsx';
import { CoursesPage } from './pages/CoursesPage.jsx';
import { CourseDetailPage } from './pages/CourseDetailPage.jsx';
import { LessonPage } from './pages/LessonPage.jsx';
import { ResourcesPage } from './pages/ResourcesPage.jsx';
import { AboutPage } from './pages/AboutPage.jsx';
import { ContactPage } from './pages/ContactPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { StudentDashboardPage } from './pages/StudentDashboardPage.jsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.jsx';
import { CheckoutPage } from './pages/CheckoutPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function AppContent() {
  const { language } = useLanguage();
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  // SEO & Title updater
  useEffect(() => {
    let title = 'Anchor Solution - Bilingual Educational Platform';
    let description = 'Anchor Solution is a bilingual educational platform offering 7 official courses with practical vocational training in Bahir Dar, Ethiopia.';
    let metaRobots = 'index, follow';

    const courseMap = {
      'graphics-design': {
        en: 'Graphics Design Course — Adobe Photoshop & Illustrator | Anchor Solution',
        am: 'ግራፊክስ ዲዛይን ስልጠና — አዶቤ ፎቶሾፕ እና ኢለስትሬተር | አንከር ሶሉሽን',
        descEn: 'Comprehensive practical training in graphic design covering Photoshop, Illustrator, InDesign, branding packages, and portfolio preparation.',
        descAm: 'በአዶቤ ፎቶሾፕ እና ኢለስትሬተር ተግባራዊ የግራፊክስ ዲዛይን ስልጠና። የብራንዲንግ፣ የሎጎ እና የህትመት ዲዛይን በባህር ዳር።',
      },
      'video-editing': {
        en: 'Video Editing Course — Premiere Pro & Motion Graphics | Anchor Solution',
        am: 'ቪዲዮ ኤዲቲንግ ስልጠና — ፕሪሚየር ፕሮ እና ሞሽን ግራፊክስ | አንከር ሶሉሽን',
        descEn: 'Master commercial video editing, color grading, sound design, and TikTok/YouTube production using Premiere Pro.',
        descAm: 'በፕሪሚየር ፕሮ ፕሮፌሽናል የቪዲዮ ኤዲቲንግ፣ ከለር ግሬዲንግ፣ የድምፅ ማስተካከያ እና የፈጠራ ስራዎች ስልጠና።',
      },
      'photography': {
        en: 'Photography Course — Commercial Studio & Lighting | Anchor Solution',
        am: 'ፎቶግራፊ ስልጠና — ስቱዲዮ እና ላይቲንግ | አንከር ሶሉሽን',
        descEn: 'Hands-on photography training covering manual camera controls, exposure triangle, studio lighting, and Lightroom retouching.',
        descAm: 'የካሜራ አጠቃቀም፣ የቀለምና ብርሃን ቅንብር፣ የክስተትና ስቱዲዮ ፎቶግራፊ እንዲሁም ላይትሩም ስልጠና።',
      },
      'digital-marketing': {
        en: 'Digital Marketing Course — Telegram Funnels & Social Ads | Anchor Solution',
        am: 'ዲጂታል ማርኬቲንግ ስልጠና — ቴሌግራም እና ሶሻል ሚዲያ | አንከር ሶሉሽን',
        descEn: 'Learn practical digital marketing, Telegram community building, Meta advertising, and e-commerce campaigns in Ethiopia.',
        descAm: 'የቴሌግራም ቻናል ማሳደግ፣ የፌስቡክና ቲክቶክ ማስታወቂያዎች፣ የኮንተንት ስትራቴጂ እና የሽያጭ ስልቶች።',
      },
      'mobile-computer-maintenance': {
        en: 'Mobile & Computer Maintenance Course — Hardware Labs | Anchor Solution',
        am: 'የስልክ እና የኮምፒውተር ጥገና ስልጠና — ሃርድዌር ላብ | አንከር ሶሉሽን',
        descEn: 'Practical electronics troubleshooting, laptop board repair, smartphone screen replacement, and OS installation.',
        descAm: 'የስልክ ስክሪን መቀየር፣ የላፕቶፕ እና ኮምፒውተር ሃርድዌር ጥገና፣ የቦርድ ፍተሻ እና ሶፍትዌር ጭነት።',
      },
      'basic-computer-skills': {
        en: 'Basic Computer Skills Course — Office & Digital Literacy | Anchor Solution',
        am: 'መሰረታዊ የኮምፒውተር እውቀት ስልጠና — ኦፊስ እና ኢንተርኔት | አንከር ሶሉሽን',
        descEn: 'Foundational computer literacy, Windows OS navigation, Word, Excel, PowerPoint, and secure email usage.',
        descAm: 'መሰረታዊ የኮምፒውተር አጠቃቀም፣ ዎርድ፣ ኤክሴል፣ ፓወርፖይንት እና ደህንነቱ የተጠበቀ የኢንተርኔት አጠቃቀም።',
      },
      'artificial-intelligence': {
        en: 'Artificial Intelligence (AI) Course — Generative Tools & Automation | Anchor Solution',
        am: 'ሰው ሰራሽ አስተውሎት (AI) ስልጠና — ተግባራዊ የAI መሳሪያዎች | አንከር ሶሉሽን',
        descEn: 'Master generative AI, prompt engineering, workplace automation tools, and creative digital workflows.',
        descAm: 'የሰው ሰራሽ አስተውሎት (AI) አጠቃቀም፣ የፕሮምፕት ኢንጂነሪንግ፣ የቢሮ ስራዎች ማቀላጠፍ እና ፈጠራ መሳሪያዎች።',
      },
    };

    if (currentPath === '/') {
      title = language === 'am'
        ? 'አንከር ሶሉሽን - ተግባራዊ የሙያ ስልጠናዎች በባህር ዳር | Anchor Solution'
        : 'Anchor Solution - High-Income Digital & Technical Skills in Bahir Dar';
      description = language === 'am'
        ? 'አንከር ሶሉሽን በባህር ዳር ከተማ ተግባራዊ የቴክኖሎጂና የዲጂታል ሙያ ስልጠናዎችን በ7 ይፋዊ የትምህርት መስኮች ይሰጣል።'
        : 'Empowering future professionals in Bahir Dar with official courses in Graphics Design, Video Editing, Photography, Marketing, Hardware, and AI.';
    } else if (currentPath.startsWith('/courses/')) {
      const parts = currentPath.split('/');
      if (parts.length >= 5 && parts[3] === 'lessons') {
        title = language === 'am' ? 'የትምህርት ገጽ - አንከር ሶሉሽን' : 'Interactive Lesson Player - Anchor Solution';
        metaRobots = 'noindex, nofollow';
      } else {
        const slug = parts[2];
        if (courseMap[slug]) {
          title = language === 'am' ? courseMap[slug].am : courseMap[slug].en;
          description = language === 'am' ? courseMap[slug].descAm : courseMap[slug].descEn;
        } else {
          title = `${slug.replace(/-/g, ' ').toUpperCase()} | Anchor Solution`;
        }
      }
    } else if (currentPath === '/courses') {
      title = language === 'am' ? 'ሰባቱ ይፋዊ ኮርሶች - አንከር ሶሉሽን' : 'The Seven Official Courses - Anchor Solution';
      description = 'Explore the 7 official vocational training tracks at Anchor Solution: Graphics Design, Video Editing, Photography, Marketing, Maintenance, Computer Basics, and AI.';
    } else if (currentPath === '/resources') {
      title = language === 'am' ? 'የትምህርት መርጃዎች እና ፋይሎች - አንከር ሶሉሽን' : 'Educational Resources & Downloads - Anchor Solution';
      description = 'Free and enrolled student resources: syllabus guides, practice templates, and cheat sheets for all 7 official courses.';
    } else if (currentPath === '/about') {
      title = language === 'am' ? 'ስለ አንከር ሶሉሽን - የባህር ዳር የሙያ ማዕከል' : 'About Anchor Solution & College Partnership';
      description = 'Discover Anchor Solution\'s mission, Bahir Dar campus facilities, and vocational training partnership with Tis Abay College.';
    } else if (currentPath === '/contact') {
      title = language === 'am' ? 'አግኙን እና ምዝገባ - አንከር ሶሉሽን' : 'Contact & Campus Admissions - Anchor Solution';
      description = 'Reach Anchor Solution in Bahir Dar Kebele 04: phone lines +251 902 18 44 40, office location, and Telegram admissions channel.';
    } else if (currentPath === '/dashboard') {
      title = language === 'am' ? 'የተማሪ ገጽ - አንከር ሶሉሽን' : 'Student Dashboard - Anchor Solution';
      metaRobots = 'noindex, nofollow';
    } else if (currentPath === '/admin') {
      title = language === 'am' ? 'የአስተዳዳሪ ገጽ - አንከር ሶሉሽን' : 'Admin Console - Anchor Solution';
      metaRobots = 'noindex, nofollow';
    }

    document.title = title;

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement('meta');
      descMeta.setAttribute('name', 'description');
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute('content', description);

    // Update og:title and og:description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    // Update robots
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.setAttribute('name', 'robots');
      document.head.appendChild(robotsMeta);
    }
    robotsMeta.setAttribute('content', metaRobots);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', window.location.origin + currentPath);
    }
  }, [currentPath, language]);

  // Route matching
  const renderRoute = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }

    if (currentPath === '/courses') {
      const urlParams = new URLSearchParams(window.location.search);
      return <CoursesPage navigate={navigate} initialSearch={urlParams.get('search') || ''} />;
    }

    // Match /courses/:slug/lessons/:lessonId
    const lessonMatch = currentPath.match(/^\/courses\/([a-zA-Z0-9_-]+)\/lessons\/([0-9]+)$/);
    if (lessonMatch) {
      return <LessonPage lessonId={lessonMatch[2]} navigate={navigate} />;
    }

    // Match /courses/:slug
    const courseMatch = currentPath.match(/^\/courses\/([a-zA-Z0-9_-]+)$/);
    if (courseMatch) {
      return <CourseDetailPage slug={courseMatch[1]} navigate={navigate} />;
    }

    // Match /checkout/:slug
    const checkoutMatch = currentPath.match(/^\/checkout\/([a-zA-Z0-9_-]+)$/);
    if (checkoutMatch) {
      return <CheckoutPage slug={checkoutMatch[1]} navigate={navigate} />;
    }

    if (currentPath === '/resources') {
      return <ResourcesPage navigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    if (currentPath === '/login') {
      return <LoginPage navigate={navigate} />;
    }

    if (currentPath === '/register') {
      return <RegisterPage navigate={navigate} />;
    }

    if (currentPath === '/dashboard') {
      return <StudentDashboardPage navigate={navigate} />;
    }

    if (currentPath === '/admin') {
      return <AdminDashboardPage navigate={navigate} />;
    }

    return <NotFoundPage navigate={navigate} />;
  };

  return (
    <MainLayout currentPath={currentPath} navigate={navigate}>
      {renderRoute()}
    </MainLayout>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
