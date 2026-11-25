# DEPLOYMENT

## Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Node version: >= 22.23.4
- Environment variable: `PUBLIC_SITE_URL` (без слешу на кінці)

## Що подаровано в коді
- `public/_headers`: заголовки безпеки, кеш, preview noindex.
- `public/_redirects`: політика завершення слеша береться з Astro.
- `robots.txt` генерується скриптом з домену (`PUBLIC_SITE_URL`).
- sitemap і OG-зображення генеруються при збірці.

## Після деплою
1. Перевірити головну, сторінку послуги, `/robots.txt`, `/sitemap-index.xml`, `/llms.txt`, OG-зображення, 404.
2. Додати домен і HTTPS-редирект.
3. Подати sitemap у Google Search Console і Bing Webmaster Tools.
4. Перевірити налаштування ботів Cloudflare (дозволити перелічені в `robots.txt`).

## Заявки → Telegram (наступний етап)
РЕАЛІЗОВАНО: `functions/api/lead.ts` приймає POST форми, валідує поля, перевіряє Origin/Referer, honeypot і time trap, виконує необов'язкову Turnstile-перевірку та надсилає повідомлення в Telegram. Секрети `TELEGRAM_BOT_TOKEN` і `TELEGRAM_CHAT_ID` задаються через Cloudflare Pages; додатково підтримуються `TURNSTILE_SECRET_KEY`, `PUBLIC_SITE_URL` і `DRY_RUN`. Поля форми: `name`, `contact`, `workType`, `comment`, `consent` та калькуляторні поля.
## ������� /api/lead\n̳��������������: unctions/api/lead.ts. ��������: �������� ����, honeypot, time trap, Turnstile (�����������), ���� Telegram sendMessage. ����?����� �������: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (��� Secret, Production � Preview). ��������� ����� TURNSTILE_SECRET_KEY �������.
## ĳ���������: 401 - ������������ �����; 400 chat not found - ������������ chat id; ���������� ����� chat id �� -100...
