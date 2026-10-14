import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(rootDir, 'public');

// Ensure directories exist
const dirs = [
  path.join(publicDir, 'images', 'brand'),
  path.join(publicDir, 'images', 'courses'),
  path.join(publicDir, 'images', 'banners'),
  path.join(publicDir, 'images', 'partners'),
];

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

console.log('Public image directories verified successfully.');
