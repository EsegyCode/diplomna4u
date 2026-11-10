# Diplomna 4 U: Design System and Redesign Prompt

> Paste this whole file to your AI coding agent. It defines the visual system once, so it can be applied to the home page now and to every other page later (services, prices, reviews, FAQ, blog, city pages, legal pages) with the same result.

---

## 0. Role and goal

You are a senior product designer and front-end engineer. Redesign the existing Astro website (localhost:4321, Ukrainian-language, `lang="uk"`) into a refined, trustworthy, academic-but-modern service site.

- Keep all existing content, routes, copy, and functionality unless this document says otherwise.
- Keep the existing brand palette. **Do not invent new hues.** Create variety through *inversions, tints, and layering of the same palette*.
- Build it as a **reusable design system** (CSS variables, a few section "themes", and component variants), so that any new page can be assembled from the same parts and look consistent.
- Work in this order: (1) tokens, (2) base styles, (3) section themes, (4) components, (5) apply to the home page, (6) apply to all other pages, (7) QA.

Brand personality: **academic, calm, reliable, warm.** Think a university press meets a modern fintech: serif headlines, generous whitespace, soft rounded shapes, confident burgundy, quiet sage.

---

## 1. Brand palette (source of truth)

These already exist as CSS variables in `:root`. Keep the names; add the new ones.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#FFFDF8` | Page background (warm off-white) |
| `--surface` | `#FFF9EB` | Cream surface, cards on white, calculator text on dark |
| `--cream-2` | `#FFF6E5` | Slightly deeper cream for alternating sections (new) |
| `--tint` | `#E6EDEA` | Very light sage tint, borders, subtle fills |
| `--sage` | `#9FB2AC` | Brand sage: **inverted blocks, badges, icons, chat button** |
| `--sage-hover` | `#8CA39C` | Sage hover/pressed |
| `--sage-deep` | `#6F8780` | Darker sage for sage-on-cream lines/icons only, not for text (new) |
| `--deep` | `#5D0D18` | Brand burgundy: text on sage, dark sections, primary buttons |
| `--deep-hover` | `#7A1626` | Burgundy hover |
| `--deep-2` | `#4A0A13` | Darker burgundy for footer bottom bar / pressed states (new) |
| `--accent-tint` | `#F6E7E9` | Pale rose tint for soft burgundy badges/highlights |
| `--ink` | `#2B1A1D` | Main text on light backgrounds |
| `--muted` | `#6B5A5D` | Secondary text on light backgrounds **only** |
| `--card` | `#FFFFFF` | Card background |
| `--border` | `#E6EDEA` | Default border |
| `--error` | `#D92D20` | Errors only |

Radii and sizing (keep): `--r-btn: 999px`, `--r-card: 24px`, `--r-input: 14px`, `--container: 1200px`, `--tap-min: 48px`.
Add: `--r-sm: 10px`, `--r-md: 16px`, `--r-lg: 32px`.

### Contrast rules (verified, must be respected)

- `--deep` text on `--sage` background: about 6.1:1. **Passes AA.** This is the signature inversion.
- `--sage` text on `--deep` background: about 6.1:1. Passes AA, fine for headings, icons, and large text; for small body text on deep use `--surface` instead.
- `--surface` text on `--deep`: very high contrast, the default for dark sections.
- `--ink` on `--bg`/`--surface`/`--card`: very high.
- **Never** use `--muted` or `--sage` as text on `--sage`. On sage backgrounds, secondary text is `--deep` at 80% opacity (`color-mix(in srgb, var(--deep) 80%, transparent)`).
- **Never** put white or cream text on sage.
- Never use pure black or pure white text; use `--ink` and `--surface`.

---

## 2. Typography

Fonts (already set): **Playfair Display** for headings and big numbers, **Inter** for everything else. Cyrillic subset required. Keep `font-family: inherit` on form controls.

```css
--font-heading: 'Playfair Display', Georgia, serif;
--font-body: 'Inter', system-ui, sans-serif;
```

Fluid scale (use `clamp`):

