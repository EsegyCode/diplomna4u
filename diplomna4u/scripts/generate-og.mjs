#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const publicDir = path.join(root, 'public');
const ogDir = path.join(publicDir, 'og');
const source = path.join(publicDir, 'brand', 'logo.webp');

const { site } = await import('../src/data/site.ts');
const { cities } = await import('../src/data/cities.ts');
const { services } = await import('../src/data/services.ts');

const BRAND = site.brandUk || 'Diplomna 4 U';
const DOMAIN = site.domain;
const NOINDEX = new Set(['/polityka-konfidentsiinosti/']);

const logoB64 = await sharp(source).resize(96, 96, { fit: 'contain', background: '#FFFDF8' }).png().toBuffer().then((b) => b.toString('base64'));

const pages = [];
function add(urlPath, title, description) {
  if (NOINDEX.has(urlPath)) return;
  pages.push({ urlPath, title, description: description || '' });
}

add('/', BRAND, 'Головна сторінка. Допомога з дипломною, курсовою та статтею по всій Україні.');
add('/poslugy/', `Послуги | ${BRAND}`, 'Каталог послуг: дипломна, курсова, стаття, реферат, звіт з практики, теза.');
add('/tsiny/', `Ціни | ${BRAND}`, 'Калькулятор вартості та таблиця цін.');
add('/vidhuky/', `Відгуки | ${BRAND}`, 'Відгуки клієнтів.');
add('/blog/', `Блог | ${BRAND}`, 'Корисні матеріали для студентів.');
add('/pro-nas/', `Про нас | ${BRAND}`, 'Хто ми і як працюємо.');
add('/mista/', `Міста | ${BRAND}`, 'Локальні сторінки по містах України.');

add('/faq/', `FAQ | ${BRAND}`, 'Відповіді на часті запитання.');
add('/kontakty/', `Контакти | ${BRAND}`, 'Контакти та форма заявки.');
add('/polityka-konfidentsiinosti/', `Політика конфіденційності | ${BRAND}`, 'Політика конфіденційності.');
add('/publichna-oferta/', `Публічна оферта | ${BRAND}`, 'Публічна оферта (договір).');

for (const s of services) add(`/poslugy/${s.slug}/`, `${s.h1} | ${BRAND}`, s.shortDesc?.replace(/^TODO:.*$/, '') || s.label);
for (const c of cities) add(`/${c.slug}/`, `Дипломна робота ${c.inCity} | ${BRAND}`, `Допомога з дипломною та курсовою роботою ${c.inCity}. ${c.region}.`);

const blogDir = path.join(root, 'src/content/blog');
if (fs.existsSync(blogDir)) {
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) {
        const raw = fs.readFileSync(p, 'utf-8');
        const m = raw.match(/^---\n([\s\S]*?)\n---/);
        const fm = m ? m[1] : '';
        const get = (key) => {
          const r = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(fm);
          if (!r) return '';
          return r[1].trim().replace(/^['"]|['"]$/g, '');
        };
        const draft = get('draft') === 'true';
        if (draft) return;
        const title = get('title') || e.name;
        const desc = get('description') || '';
        const rel = path.relative(blogDir, p).replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');
        add(`/blog/${rel}/`, `${title} | ${BRAND}`, desc);
      }
    }
  };
  walk(blogDir);
}

if (!fs.existsSync(ogDir)) fs.mkdirSync(ogDir, { recursive: true });
for (const f of fs.readdirSync(ogDir)) {
  if (f.endsWith('.png')) fs.unlinkSync(path.join(ogDir, f));
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function wrap(text, maxChars, maxLines = 2) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= maxChars) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length === maxLines - 1) return lines.concat([cur]).slice(0, maxLines);
    }
  }
  if (cur && lines.length < maxLines) lines.push(cur);
  if (lines.length === 0) lines.push('');
  return lines;
}

async function gen(urlPath, title, description, outFile) {
  const titleLines = wrap(title, 30, 2);
  const descLines = wrap(description, 62, 2);
  const titleTspans = titleLines.map((l, i) => `<tspan x="196" dy="${i === 0 ? 0 : '1.15em'}">${esc(l)}</tspan>`).join('');
  const descTspans = descLines.map((l, i) => `<tspan x="72" dy="${i === 0 ? 0 : '1.25em'}">${esc(l)}</tspan>`).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#FFFDF8"/>
  <image x="72" y="72" width="96" height="96" href="data:image/png;base64,${logoB64}" />
  <text x="196" y="150" font-family="Onest, system-ui, sans-serif" font-size="52" font-weight="700" fill="#5D0D18">${titleTspans}</text>
  <text x="72" y="400" font-family="Onest, system-ui, sans-serif" font-size="26" font-weight="400" fill="#2B1A1D">${descTspans}</text>
  <text x="72" y="560" font-family="Onest, system-ui, sans-serif" font-size="22" font-weight="500" fill="#6B5A5D">${esc(DOMAIN.replace('https://', ''))}</text>
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(ogDir, outFile));
}

function slugify(urlPath) {
  if (urlPath === '/') return 'index';
  return urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

await gen('/', 'Diplomna 4 U', 'Допомога з дипломною, курсовою та статтею по всій Україні.', 'og-default.png');
console.log('generated og/og-default.png');

for (const p of pages) {
  await gen(p.urlPath, p.title, p.description, slugify(p.urlPath) + '.png');
  console.log('generated og/' + slugify(p.urlPath) + '.png');
}

console.log(`Total OG images: ${pages.length + 1}`);
