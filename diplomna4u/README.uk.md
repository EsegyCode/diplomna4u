# Diplomna 4 U (Українська)

Сайт сервісу "Diplomna 4 U": консалтинг та підготовка студентських/наукових робіт. Інтерфейс українською, статична збірка Astro, деплой на Cloudflare Pages.

## Запуск

Вимоги: Node.js >= 22.23.4.

```sh
npm install
npm run dev
npm run build
npm run preview
```

Production-збірка потребує `PUBLIC_SITE_URL` без слешу на кінці.

## Змінні середовища

- `.env.example`: `PUBLIC_SITE_URL` (на deploy у Cloudflare Pages).
- Секрети Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) задають у dashboard (не комітять).
- Необов'язково: `TURNSTILE_SECRET_KEY`, `DRY_RUN=1`.

## Документація

- [English README](README.md)
- [docs/INDEX](docs/CONTENT-GUIDE.md)
- [Архітектура](docs/ARCHITECTURE.md)
- [Деплой](docs/DEPLOYMENT.md)
- [Форми](docs/FORMS.md)