| Token | Value | Use |
|---|---|---|
| `--fs-display` | `clamp(2.5rem, 5.5vw, 4.25rem)` | Hero H1 only. `line-height: 1.05`, weight 700, `letter-spacing: -0.01em` |
| `--fs-h2` | `clamp(1.875rem, 3.6vw, 2.75rem)` | Section titles. `line-height: 1.12`, weight 700 |
| `--fs-h3` | `clamp(1.375rem, 2.2vw, 1.75rem)` | Card titles. `line-height: 1.2`, weight 600 |
| `--fs-lead` | `clamp(1.0625rem, 1.5vw, 1.25rem)` | Intro paragraphs. `line-height: 1.6` |
| `--fs-body` | `1rem` | Body. `line-height: 1.65` |
| `--fs-small` | `0.875rem` | Captions, meta |
| `--fs-eyebrow` | `0.75rem` | Eyebrow labels, Inter 600, uppercase, `letter-spacing: 0.12em` |

Rules:
- Max line length for paragraphs: `62ch`.
- Hero H1 on the home page is currently too heavy; use `--fs-display` and keep the key phrase on max 2 lines at 1440px.
- Playfair numerals: always `font-variant-numeric: lining-nums;` for prices and counters.
- Use typographic apostrophe `’` (U+2019) and `—` with non-breaking spaces before dashes where natural. Non-breaking space (`&nbsp;`) between number and unit ("15&nbsp;000&nbsp;грн", "60&nbsp;стор.").
- Do not use bold 700 for UI labels; Inter 500/600 only.

---

## 3. Spacing, layout, and rhythm

- Container: `max-width: var(--container)`; side padding `clamp(20px, 4vw, 40px)`.
- 8px base spacing scale: `--s-1: 4px, --s-2: 8px, --s-3: 12px, --s-4: 16px, --s-5: 24px, --s-6: 32px, --s-7: 48px, --s-8: 64px, --s-9: 96px`.
- Section vertical padding: `clamp(56px, 8vw, 104px)`.
- Grid: 12 columns on desktop (gap 24px), 6 on tablet, 4 on mobile. Cards in grids use `repeat(auto-fit, minmax(280px, 1fr))`.
- Section title block: eyebrow (optional) → H2 → short accent line → lead paragraph. Left aligned by default; centered only for Reviews, CTA, and the contact form.
- Accent line under H2: `56px × 3px`, `border-radius: 999px`, color depends on section theme (see below). Always short, always straight, never overlapping other lines.

---

## 4. Section themes (the core of the system)

Every page is a vertical stack of `<section data-theme="...">`. Colors come from CSS variables overridden per theme, so any component placed inside a section automatically adapts. **Build this first.**

```css
[data-theme="light"]   { --s-bg: var(--bg);       --s-fg: var(--ink);     --s-muted: var(--muted);                     --s-accent: var(--deep);    --s-line: var(--sage);     --s-card: var(--card);     --s-card-fg: var(--ink);     --s-border: var(--border); }
[data-theme="cream"]   { --s-bg: var(--cream-2);  --s-fg: var(--ink);     --s-muted: var(--muted);                     --s-accent: var(--deep);    --s-line: var(--sage);     --s-card: var(--card);     --s-card-fg: var(--ink);     --s-border: var(--border); }
[data-theme="sage"]    { --s-bg: var(--sage);     --s-fg: var(--deep);    --s-muted: color-mix(in srgb, var(--deep) 80%, transparent); --s-accent: var(--deep);    --s-line: var(--deep);     --s-card: var(--bg);       --s-card-fg: var(--ink);     --s-border: color-mix(in srgb, var(--deep) 25%, transparent); }
[data-theme="deep"]    { --s-bg: var(--deep);     --s-fg: var(--surface); --s-muted: color-mix(in srgb, var(--surface) 78%, transparent); --s-accent: var(--sage); --s-line: var(--sage); --s-card: color-mix(in srgb, var(--surface) 8%, transparent); --s-card-fg: var(--surface); --s-border: color-mix(in srgb, var(--surface) 22%, transparent); }
[data-theme="tint"]    { --s-bg: var(--tint);     --s-fg: var(--ink);     --s-muted: var(--muted);                     --s-accent: var(--deep);    --s-line: var(--deep);     --s-card: var(--card);     --s-card-fg: var(--ink);     --s-border: color-mix(in srgb, var(--sage) 45%, transparent); }
section[data-theme] { background: var(--s-bg); color: var(--s-fg); }
```

