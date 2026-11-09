#!/usr/bin/env node
// scripts/check-seo.mjs
// Перевірка SEO після збірки (npm run check:seo)

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const DIST = 'dist';
let errors = 0;

function error(msg) {
  console.error(`❌ ${msg}`);
  errors++;
}

function info(msg) {
  console.log(`ℹ️  ${msg}`);
}

if (!existsSync(DIST)) {
  error(`Папка ${DIST}/ не знайдена. Виконайте npm run build спочатку.`);
  process.exit(1);
}

// Collect all index.html files
function findHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) findHtmlFiles(path, files);
    else if (entry.name === 'index.html') files.push(path);
  }
  return files;
}

const htmlFiles = findHtmlFiles(DIST);
info(`Знайдено ${htmlFiles.length} HTML файлів`);

const titles = new Map();
const descriptions = new Map();
const h1s = new Map();

for (const file of htmlFiles) {
  const content = readFileSync(file, 'utf-8');
  const url = file.replace(DIST, '').replace(/\\/g, '/').replace(/index\.html$/, '');

  // Check for unresolved template vars
  const templateVars = content.match(/\{[a-zA-Z]+\}/g);
  if (templateVars) {
    error(`Нерозкриті змінні шаблону ${templateVars.join(', ')} у ${file}`);
  }

  // Extract title
  const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/);
  const title = titleMatch?.[1]?.trim();
  if (!title) {
    error(`Відсутній <title> у ${file}`);
  } else if (title.length > 65) {
    info(`Title довший за 60 символів (${title.length}) у ${file}: "${title}"`);
  } else {
    if (titles.has(title)) {
      error(`Дубль title "${title}" у ${file} і ${titles.get(title)}`);
    }
    titles.set(title, file);
  }

  // Extract description
  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i)
    ?? content.match(/<meta\s+content="([^"]+)"\s+name="description"/i);
  const desc = descMatch?.[1]?.trim();
  if (!desc) {
    info(`Відсутній meta description у ${file}`);
  } else if (desc.length > 165) {
    info(`Description довший за 160 символів (${desc.length}) у ${file}`);
  } else {
    if (descriptions.has(desc)) {
      error(`Дубль description у ${file} і ${descriptions.get(desc)}`);
    }
    descriptions.set(desc, file);
  }

  // Extract h1
  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
  const h1 = h1Match?.[1]?.trim();
  if (!h1) {
    info(`Відсутній H1 у ${file}`);
  } else {
    if (h1s.has(h1)) {
      error(`Дубль H1 "${h1}" у ${file} і ${h1s.get(h1)}`);
    }
    h1s.set(h1, file);
  }

  // Check canonical
  const canonicalMatch = content.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
  if (!canonicalMatch) {
    error(`Відсутній canonical у ${file}`);
  }
}

// Check sitemap
const sitemapPath = join(DIST, 'sitemap-index.xml');
if (!existsSync(sitemapPath)) {
  const sitemap0 = join(DIST, 'sitemap-0.xml');
  if (!existsSync(sitemap0)) {
    error('sitemap-index.xml або sitemap-0.xml не знайдено у dist/');
  }
}

// Check robots.txt
const robotsPath = join(DIST, 'robots.txt');
if (!existsSync(robotsPath)) {
  error('robots.txt не знайдено у dist/');
} else {
  const robots = readFileSync(robotsPath, 'utf-8');
  if (robots.includes('Disallow: /\n') || robots.includes('Disallow: /\r')) {
    error('robots.txt містить Disallow: / — сайт заблокований для індексації!');
  }
  if (!robots.includes('sitemap')) {
    info('robots.txt не містить посилання на sitemap');
  }
}

console.log('');
if (errors === 0) {
  console.log('✅ check:seo пройшов без помилок!');
  process.exit(0);
} else {
  console.log(`❌ check:seo завершився з ${errors} помилками`);
  process.exit(1);
}
