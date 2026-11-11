// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = (process.env.PUBLIC_SITE_URL || '').trim().replace(/\/+$/, '') || 'http://localhost:4321';

const NOINDEX_PATHS = [
  '/polityka-cookie/',
  '/karta-saitu/',
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
        if (NOINDEX_PATHS.some(p => path === p)) return false;
        return true;
      },
      lastmod: new Date(),
      changefreq: 'weekly',
      priority: 0.7,
      namespaces: { xhtml: true },
    }),
  ],
});