### The 30% inversion rule

- Across any page, about **30% of the content blocks must be inverted**: approximately **one third sage blocks (burgundy text)**, and the dark burgundy sections remain separate accents.
- Target distribution per page: **light/cream ≈ 45%**, **sage (inverted) ≈ 30%**, **deep burgundy ≈ 20%**, **tint ≈ 5%**.
- "Blocks" means both full-width sections and in-section cards/panels. Inversion can happen at section level (a full sage band) **or** card level (a sage card inside a light section). Mix both so it feels deliberate, not striped.
- Never place two sage sections or two deep sections back to back. Never put sage directly against deep without a light buffer or a 1px `--surface` divider.
- The hero stays light (cream) so the burgundy calculator card pops. The footer is deep.
- All text on sage blocks is burgundy (`--deep`): headings, body, links, icons, and outlined buttons. This is the signature look the owner requested ("sage block with red font").

### Recommended section sequence for the home page

| # | Section | Theme | Notes |
|---|---|---|---|
| 1 | Header | `light` (translucent, blurred) | Sticky, 1px bottom border `--s-border` |
| 2 | Hero + calculator | `light` | Calculator card is `deep` (kept) |
| 3 | Benefits chips band ("Мінімальний термін…") | `sage` | **Inverted**: chips become burgundy-outlined on sage (see components) |
| 4 | Services (6 cards) | `cream` | Cards white; 1 featured card (Дипломна робота) inverted burgundy, 1 inverted sage for variety |
| 5 | How we work (4 steps) | `deep` | Already deep; keep, fix connector line |
| 6 | Prices table | `light` | Table header deep; optional sage highlighted row |
| 7 | Reviews | `sage` | **Inverted** with white-cream review cards and burgundy text |
| 8 | FAQ | `cream` | Accordion with sage accents |
| 9 | Cities / universities | `tint` | Quiet, small |
| 10 | Contact form "Готовий почати?" | `light` with a form card | Optional: form card on `sage` panel on desktop |
| 11 | Footer | `deep` | Bottom bar `--deep-2` |

This gives roughly: light/cream 5 blocks, sage 2 full bands plus 2 inverted cards, deep 3 (calculator, steps, footer). Adjust so the 30% inversion holds by area, not just count.

### Section transitions

- Use hard edges between themes by default (clean, editorial).
- Optional: a subtle 24px `border-radius` on the top corners of a section when it overlaps the previous one (`margin-top: -24px; border-radius: var(--r-card) var(--r-card) 0 0`) for deep and sage bands. Use consistently or not at all.

---

## 5. Component library (with variants)

All components read `--s-*` variables, so they auto-adapt to the section theme. Provide each as a class with modifiers, documented in a single `/styleguide` page (see Section 8).

### 5.1 Buttons

Base: pill (`--r-btn`), min-height 48px, padding `0 28px`, Inter 600 15px, `transition: 150ms ease`, focus-visible outline `2px` offset `3px` in `--s-accent`. Arrow icons never wrap (`white-space: nowrap`, inline-flex, gap 8px). Hover: translateY(-1px) and shadow; active: translateY(0).

| Variant | On light/cream | On sage | On deep |
|---|---|---|---|
| **Primary** | bg `--deep`, text `--surface`, hover `--deep-hover` | bg `--deep`, text `--surface` | bg `--surface`, text `--deep`, hover `#FFFFFF` |
| **Secondary (outline)** | 1.5px `--deep` border, text `--deep`, hover fill `--accent-tint` | 1.5px `--deep` border, text `--deep`, hover fill `--deep`/text `--surface` | 1.5px `--surface` border, text `--surface`, hover fill `--surface`/text `--deep` |
| **Soft** | bg `--tint`, text `--deep` | bg `--bg`, text `--deep` | bg `color-mix(--surface 12%)`, text `--surface` |
| **Ghost link** | text `--deep`, underline offset 4px, arrow slides 3px on hover | same | text `--surface` |

