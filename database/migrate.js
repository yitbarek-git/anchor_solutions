/**
 * Database Migration Runner for Anchor Solution
 * Executes SQL migration files in order against MySQL using mysql2
 */
import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const config = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function runMigrations() {
  console.log(`[Migration] Connecting to MySQL server at ${config.host}:${config.port}...`);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[Migration] Connected to MySQL successfully.');

    const dbName = process.env.DB_NAME || 'anchor_solution_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.changeUser({ database: dbName });
    console.log(`[Migration] Using database: ${dbName}`);

    // Create schema_migrations table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      console.log('[Migration] Migrations directory not found.');
      return;
    }

    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    const [rows] = await connection.query('SELECT filename FROM schema_migrations');
    const applied = new Set(rows.map(r => r.filename));

    for (const file of files) {
      if (!applied.has(file)) {
        console.log(`[Migration] Executing: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        await connection.query(sql);
        await connection.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
        console.log(`[Migration] Successfully applied: ${file}`);
      } else {
        console.log(`[Migration] Skipping already applied: ${file}`);
      }
    }

    console.log('[Migration] All migrations completed successfully.');
  } catch (err) {
    console.error('[Migration Error]', err.message);
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();
