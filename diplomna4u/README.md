# Diplomna 4 U

Purpose: consulting and support site for student and academic work preparation, with services, cities, pricing calculator, legal pages, blog and contact forms.

Live site: domain is supplied by `PUBLIC_SITE_URL` (`diplomna4u.cx.ua` is evidenced in `functions/api/lead.ts`). Ukrainian-language interface. Status: static Astro site plus a Cloudflare Pages Function for lead handling. License: TODO (owner).

## Key features

- Services catalog with 6 service types and city-specific landing pages.
- Price calculator and static pricing tables from `src/data/pricing.ts`.
- Lead capture forms (`LeadForm`, `QuickOrder`, `StickyContact`) posting to `/api/lead`.
- Cloudflare Pages Function with origin checks, honeypot, time trap and optional Turnstile; Telegram notifications.
- Blog, FAQ, reviews, legal, cookie and anonymity pages.
- Locale city pages with draft/noindex logic in `src/data/cities.ts`.
- Sitemap, robots, llms files and Open Graph image generation.
- SEO checks, encoding checks and route listing through npm scripts.

## Tech stack

| Area | Technology | Notes |
| --- | --- | --- |
| Framework | Astro 7.4 | static SSG, TypeScript, Cloudflare Pages |
| Language | TypeScript/JavaScript | Node >= 22.23.4 |
| Styling | Custom CSS | `src/styles/global.css`; design tokens |
| Content | Astro content | blog posts and reviews |
| Forms/API | Cloudflare Pages Function | `functions/api/lead.ts` |
| SEO | `@astrojs/sitemap`, generated robots/llms/OG | config in `astro.config.mjs` |
| Testing | Playwright | `npm run test:e2e` |

## Quick start

```sh
npm install
npm run dev
npm run build
npm run preview
```

Dev server: `http://localhost:4321`. Production build requires `PUBLIC_SITE_URL`.

Useful commands: `npm run check:seo`, `npm run check:encoding`, `npm run routes`, `npm run generate:og`, `npm run generate:llms`, `npm run generate:robots`.

## Environment variables

Documented in `.env.example` and `.dev.vars.example`:

- Required for production: `PUBLIC_SITE_URL` (no trailing slash).
- Cloudflare Pages function: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`.
- Optional: `TURNSTILE_SECRET_KEY`, `DRY_RUN=1`.

## Project structure

```text
diplomna4u/
├── src/pages, components, layouts, data, content
├── functions/api/lead.ts   # real lead handler
├── public/                 # _headers, _redirects, _routes.json
├── scripts/                # SEO, OG, robots, llms checks
├── content? see src/content
└── astro.config.mjs
```

## Documentation

- [Features](docs/FEATURES.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Content guide](docs/CONTENT-GUIDE.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Forms](docs/FORMS.md)
- [FAQ](docs/FAQ.md)
- [SEO](docs/SEO.md)
- [SEO checklist](docs/SEO-CHECKLIST.md)
- [Ukrainian README](README.uk.md)

## Deployment

Cloudflare Pages build: `npm run build`, output `dist`, Node >= 22.23.4, env `PUBLIC_SITE_URL`. Lead function secrets are configured in the dashboard, not committed. Details: [Deployment](docs/DEPLOYMENT.md).

## Notes

Do not commit `.env` or real bot tokens. Check encoding before release: `npm run check:encoding`. License and contact owner: TODO (owner).
The repository root is `myGitHubProj/diplomna4u`; the site is in the inner `diplomna4u/` folder. Outer files are drafts/prompts and not part of the published site.