Sizes: `sm` (40px, 14px text), `md` (48px, default), `lg` (56px, 16px text). Icon-only round button: 48×48.
Disabled: opacity 0.5, `cursor: not-allowed`, no hover effect.

### 5.2 Badges and pills

| Variant | Look |
|---|---|
| `badge--sage` | bg `--sage`, text `--deep`, Inter 600 13px, padding 6px 14px, radius 999px |
| `badge--deep` | bg `--deep`, text `--surface` |
| `badge--tint` | bg `--tint`, text `--deep` |
| `badge--rose` | bg `--accent-tint`, text `--deep` |
| `badge--outline` | transparent, 1px `currentColor` border at 40% opacity |
| `badge--price` | bg `--tint`, text `--deep`, Inter 600, with `font-variant-numeric: lining-nums` (used on service cards: "від 15 000 грн") |

Optional leading dot (6px circle) or check icon (16px). On sage sections, use `badge--deep`/`badge--outline`; on deep sections, use `badge--sage`/`badge--outline`.

### 5.3 Benefit chips (the "Мінімальний термін…" block)

Currently centered pills on burgundy that wrap in uneven rows. Redesign:
- Layout: a responsive grid (`repeat(auto-fit, minmax(240px, 1fr))`) of equal-height chips, or a single flex-wrap row centered; chips must not look ragged.
- Each chip: 20px check/dot icon in a 32px circle, then text (Inter 500, 15–16px), radius 16px, padding 14px 18px.
- **On sage**: chip bg `color-mix(in srgb, var(--bg) 55%, transparent)`, 1px border `color-mix(in srgb, var(--deep) 25%, transparent)`, text `--deep`, icon circle bg `--deep` with `--surface` check.
- **On deep**: chip bg `color-mix(--surface 8%)`, border `--s-border`, text `--surface`, icon circle bg `--sage` with `--deep` check.

### 5.4 Cards (4 variants)

All: radius `--r-card` (24px), padding `clamp(20px, 2.5vw, 32px)`, hover: translateY(-3px) and soft shadow `0 12px 32px -12px rgba(93,13,24,0.25)`, transition 200ms.

1. **`card--default`**: bg `--card`, 1px `--border`, text `--ink`. Title Playfair H3.
2. **`card--sage`** (inverted): bg `--sage`, no border, **all text `--deep`**, price badge `badge--deep`, hover bg `--sage-hover`.
3. **`card--deep`**: bg `--deep`, text `--surface`, title `--surface`, badge `badge--sage`, hover bg `--deep-hover`.
4. **`card--outline`**: transparent bg, 1.5px `--deep` border (or `--surface` on deep sections), text inherits.

Service card anatomy: optional icon tile (48×48, radius 14px) → Playfair H3 → 3–4 line description → footer row with `badge--price` and a duration label ("від 3 дн.") → whole card is a link with an arrow that appears on hover (top-right, 20px).
Service cards on the home page: make **Дипломна робота** the featured card (`card--deep`), **Курсова робота** and **Звіт з практики** `card--sage` (diagonal placement so the three inverted cards are not adjacent), the rest `card--default`. That yields roughly 50% inverted cards inside that section, which compensates for the light page background.

### 5.5 Icons

- Style: **outline icons, 1.75px stroke, rounded caps and joins, 24px grid** (Lucide, already compatible). Single color via `currentColor`.
- Icon tile variants: `icon-tile--sage` (bg sage, icon deep), `icon-tile--deep` (bg deep, icon surface), `icon-tile--tint` (bg tint, icon deep), `icon-tile--outline`.
- Use the graduation-cap logo motif as a recurring decorative element: a large (240–360px) cropped version of the logo outline at 6–8% opacity in the corner of a sage or deep section, never behind text that needs contrast.
- Logo: keep the existing mark (sage cap, burgundy outline, "4 U"). On deep backgrounds, place it on a `--bg` rounded tile (as in the footer) rather than recoloring.

