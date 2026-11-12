// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE = (process.env.PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '') || 'http://localhost:4321';

const PROJECT_ROOT = process.cwd();
const BUILD_DATE = new Date();

function gitLastCommitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', file], {
      cwd: PROJECT_ROOT,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (out) return new Date(out);
  } catch {
    // ignore
  }
  return null;
}

function gitLastCommitDateAny(files) {
  let latest = null;
  for (const f of files) {
    const d = gitLastCommitDate(f);
    if (d && (!latest || d > latest)) latest = d;
  }
  return latest;
}

function filesInDir(dir) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...filesInDir(p));
    else out.push(p.replace(/\\/g, '/').replace(PROJECT_ROOT.replace(/\\/g, '/') + '/', ''));
  }
  return out;
}

function publishedBlogSlugs() {
  const dir = join(PROJECT_ROOT, 'src/content/blog');
  if (!existsSync(dir)) return [];
  const slugs = [];
  const walk = (d) => {
    for (const e of readdirSync(d, { withFileTypes: true })) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.md') || e.name.endsWith('.mdx')) {
        const raw = readFileSync(p, 'utf-8');
        const m = raw.match(/^---\n([\s\S]*?)\n---/);
        const fm = m ? m[1] : '';
        const draft = /^draft:\s*true$/m.test(fm);
        if (!draft) {
          const rel = p.replace(dir, '').replace(/\\/g, '/').replace(/^\//, '').replace(/\.(md|mdx)$/, '');
          slugs.push(rel);
        }
      }
    }
  };
  walk(dir);
  return slugs;
}

const HAS_PUBLISHED_POSTS = publishedBlogSlugs().length > 0;
const CITY_READY_SLUGS = new Set();
try {
  // lazy import cities data via eval-ish dynamic import not available sync; parse slugs from cities.ts instead
} catch {
  // ignore
}
// Read city readiness from cities.ts source text (slug lines are simple enough)
const citiesText = readFileSync(join(PROJECT_ROOT, 'src/data/cities.ts'), 'utf-8');
const cityBlockRegex = /\{\s*slug:\s*'([^']+)'\s*,[\s\S]*?localContentReady:\s*(true|false)/g;
let mCity;
while ((mCity = cityBlockRegex.exec(citiesText)) !== null) {
  if (mCity[2] === 'true') CITY_READY_SLUGS.add(mCity[1]);
}
const CITY_NOT_READY = new Set();
const citySlugRegex = /slug:\s*'([^']+)'/g;
let mSlug;
const allCitySlugs = [];
while ((mSlug = citySlugRegex.exec(citiesText)) !== null) allCitySlugs.push(mSlug[1]);
for (const s of allCitySlugs) if (!CITY_READY_SLUGS.has(s)) CITY_NOT_READY.add(s);

const NOINDEX_PATHS = new Set([
  '/dialkuye/',
]);
for (const s of CITY_NOT_READY) NOINDEX_PATHS.add(`/${s}/`);

const legalText = readFileSync(join(PROJECT_ROOT, 'src/data/legal.ts'), 'utf-8');
const legalMatch = legalText.match(/legalNoindex:\s*(true|false)/);
const legalNoindex = legalMatch ? legalMatch[1] === 'true' : true;
if (legalNoindex) {
  NOINDEX_PATHS.add('/polityka-konfidentsiinosti/');
  NOINDEX_PATHS.add('/publichna-oferta/');
}

const STATIC_SOURCE_FILES = {
  '/': ['src/pages/index.astro'],
  '/faq/': ['src/pages/faq.astro', 'src/data/faq.ts'],
  '/kontakty/': ['src/pages/kontakty.astro'],
  '/pro-nas/': ['src/pages/pro-nas.astro'],
  '/tsiny/': ['src/pages/tsiny.astro', 'src/data/pricing.ts', 'src/data/prices.ts'],
  '/vidhuky/': ['src/pages/vidhuky.astro'],
  '/mista/': ['src/pages/mista/index.astro', 'src/data/cities.ts'],
  '/karta-saitu/': ['src/pages/karta-saitu.astro'],
  '/poslugy/': ['src/pages/poslugy/index.astro', 'src/data/services.ts'],
  '/polityka-cookie/': ['src/pages/polityka-cookie.astro'],
  '/publichna-oferta/': ['src/pages/publichna-oferta.astro'],
  '/polityka-konfidentsiinosti/': ['src/pages/polityka-konfidentsiinosti.astro'],
  '/blog/': ['src/pages/blog/index.astro'],
};

function sourceFilesForPath(pathname) {
  if (STATIC_SOURCE_FILES[pathname]) return STATIC_SOURCE_FILES[pathname].map(f => f);
  if (pathname.startsWith('/poslugy/') && pathname !== '/poslugy/') {
    return ['src/pages/poslugy/[service].astro', 'src/data/services.ts'];
  }
  if (pathname.startsWith('/blog/') && pathname !== '/blog/') {
    const slug = pathname.replace(/^\/blog\//, '').replace(/\/$/, '');
    const base = `src/content/blog/${slug}`;
    const candidates = [`${base}.md`, `${base}.mdx`].filter(f => existsSync(join(PROJECT_ROOT, f)));
    if (candidates.length) return candidates.concat(['src/pages/blog/[...slug].astro']);
    return ['src/pages/blog/[...slug].astro'];
  }
  // city
  const seg = pathname.replace(/^\/|\/$/g, '');
  if (seg && !seg.includes('/') && allCitySlugs.includes(seg)) {
    return ['src/pages/[city]/index.astro', 'src/data/cities.ts'];
  }
  return [];
}

function lastmodForPath(pathname) {
  const files = sourceFilesForPath(pathname).filter(f => existsSync(join(PROJECT_ROOT, f)));
  // also handle directory-style sourcing (reviews)
  let all = files;
  if (pathname === '/vidhuky/') {
    all = all.concat(filesInDir(join(PROJECT_ROOT, 'src/content/reviews')).map(f => f));
  }
  const d = gitLastCommitDateAny(all);
  return d || BUILD_DATE;
}

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => {
        const url = new URL(page);
        const path = url.pathname;
        if (NOINDEX_PATHS.has(path)) return false;
        if (path === '/blog/' && !HAS_PUBLISHED_POSTS) return false;
        if (path === '/api/lead/' ) return false;
        return true;
      },
      namespaces: { xhtml: true },
      serialize: (item) => {
        const url = new URL(item.url);
        const pathname = url.pathname;
        if (NOINDEX_PATHS.has(pathname)) return undefined;
        if (pathname === '/blog/' && !HAS_PUBLISHED_POSTS) return undefined;
        const lastmod = lastmodForPath(pathname);
        // remove changefreq and priority
        const { changefreq, priority, ...rest } = item;
        return { ...rest, lastmod };
      },
    }),
  ],
});
