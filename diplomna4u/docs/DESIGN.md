# DESIGN

## Design tokens
Tokens live in `src/styles/global.css` under `:root`.

| Token group | Examples |
|---|---|
| Colors | `--bg`, `--surface`, `--sand`, `--red`, `--ink`, `--muted`, `--vanilla` |
| Typography | `--font-heading` (Playfair Display), `--font-body` (Inter), `--fs-display`, `--fs-h2`, `--fs-lead` |
| Spacing | `--s-1` ... `--s-9`, section padding 3-5rem |
| Radius | `--r-sm`, `--r-md`, `--r-lg`, `--r-btn`, `--r-card`, `--r-input` |

## Rules
- Dark red fills only on buttons and cards.
- No full red section backgrounds for form blocks; use a rounded red card inside a light section.
- Sand blocks use red text for inversion.
- Avoid `--muted` on red backgrounds.
- Contrast: text on red uses `--vanilla`.
- Max about 8-10% red area per screen.

## Typography
- Headings: Playfair Display 700.
- Body: Inter 400/500/600.
- Base body size: 1rem (minimum 16px on mobile).

## Section themes
- `bg`: light cream background.
- `surface`: cream-2.
- `sage`: sand with deep red text.
- `invert`: surface background with ink text (legacy name).
- `blood`: dark red background with vanilla text.
- `deep`: surface background.

## Responsive breakpoints
- Mobile-first; common breakpoints at 600px, 720px, 768px, 899px, 900px, 1024px, 1440px.

## Do / don't
- Use tokens instead of hex values.
- Use existing components; avoid duplicate logic.
- Do not add animations or new sections beyond documented ones.