### 5.6 Step / timeline ("Як ми працюємо")

- 4 steps; number circles 56px, bg `--surface`, text `--deep`, Playfair 600 20px.
- One continuous 2px connector line (`--sage` at 60% on deep) via `::before` on the list, vertically centered on the circles (`top: 28px`), running from the center of circle 1 to the center of circle 4, `z-index` below the circles. On mobile: vertical list, line passes through circle centers or is removed.
- Variant on sage: circles bg `--deep`/text `--surface`, line `--deep` at 40%.
- Steps may include a small icon below each number and a 2-line description (Inter 400, `--s-muted`).

### 5.7 Forms

- Field: min-height 52px, radius `--r-input`, bg `--field-bg`, 1px `--field-border` (`--sage` at 60%), Inter 16px, padding `0 16px`.
- Focus: border `--deep`, `box-shadow: 0 0 0 4px color-mix(in srgb, var(--deep) 14%, transparent)`.
- Label: Inter 500 14px above field, 6px gap. Help text: 13px `--s-muted`. Error: border `--error`, message in `--error` with an icon (not color alone).
- Select: `appearance: none` with custom chevron in `--deep`.
- Checkbox/radio: custom 20px, radius 6px, checked bg `--deep` with `--surface` check mark, 2px offset focus ring. Consent label: flex, gap 10px, text left aligned, link inline underlined.
- On `deep` sections (the calculator): fields keep light bg; labels in `--surface`; range slider track `--surface` at 25%, fill `--sage`, thumb 22px `--surface` with shadow.
- Contact form section: allow a two-column layout on desktop: left a **sage inverted info panel** (burgundy text: headline, 3 reassurance bullets, Telegram link), right the white form card. On mobile it stacks, panel first.

### 5.8 Accordion (FAQ)

- Items: bg `--card`, 1px `--border`, radius 20px, padding 20px 24px, gap 12px between items.
- Question: Inter 600 17px; chevron icon rotates 180° when open; open state: border `--sage`, bg `--tint`, answer in Inter 400 `--muted`.
- Optional: the first item open by default; smooth height animation (`grid-template-rows: 0fr → 1fr`).
- On a sage section variant: items bg `--bg`, text `--ink`; open item bg `--deep`, text `--surface`.

### 5.9 Tables (Prices)

- Wrapper radius `--r-card`, overflow hidden, 1px `--deep` border.
- Header row bg `--deep`, text `--surface`, Inter 600 14px uppercase optional.
- Rows: bg `--card`, zebra with `--surface`; hover row bg `--tint`; price column Playfair 600 18px `--deep`.
- Highlight row (e.g., most popular): bg `--sage`, text `--deep`, with a small `badge--deep` "Популярне".
- Mobile: convert to stacked cards (label/value pairs) below 640px, no horizontal scroll.

### 5.10 Reviews

- Section theme `sage`; heading and accent line burgundy, centered.
- Cards: bg `--bg`, text `--ink`, radius 24px, no border, soft shadow; avatar 44px circle bg `--deep` with `--surface` initial; star rating row in `--deep`; date in `--muted` 13px.
- Quote mark: large Playfair “ in `--sage` at 40% opacity in the card's top-right.
- Keep placeholder text for now; build structure so real reviews drop in.

### 5.11 Stats / trust row (new, optional but recommended)

A horizontal row of 3–4 stat blocks (e.g., "85–90% унікальність", "від 3 днів", "2 етапи оплати", "1 місяць безкоштовних правок"), using Playfair 700 numerals at `clamp(32px, 4vw, 48px)` and Inter 14px captions, separated by 1px vertical dividers. Use on a `sage` band (burgundy numerals) or `tint` band. Only reuse facts that already exist on the site.

### 5.12 Callout / notice

Left border 4px `--deep`, bg `--accent-tint`, radius 16px, padding 20px 24px, optional icon. Variants: `callout--sage` (bg `--tint`, border `--sage-deep`), `callout--deep` (bg `--deep`, text `--surface`).

