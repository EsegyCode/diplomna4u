// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO: замінити на реальний домен після деплою
const SITE = 'https://diplomna4u.cx.ua';

// Сторінки, які не індексуються (noindex) — виключаємо з sitemap
const NOINDEX_PATHS = [
  '/polityka-cookie/',
  '/karta-saitu/',
  // міста з localContentReady: false будуть додані динамічно
];

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
        // Виключаємо noindex-сторінки
        if (NOINDEX_PATHS.some(p => path === p)) return false;
        // Виключаємо draft-блог-пости (вони будуть з noindex в HTML)
        return true;
      },
    }),
  ],
});
