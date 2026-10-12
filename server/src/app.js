import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { authenticate } from './middleware/auth.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import aiAssistantRoutes from './routes/aiAssistantRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

// Security and utility middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
const uploadsPath = path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadsPath));

// JWT Authentication parser on all requests
app.use(authenticate);

// SEO routes: robots.txt and sitemap.xml
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard
Disallow: /api/

Sitemap: https://ais-pre-5rhl7pxav7ln62q2nriqfs-436071125395.europe-west3.run.app/sitemap.xml
`);
});

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://ais-pre-5rhl7pxav7ln62q2nriqfs-436071125395.europe-west3.run.app';
  const urls = [
    { loc: '/', priority: '1.0', changefreq: 'weekly' },
    { loc: '/courses', priority: '0.9', changefreq: 'weekly' },
    { loc: '/courses/graphics-design', priority: '0.9', changefreq: 'monthly' },
    { loc: '/courses/video-editing', priority: '0.9', changefreq: 'monthly' },
    { loc: '/courses/photography', priority: '0.9', changefreq: 'monthly' },
    { loc: '/courses/digital-marketing', priority: '0.9', changefreq: 'monthly' },
    { loc: '/courses/mobile-computer-maintenance', priority: '0.9', changefreq: 'monthly' },
    { loc: '/courses/basic-computer-skills', priority: '0.9', changefreq: 'monthly' },
    { loc: '/courses/artificial-intelligence', priority: '0.9', changefreq: 'monthly' },
    { loc: '/resources', priority: '0.8', changefreq: 'weekly' },
    { loc: '/about', priority: '0.7', changefreq: 'monthly' },
    { loc: '/contact', priority: '0.8', changefreq: 'monthly' },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${baseUrl}${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.type('application/xml');
  res.send(xml);
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Anchor Solution API',
    version: '1.0.0',
    location: 'Bahir Dar, Ethiopia',
  });
});

// Mount modular REST routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiAssistantRoutes);

// 404 for undefined /api routes
app.use('/api/*', notFoundHandler);

// Central error handling
app.use(errorHandler);

export default app;