### 5.13 Header and footer

- Header: height 72px, bg `color-mix(in srgb, var(--bg) 88%, transparent)` with `backdrop-filter: blur(12px)`, 1px bottom border. Menu button: pill outline. CTA "Дізнатись ціну": primary. On scroll add subtle shadow.
- Footer (`deep`): 5-column grid on desktop (brand + 4 link columns), 2 on tablet, 1 on mobile. Column headings Playfair 600 `--surface` with a 28×2px sage line; links Inter 15px `--surface` at 85%, hover 100% and underline. Fix the heading wrap ("Де ми працюємо") by using `text-wrap: balance` and a minimum column width of 180px. Bottom bar bg `--deep-2`, 1px top border, copyright and the cookie settings button (make sure the floating chat button never covers it: add bottom padding to footer ≥ 88px on mobile).
- Floating chat button: keep sage bg with burgundy border and burgundy icon; add a 4px `--bg` ring so it separates from both light and deep backgrounds.

### 5.14 Decorative devices (use sparingly, consistent)

- Accent line under H2 (see §3).
- Soft rounded "blob" or large arc shapes in `--tint` or `--sage` at 30% opacity behind the hero and CTA (max 1–2 per page, never behind text).
- Thin 1px sage dividers with a centered small cap icon between light sections of the same theme.
- Subtle paper grain overlay on deep sections (`opacity: 0.04` SVG noise) for tactile depth. Optional.

---

## 6. Effects, motion, and states

- Shadows: `--shadow-sm: 0 1px 2px rgba(43,26,29,.06)`, `--shadow-md: 0 8px 24px -8px rgba(43,26,29,.14)`, `--shadow-lg: 0 20px 48px -16px rgba(93,13,24,.28)`. On deep/sage surfaces use burgundy-tinted shadows, not black.
- Transitions: 150–250ms, `cubic-bezier(.2,.7,.2,1)`. Scroll-reveal: fade + 12px translate-up once, 400ms, only for above-the-fold-below content; disabled under `prefers-reduced-motion`.
- Hover on links: underline appears/thickens; never rely on color change alone.
- Focus: every interactive element has a visible `:focus-visible` ring (2px, offset 3px, color `--s-accent`).
- No parallax, no autoplay motion, no gradients except subtle tinted overlays within the palette.

---

## 7. Responsive behavior

Breakpoints: 480, 768, 1024, 1280.
- ≥1024: two-column hero (text 55%, calculator 45%).
- 768–1023: hero stacks with calculator below text; service cards 2 columns.
- <768: single column; sticky header compact; buttons full width inside forms; tables become cards; step list vertical.
- Never allow horizontal scroll at 320px. Tap targets ≥ 48px. Inputs 16px font minimum.
- Check at 1440, 1024, 768, 375, 320.

---

## 8. Reusability and implementation plan

