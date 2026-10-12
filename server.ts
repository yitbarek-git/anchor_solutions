import http from 'http';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { app } from './server/src/app.js';
import { initDatabase } from './server/src/database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);

async function start() {
  await initDatabase();

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = http.createServer(app);
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[Anchor Solution] Fullstack server active on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('[Startup Error]', err);
  process.exit(1);
});
