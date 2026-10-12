/**
 * Database Seed Runner for Anchor Solution
 * Populates MySQL database with initial official courses, lessons, and admin data
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
  database: process.env.DB_NAME || 'anchor_solution_db',
  multipleStatements: true,
};

async function runSeeds() {
  console.log(`[Seed] Connecting to MySQL database ${config.database}...`);
  let connection;
  try {
    connection = await mysql.createConnection(config);
    console.log('[Seed] Connected successfully.');

    const seedsDir = path.join(__dirname, 'seeds');
    if (!fs.existsSync(seedsDir)) {
      console.log('[Seed] Seeds directory not found.');
      return;
    }

    const files = fs.readdirSync(seedsDir).filter(f => f.endsWith('.sql')).sort();
    for (const file of files) {
      console.log(`[Seed] Applying seed file: ${file}`);
      const sql = fs.readFileSync(path.join(seedsDir, file), 'utf8');
      await connection.query(sql);
      console.log(`[Seed] Successfully seeded: ${file}`);
    }

    console.log('[Seed] All seeds executed successfully.');
  } catch (err) {
    console.error('[Seed Error]', err.message);
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
  }
}

runSeeds();
