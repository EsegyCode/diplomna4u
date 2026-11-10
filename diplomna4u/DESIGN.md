# DESIGN.md

Brand: red `#AD1312`, cream `#F9EEDB`, sand `#EBD6AE`. Light-first.

Tokens: `src/styles/global.css` (`:root`) and `src/data` (single source of truth: `src/data/services.ts`).

Rules:
- Use red only on buttons, cards, small elements; no red section/background fills.
- Sections can use light/cream/sand/tint themes; never adjacent sand bands.
- Chips on sand sections have solid white (`--card`) backgrounds.
- Floating chat button is white with red border and a `--bg` ring.
- Services order comes from `src/data/services.ts`; all lists, selects, tables, and navigation derive from it.
- Typographic apostrophe ’, non-breaking spaces in numbers and units.

Guarantees block text and per-service card-1 overrides are stored in `src/data/guarantees.ts`.