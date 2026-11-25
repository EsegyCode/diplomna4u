# Features (Diplomna 4 U)

Purpose: list user-facing and technical features present in the repository.

## Site and content

- Home page, service pages, city pages, pricing, FAQ, contact, reviews, about, legal, cookie and anonymity pages.
- 6 service types in `src/data/services.ts`: diploma, coursework, article, thesis, report and abstract-related service.
- 14 city entries in `src/data/cities.ts`, with readiness flag `localContentReady`.
- Blog content in `src/content/blog` and review JSON in `src/content/reviews`.
- Guarantees, stats, hero copy, navigation and legal texts as data.

## Calculator and pricing

- Price calculator in `QuickOrder` component, using serialized pricing.
- Price formula and utilities in `src/utils/price.ts`.
- Pricing plans and deadlines in `src/data/pricing.ts`.

## Forms and leads

- Three forms: `LeadForm`, `QuickOrder`, `StickyContact`.
- All post JSON/form data to `/api/lead`.
- Cloudflare Pages Function at `functions/api/lead.ts`:
  - allowed-host origin check;
  - structured field validation;
  - honeypot `website` and time trap;
  - optional Turnstile verification;
  - Telegram message sending, unless `DRY_RUN=1`.

## SEO and indexing

- `@astrojs/sitemap` with custom lastmod from git/source files.
- Generated `robots.txt`, `llms.txt`, `llms-full.txt`.
- JSON-LD through `src/components/JsonLd.astro` and `src/lib/seo.ts`.
- Global noindex set for not-ready city pages and legal pages when configured.
- Cookie consent and analytics event tracking.

## Media and tooling

- OG image generation via `scripts/generate-og.mjs`.
- Icon generation via `scripts/generate-icons.mjs`.
- Encoding and SEO check scripts.
- Playwright end-to-end tests via `npm run test:e2e`.

## Configuration touchpoints

- Astro settings and sitemap logic: `astro.config.mjs`.
- Styles and design tokens: `src/styles/global.css`.
- Service order is fixed in `src/data/services.ts`; do not reorder without permission.