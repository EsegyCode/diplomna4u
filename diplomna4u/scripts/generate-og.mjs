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
const { legalMeta } = await import('../src/data/legal.ts');

const BRAND = site.brand || 'Diplomna 4 U';
const BRAND_UK = site.brandUk || 'Дипломна 4 U';
const DOMAIN = site.domain || 'https://diplomna4u.cx.ua';
const DISPLAY_DOMAIN = DOMAIN.includes('localhost')
  ? 'diplomna4u.cx.ua'
  : DOMAIN.replace(/^https?:\/\//, '').replace(/\/+$/, '');

const NOINDEX = new Set(
  legalMeta?.legalNoindex
    ? ['/polityka-konfidentsiinosti/', '/publichna-oferta/']
    : [],
);

const logoB64 = await sharp(source)
  .resize(192, 192, { fit: 'contain', background: { r: 249, g: 238, b: 219, alpha: 0 } })
  .png()
  .toBuffer()
  .then((b) => b.toString('base64'));

const pages = [];
function add(urlPath, title, description, badge = 'DIPLOMNA 4 U', highlight = '') {
  if (NOINDEX.has(urlPath)) return;
  pages.push({ urlPath, title, description: description || '', badge, highlight });
}

add(
  '/',
  'Дипломна робота для тебе',
  'Дипломні, курсові, статті, реферати та звіти з практики по всій Україні. Від 3 днів, унікальність 85–90%.',
  'ДИПЛОМНА 4 U',
  'від 14 800 грн',
);
add(
  '/poslugy/',
  'Послуги та види робіт',
  'Дипломна, курсова, стаття, реферат, звіт з практики, теза — повний цикл підготовки з безкоштовними правками.',
  'ПОСЛУГИ',
  '6 напрямків',
);
add(
  '/tsiny/',
  'Ціни та калькулятор',
  'Онлайн-калькулятор вартості та прозорий прайс на всі види студентських робіт. Оплата 50/50.',
  'ЦІНИ',
  'Оплата 50% + 50%',
);
add(
  '/vidhuky/',
  'Відгуки студентів',
  'Реальні відгуки клієнтів про якість робіт, терміни виконання та супровід до захисту.',
  'ВІДГУКИ',
  'Перевірені кейси',
);
add(
  '/blog/',
  'Блог для студентів',
  'Практичні поради щодо написання дипломних і курсових, оформлення за ДСТУ та підготовки до захисту.',
  'БЛОГ',
  'Корисні матеріали',
);
add(
  '/pro-nas/',
  'Про нас',
  'Хто ми, як працюємо з 2019 року, гарантії унікальності 85–90% та офіційний супровід.',
  'ПРО НАС',
  'З 2019 року',
);
add(
  '/mista/',
  'Міста України',
  'Працюємо дистанційно по всій Україні: Київ, Львів, Харків, Дніпро, Одеса, Суми та інші міста.',
  'ГЕОГРАФІЯ',
  'Вся Україна',
);
add(
  '/faq/',
  'Часті запитання (FAQ)',
  'Відповіді на популярні питання про терміни, вартість, унікальність, правки та конфіденційність.',
  'FAQ',
  'Відповіді на все',
);
add(
  '/kontakty/',
  'Контакти та заявка',
  'Зв’яжись у Telegram або залиш заявку на сайті — безкоштовна консультація щодня з 9:00 до 21:00.',
  'КОНТАКТИ',
  'Щодня 9:00–21:00',
);
add(
  '/karta-saitu/',
  'Карта сайту',
  'Усі розділи, послуги, міста України та корисні сторінки Diplomna 4 U в одному місці.',
  'НАВІГАЦІЯ',
  'Усі сторінки',
);
add(
  '/polityka-konfidentsiinosti/',
  'Політика конфіденційності',
  'Які дані збирає Diplomna 4 U, як ми їх захищаємо та як керувати своїми персональними даними.',
  'ДОКУМЕНТИ',
  'Конфіденційність',
);
add(
  '/publichna-oferta/',
  'Публічна оферта (договір)',
  'Офіційні умови надання послуг, порядок оплати 50/50, терміни виконання та гарантії правок.',
  'ДОКУМЕНТИ',
  'Договір оферти',
);
add(
  '/polityka-cookie/',
  'Політика cookie',
  'Які файли cookie використовує сайт Diplomna 4 U та як у будь-який момент змінити свою згоду.',
  'ДОКУМЕНТИ',
  'Налаштування cookie',
);

for (const s of services) {
  const cleanDesc = (s.shortDesc || s.label).replace(/^TODO:.*$/, '').trim();
  const minPrice = s.minPrice ? `від ${s.minPrice.toLocaleString('uk-UA')} грн` : '';
  add(`/poslugy/${s.slug}/`, s.h1 || s.label, cleanDesc, 'ПОСЛУГИ', minPrice);
}

for (const c of cities) {
  add(
    `/${c.slug}/`,
    `Дипломна робота ${c.inCity}`,
    `Допомога з дипломною та курсовою роботою ${c.inCity}. ${c.region}. Дистанційно, від 3 днів.`,
    'МІСТА УКРАЇНИ',
    c.name,
  );
}

const blogDir = path.join(root, 'src/content/blog');
if (fs.existsSync(blogDir)) {
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) {
        const raw = fs.readFileSync(p, 'utf-8');
        const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        const fm = m ? m[1] : '';
        const get = (key) => {
          const r = new RegExp(`^${key}:\\s*(.+)$`, 'm').exec(fm);
          if (!r) return '';
          return r[1].trim().replace(/^['"]|['"]$/g, '');
        };
        if (get('draft') === 'true') return;
        const title = get('title') || e.name;
        const desc = get('description') || '';
        const rel = path.relative(blogDir, p).replace(/\\/g, '/').replace(/\.(md|mdx)$/, '');
        add(`/blog/${rel}/`, title, desc, 'БЛОГ', 'Стаття');
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
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getTitleFontSize(title) {
  const len = title.length;
  if (len <= 20) return { fontSize: 52, maxChars: 17, lineHeight: 62, maxLines: 2 };
  if (len <= 34) return { fontSize: 44, maxChars: 20, lineHeight: 54, maxLines: 3 };
  if (len <= 52) return { fontSize: 38, maxChars: 24, lineHeight: 46, maxLines: 3 };
  return { fontSize: 33, maxChars: 28, lineHeight: 40, maxLines: 4 };
}

function wrap(text, maxChars, maxLines = 3) {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [''];
  const lines = [];
  let cur = '';

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length <= maxChars) {
      cur = candidate;
    } else {
      if (cur) {
        if (lines.length === maxLines - 1) {
          lines.push(cur.replace(/[.,;:—-]+$/, '') + '…');
          return lines;
        }
        lines.push(cur);
        cur = w;
      } else {
        lines.push(w.slice(0, maxChars - 1) + '…');
        if (lines.length === maxLines) return lines;
        cur = '';
      }
    }
  }
  if (cur) {
    if (lines.length < maxLines) lines.push(cur);
    else lines[maxLines - 1] = lines[maxLines - 1].replace(/[.,;:—-]+$/, '') + '…';
  }
  return lines.slice(0, maxLines);
}

async function gen(title, description, badge, highlight, outFile) {
  const cleanTitle = String(title).replace(/\s*\|\s*(Diplomna 4 U|Дипломна 4 U)\s*$/i, '').trim();
  const { fontSize, maxChars, lineHeight, maxLines } = getTitleFontSize(cleanTitle);
  const titleLines = wrap(cleanTitle, maxChars, maxLines);
  const descLines = wrap(description, 44, 3);

  const titleStartY = 172;
  const titleBlockHeight = titleLines.length * lineHeight;
  const descStartY = Math.max(titleStartY + titleBlockHeight + 24, 320);

  const titleTspans = titleLines
    .map((l, i) => `<tspan x="56" y="${titleStartY + i * lineHeight}">${esc(l)}</tspan>`)
    .join('');

  const descTspans = descLines
    .map((l, i) => `<tspan x="56" y="${descStartY + i * 32}">${esc(l)}</tspan>`)
    .join('');

  const badgeWidth = Math.max(110, badge.length * 10 + 36);
  const highlightBadge = highlight
    ? `<rect x="740" y="454" width="320" height="52" rx="26" fill="#AD1312"/>
       <text x="900" y="487" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="21" font-weight="700" fill="#FFFBF3">${esc(highlight)}</text>`
    : '';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFFBF3"/>
      <stop offset="100%" stop-color="#FBF3E4"/>
    </linearGradient>
    <linearGradient id="cardGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#F9EEDB"/>
      <stop offset="100%" stop-color="#F3E4C8"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect x="0" y="0" width="1200" height="8" fill="#AD1312"/>

  <!-- Left column (630px: x=0..630, content x=56..584) -->
  <rect x="56" y="58" width="${badgeWidth}" height="36" rx="18" fill="#F9EEDB" stroke="#EBD6AE" stroke-width="1.5"/>
  <text x="${56 + badgeWidth / 2}" y="82" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="1.2" fill="#AD1312">${esc(badge)}</text>

  <text font-family="Georgia, 'Times New Roman', serif" font-size="${fontSize}" font-weight="700" fill="#2A1513">${titleTspans}</text>

  <text font-family="'Segoe UI', Arial, sans-serif" font-size="22" font-weight="400" fill="#5E4C49">${descTspans}</text>

  <!-- Left column footer caption within 1200x630 -->
  <line x1="56" y1="536" x2="584" y2="536" stroke="#EBD6AE" stroke-width="1.5"/>
  <circle cx="64" cy="568" r="5" fill="#AD1312"/>
  <text x="80" y="575" font-family="'Segoe UI', Arial, sans-serif" font-size="19" font-weight="600" fill="#5E4C49">${esc(BRAND_UK)} • ${esc(DISPLAY_DOMAIN)}</text>

  <!-- Right column (570px: x=630..1200) -->
  <rect x="654" y="48" width="492" height="534" rx="28" fill="url(#cardGrad)" stroke="#EBD6AE" stroke-width="2"/>
  <circle cx="1090" cy="108" r="76" fill="#EBD6AE" opacity="0.35"/>
  <circle cx="716" cy="520" r="64" fill="#EBD6AE" opacity="0.3"/>

  <!-- Logo frame -->
  <rect x="794" y="114" width="212" height="212" rx="32" fill="#FAF9F2" stroke="#EBD6AE" stroke-width="2"/>
  <image x="804" y="124" width="192" height="192" href="data:image/png;base64,${logoB64}"/>

  <!-- Brand title in right card -->
  <text x="900" y="384" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="36" font-weight="700" fill="#7A0C0B">${esc(BRAND)}</text>
  <text x="900" y="420" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="18" font-weight="500" fill="#5E4C49">Дипломні та курсові на замовлення</text>

  ${highlightBadge}
</svg>`;

  await sharp(Buffer.from(svg)).png().toFile(path.join(ogDir, outFile));
}

function slugify(urlPath) {
  if (urlPath === '/') return 'index';
  return urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-');
}

await gen(
  'Дипломна робота для тебе',
  'Допомога з дипломною, курсовою та статтею по всій Україні. Від 3 днів, унікальність 85–90%.',
  'DIPLOMNA 4 U',
  'Офіційно • 50/50',
  'og-default.png',
);
console.log('generated og/og-default.png');

for (const p of pages) {
  const file = slugify(p.urlPath) + '.png';
  await gen(p.title, p.description, p.badge, p.highlight, file);
  console.log('generated og/' + file);
}

console.log(`Total OG images: ${pages.length + 1}`);
