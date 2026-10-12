import http from 'http';
import { app } from './app.js';
import { config } from './config/index.js';
import { initDatabase } from './database/db.js';

async function startServer() {
  await initDatabase();

  const server = http.createServer(app);
  server.listen(config.port, '0.0.0.0', () => {
    console.log(`[Anchor Solution Server] REST API running on http://0.0.0.0:${config.port}`);
  });
}

startServer().catch(err => {
  console.error('[Fatal Server Startup Error]', err);
  process.exit(1);
});
