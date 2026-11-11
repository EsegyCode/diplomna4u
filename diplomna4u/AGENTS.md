# AGENTS.md

## Project summary
Astro static site for "Diplomna 4 U". Content is Ukrainian. Output is static HTML deployed on Cloudflare Pages.

## Golden rules
1. Never hard-code colors, fonts, prices, service lists, contact data or the domain. Import from tokens (`src/styles/global.css`) and `src/data/*`.
2. Do not rewrite page copy unless asked.
3. Keep Ukrainian text in UTF-8 without BOM, informal tone ("ти"), typographic apostrophe ’, « » quotes, non-breaking spaces in numbers and units. Brand name is always "Diplomna 4 U".
4. Service order is fixed in `src/data/services.ts`; do not reorder without permission.
5. Design rules: dark red fills only on buttons and cards; no red section backgrounds, header or footer; sand blocks with red text for inversions; no green/mint anywhere.
6. Do not add claims, ratings, review markup, counters or guarantees that are not already on the site.
7. Run `npm run build`, `npm run audit` and `npm run check:encoding` before finishing a task.
8. Do not implement form-to-Telegram sending in the frontend; it lives in a Cloudflare Pages Function (see DEPLOYMENT.md).

## Where things live
- Change a price: `src/data/pricing.ts`, `src/data/prices.ts`.
- Add a service: `src/data/services.ts`.
- Add a city/university: `src/data/cities.ts`.
- Add a blog post: `src/content/blog/`.
- Edit footer/menu: `src/data/navigation.ts`, `src/data/site.ts`.
- Change colors: `src/styles/global.css` (tokens).
- Regenerate OG images/favicons: `npm run generate:og`, `npm run generate:icons`.
- Edit robots/llms: `scripts/generate-robots.mjs`, `scripts/generate-llms.mjs`.

## Definition of done
- Responsive at 320, 375, 768 and 1440 px, no horizontal scroll.
- Keyboard focus visible; contrast acceptable.
- No console errors.
- Internal links valid.
## 9. Forms and Telegram
All forms use src/scripts/lead-form.ts and /api/lead. Never put secrets in client code or repo; never hard-code chat id. The function validates everything. To add a form: assign source, add label in function.