1. **Tokens file**: `src/styles/tokens.css` (palette, type scale, spacing, radii, shadows). Import globally.
2. **Themes file**: `src/styles/themes.css` with the `[data-theme]` blocks from §4.
3. **Components**: Astro components with props, e.g. `Section.astro` (`theme`, `eyebrow`, `title`, `lead`, `align`, `id`), `Button.astro` (`variant`, `size`, `href`, `icon`), `Badge.astro`, `Card.astro` (`variant`), `Chip.astro`, `IconTile.astro`, `Accordion.astro`, `PriceTable.astro`, `Steps.astro`, `Stat.astro`, `Callout.astro`, `FormField.astro`.
4. **Section component** must set `data-theme` and expose a slot, so any page is just a list of `<Section theme="sage">…</Section>` blocks.
5. **Styleguide page**: create `/styleguide` (noindex, not in sitemap, excluded from production build or protected) that renders every token, theme, button, badge, card, chip, form control, accordion, table, step list, and stat in all themes. Use it to verify contrast and as living documentation.
6. **Docs**: add `DESIGN.md` at the repo root with the rules from this file in short form (tokens, themes, the 30% inversion rule, do/don't).
7. Remove duplicate or hard-coded colors and fonts. Everything must reference tokens. Search for hex values outside `tokens.css` and replace.
8. Keep existing SEO, schema, routes, and analytics untouched.

### Applying to every page (rules for new and existing pages)

For any page (services `/poslugy/*`, prices, reviews, about, blog and posts, FAQ, contacts, cities, universities, legal pages, sitemap):
1. Start with a **light** hero/intro section (H1 Playfair, lead, primary CTA).
2. Plan the section sequence so that **~30% of the page area is inverted (sage with burgundy text)** and one deep burgundy accent (CTA band or footer-adjacent block) appears at most once or twice. Alternate: light → sage → light → deep → cream → CTA.
3. End every page with the shared **CTA band** (theme `deep` or `sage`, alternating by page) containing the heading "Готовий почати?", one sentence, and two buttons (primary + secondary), followed by the footer. If the page already has the contact form, use the form instead.
4. Long-form pages (blog, legal, about): readable column `max-width: 72ch`, H2 with accent line, pull-quotes as `callout--sage`, table of contents as a sticky tint card, inverted sage block for key takeaways ("Коротко").
5. Breadcrumbs: Inter 13px `--muted`, separators `›`.
6. Never invent a new color, radius, shadow, or font size; if something is missing, add a token and document it.

---

## 9. Specific fixes to include while redesigning the home page

(From the current screenshots.)
- Hero: reduce H1 scale; add `padding-top` before the lead paragraph; keep the calculator as a deep card with the sage "Ціна від 15 000 грн" badge not overlapping the title (≥ 20px gap).
- Calculator card: no "presentation" option; price text in Playfair; custom range slider; term pills in one row with no wrapping; labels Inter 500.
- Benefit chips band: convert to the sage inverted version (§5.3), equal-height chips.
- Services: apply card variants (§5.4); make sure price badge and duration are on one baseline.
- How we work: connector line continuous and centered on circles; short accent line under H2 on its own, not touching other lines.
- Prices: remove the grey hover/“last row” stray background (`Теза` row currently looks different); consistent zebra and hover.
- Reviews: inverted sage band, burgundy text, cards as in §5.10.
- FAQ: accordion with chevrons (currently no affordance); fix the "Міста, з якими ми працюємо" block: align it to the same left edge as the section title (it is currently indented), put it in a `tint` band.
- Contact form: centered title and short accent line; left-aligned form with a consistent edge; consent checkbox inline with its text (currently broken, justified); primary button disabled state until consent; buttons in one row.
- Footer: fix the heading wrapping, spacing, and the chat button overlapping the "Змінити…" cookie button.
- Typographic cleanup site-wide: `’` apostrophes, non-breaking spaces in numbers/units, consistent "ти" tone.

---

## 10. Accessibility and quality checklist

- WCAG 2.2 AA: contrast verified for each theme/component combination in the styleguide; no information by color alone; visible focus; keyboard operable accordion, menu, and form; `aria-expanded` on accordions; labels tied to inputs; error messages with `aria-live="polite"`.
- `prefers-reduced-motion` and `prefers-color-scheme`: keep the light design only (do not auto-invert to dark mode).
- Performance: self-host fonts (`font-display: swap`, subset cyrillic+latin, preload the two main weights), SVG icons inline, no layout shift (reserve image sizes), Lighthouse ≥ 95 for performance, accessibility, best practices, SEO.
- No horizontal scroll at any width; no text overflow; no overlapping elements.
- Final report: list files created/changed, token additions, the section sequence you chose for each page, and screenshots at 1440 and 375 for the home page.

---

## 11. Do and Don't (quick reference)

**Do**: use sage blocks with burgundy text for ~30% of the page; keep serif headings and sans body; keep shapes rounded; use burgundy for the primary action; keep generous whitespace; reuse components.

**Don't**: put cream/white text on sage; use `--muted` on sage; stack two inverted sections; add new hues or gradients; use heavy shadows; mix more than two font families; leave any hard-coded hex outside tokens.
