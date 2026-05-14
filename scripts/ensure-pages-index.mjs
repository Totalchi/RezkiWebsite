import { copyFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const appHtml = join(process.cwd(), 'dist', 'app.html');
const indexHtml = join(process.cwd(), 'dist', 'index.html');

if (!existsSync(appHtml)) {
  throw new Error('Expected dist/app.html to exist after Vite build.');
}

copyFileSync(appHtml, indexHtml);
console.log('Copied dist/app.html to dist/index.html for GitHub Pages.');
