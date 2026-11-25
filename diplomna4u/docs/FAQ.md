# Maintainer FAQ (Diplomna 4 U)

Purpose: practical maintenance answers for this Astro site.

## How do I run the site locally?

Install dependencies and run `npm run dev`. Production preview uses `npm run build` then `npm run preview`. Node must be >= 22.23.4.

## Where do prices come from?

Price tables and calculator values are in `src/data/pricing.ts` (and alias `src/data/prices.ts`). `src/utils/price.ts` holds price helpers.

## Where are service definitions?

`src/data/services.ts`. The service order is intentionally fixed. Slugs drive routes such as `/poslugy/[service]`.

## How do I add a city?

Edit `src/data/cities.ts`, including `localContentReady`. Pages with `false` receive noindex handling from `astro.config.mjs`.

## Where is blog content?

Add Markdown or MDX files under `src/content/blog/` with frontmatter fields `title`, `description`, `date` and `tags`.

## Where are reviews?

JSON files in `src/content/reviews/`. Required fields: `name`, `workType`, `text`, `date`; optional `rating`.

## How do forms work?

Forms submit to `POST /api/lead`. The Cloudflare Function validates input, checks honeypot and time trap, runs optional Turnstile, and sends a Telegram message when configured. Secrets remain server-side.

## How is SEO checked?

Run `npm run check:seo`, `npm run check:encoding` and `npm run routes`. Generated files include robots, sitemap and llms files.

## What should I check before release?

`npm run build`, `npm run check:seo`, `npm run check:encoding`, add `PUBLIC_SITE_URL`, verify 404, OG image and metadata routes.

## Common issue: lead endpoint returns configured-placeholders

If `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` are missing, the function cannot send a real message. Set them in Cloudflare and keep `DRY_RUN=1` for testing.

## Common issue: edited templates show mojibake

Keep Ukrainian text UTF-8 without BOM and run `npm run check:encoding`. Do not change copy without request.