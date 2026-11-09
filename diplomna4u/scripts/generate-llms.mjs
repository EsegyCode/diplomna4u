#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const publicDir = path.join(root, 'public');
const { site } = await import('../src/data/site.ts');
const { cities } = await import('../src/data/cities.ts');
const { services } = await import('../src/data/services.ts');

const BRAND = site.brandUk;
const DOMAIN = site.domain;
const lines = [];
lines.push(`# ${BRAND}`);
lines.push('');
lines.push(`> ${site.tagline}. Консультаційні послуги з підготовки студентських і наукових робіт для студентів по всій Україні. Основний сайт: ${DOMAIN}`);
lines.push('');
lines.push('## Основні сторінки');
const main = [
  ['/', 'Головна сторінка'],
  ['/poslugy/', 'Каталог послуг'],
  ['/tsiny/', 'Ціни та калькулятор'],
  ['/vidhuky/', 'Відгуки клієнтів'],
  ['/blog/', 'Блог'],
  ['/pro-nas/', 'Про нас'],
  ['/mista/', 'Сторінки по містах'],
  ['/universytety/', 'Університети'],
  ['/faq/', 'FAQ'],
  ['/kontakty/', 'Контакти'],
];
for (const [href, desc] of main) lines.push(`- [${desc}](${DOMAIN}${href}): ${desc}`);
lines.push('');
lines.push('## Послуги');
for (const s of services) lines.push(`- [${s.label}](${DOMAIN}/poslugy/${s.slug}/): ${s.h1}. Від ${s.minPrice} грн.`);
lines.push('');
lines.push('## Міста');
for (const c of cities) lines.push(`- [${c.name}](${DOMAIN}/${c.slug}/): Допомога студентам ${c.inCity}.`);
lines.push('');
lines.push('## Юридичне');
lines.push(`- [Політика конфіденційності](${DOMAIN}/polityka-konfidentsiinosti/): обробка персональних даних.`);
lines.push(`- [Публічна оферта](${DOMAIN}/publichna-oferta/): умови надання послуг.`);
lines.push(`- [Політика cookie](${DOMAIN}/polityka-cookie/): використання cookie.`);
lines.push('');
lines.push('## Документація для LLM');
lines.push(`- [llms-full.txt](${DOMAIN}/llms-full.txt): повний текст ключових сторінок.`);

fs.writeFileSync(path.join(publicDir, 'llms.txt'), lines.join('\n') + '\n');

// Full text version: concatenate service FAQ and contact details
const full = [];
full.push(`# ${BRAND} — повний контент для LLM`);
full.push('');
full.push(`Сайт: ${DOMAIN}`);
full.push(`Email: ${site.email}`);
full.push(`Telegram: ${site.telegram?.url || ''}`);
full.push('');
full.push('## Послуги');
for (const s of services) {
  full.push(`### ${s.label}`);
  full.push(s.h1);
  full.push(s.shortDesc);
  full.push(`Мінімальна ціна: ${s.minPrice} грн. Мінімальний термін: ${s.minDays ? s.minDays + ' днів' : 'узгоджується'}.`);
  for (const f of s.faq) {
    full.push(`Q: ${f.q}`);
    full.push(`A: ${f.a}`);
  }
  full.push('');
}
full.push('## Міста');
for (const c of cities) {
  full.push(`- ${c.name}: ${c.region}. Університети: ${c.universities.map(u=>u.name).join(', ')}.`);
}
full.push('');
full.push('## FAQ загальний');
// read faq data
const { faqGeneral, faqPrices } = await import('../src/data/faq.ts');
for (const f of [...faqGeneral, ...faqPrices]) {
  full.push(`Q: ${f.q}`);
  full.push(`A: ${f.a}`);
  full.push('');
}

fs.writeFileSync(path.join(publicDir, 'llms-full.txt'), full.join('\n') + '\n');
console.log('generated llms.txt and llms-full.txt');
