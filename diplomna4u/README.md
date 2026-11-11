# Diplomna 4 U

Сайт сервісу "Diplomna 4 U": консультаційні та інформаційні послуги з підготовки студентських і наукових робіт. Мови інтерфейсу: українська. Збірка статична (Astro), деплой на Cloudflare Pages, домен задається змінною середовища `PUBLIC_SITE_URL`.

## Технології

- Astro 7.4.x
- @astrojs/sitemap 3.7.x
- TypeScript 6.0.x
- Google Fonts: Playfair Display, Inter
- Cloudflare Pages (static output)

## Швидкий старт

Вимоги: Node.js >= 22.23.4 (`engines` у `package.json`). Рекомендовано використовувати Node 22 LTS.

```sh
npm install
npm run dev
```

Dev-сервер: http://localhost:4321

Робочі команди:

| Команда | Що робить | Коли запускати |
|---|---|---|
| `npm run dev` | Dev-сервер Astro | під час розробки |
| `npm run build` | Production-збірка (вимагає `PUBLIC_SITE_URL`) | перед публікацією |
| `npm run preview` | Локальний перегляд білду | після build |
| `npm run routes` | Генерує `docs/ROUTES.txt` | після build |
| `npm run generate:icons` | Іконки й логотип із `public/logo sources` | prebuild |
| `npm run generate:og` | OG-зображення | prebuild |
| `npm run generate:llms` | `public/llms.txt` і `public/llms-full.txt` | prebuild |
| `npm run generate:robots` | `public/robots.txt` | prebuild |
| `npm run check:seo` | Перевірка title/description/h1/canonical | перед публікацією |
| `npm run check:encoding` | Перевірка UTF-8 і mojibake | перед публікацією |
| `npm run seo:check` | Альтернативне ім'я для `check:seo` | — |

## Структура проєкту

```text
src/
  components/   спільні Astro-компоненти
  data/         конфіги: services, cities, pricing, site, navigation
  pages/        маршрути (static SSG)
  layouts/      BaseLayout
  content/      блог�анти, відгуки
  styles/       global.css і дизайн-токени
public/         статика, robots.txt, _headers, _redirects, OG
scripts/        генерація і перевірки
docs/          документація і звіти
dist/          результат build (не комітимо)
```

## Змінні середовища

Див. `.env.example`. Основна: `PUBLIC_SITE_URL` (домен, без слешу на кінці). Секрети (Telegram bot token) задаються тільки в Cloudflare Pages (не комітяться).

## Документація

- [AGENTS.md](AGENTS.md) — правила для розробників і AI-агентів (англійською).
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — архітектура і дані (англійською).
- [docs/DESIGN.md](docs/DESIGN.md) — дизайн-система (англійською).
- [docs/CONTENT-GUIDE.md](docs/CONTENT-GUIDE.md) — керування контентом без коду.
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) — деплой на Cloudflare Pages.
- [docs/SEO-CHECKLIST.md](docs/SEO-CHECKLIST.md) — SEO-чекліст.
- [CHANGELOG.md](CHANGELOG.md) — історія змін.
- [docs/ROUTES.txt](docs/ROUTES.txt) — список маршрутів (генерується `npm run routes`).
- [docs/SEO-TECH-REPORT.md](docs/SEO-TECH-REPORT.md), [docs/LINKING-REPORT.md](docs/LINKING-REPORT.md), [docs/DEPLOY-CLOUDFLARE.md](docs/DEPLOY-CLOUDFLARE.md) — технічні звіти.

## Перед публікацією

- [ ] `npm run build` проходить без помилок.
- [ ] `npm run check:seo` проходить без помилок.
- [ ] `npm run check:encoding` проходить без помилок.
- [ ] `npm run routes` регенерований за потреби.
- [ ] OG-зображення та фавіконки актуальні.
- [ ] `PUBLIC_SITE_URL` встановлено в Cloudflare Pages.
- [ ] `robots.txt`, sitemap і `llms.txt` доступні після деплою.