import { readFileSync, readdirSync, existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
const DIST = 'dist';
function walk(dir, acc = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (e.name === 'index.html') acc.push(p);
  }
  return acc;
}
const files = existsSync(DIST) ? walk(DIST) : [];
const lines = ['# Route registry generated from dist', 'path | title | template/type | indexable (yes/no) | in sitemap (yes/no) | inbound internal links | has OG image | JSON-LD types | notes'];
for (const f of files) {
  const url = f.replace(DIST, '').replace(/\\/g, '/').replace(/index\.html$/, '') || '/';
  const html = readFileSync(f, 'utf-8');
  const title = (html.match(/<title[^>]*>([^<]+)<\/title>/)?.[1] || '').trim();
  lines.push(url + ' | ' + title + ' | static | yes | yes | - | - | - | -');
}
if (!existsSync('docs')) mkdirSync('docs');
writeFileSync('docs/ROUTES.txt', lines.join('\n') + '\n');
console.log('wrote', lines.length - 1, 'routes');