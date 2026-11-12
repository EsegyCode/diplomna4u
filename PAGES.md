# PAGES.md — список сторінок і джерел текстів

Корінь проєкту: `diplomna4u/`. URL-адреси — продакшн-маршрути Astro (SSG). Тексти живуть у сторінках, компонентах і файлах даних.

## 1. Окремі сторінки

| # | URL | Файл у проєкті | Коротка назва |
|---|-----|----------------|----------------|
| 1 | `/` | `diplomna4u/src/pages/index.astro` | Головна |
| 2 | `/tsiny/` | `diplomna4u/src/pages/tsiny.astro` | Ціни |
| 3 | `/poslugy/` | `diplomna4u/src/pages/poslugy/index.astro` | Послуги (список) |
| 4 | `/poslugy/dyplomna-robota/` | `diplomna4u/src/pages/poslugy/[service].astro` + `diplomna4u/src/data/services.ts` | Дипломна робота |
| 5 | `/poslugy/kursova-robota/` | `diplomna4u/src/pages/poslugy/[service].astro` + `diplomna4u/src/data/services.ts` | Курсова робота |
| 6 | `/poslugy/stattia/` | `diplomna4u/src/pages/poslugy/[service].astro` + `diplomna4u/src/data/services.ts` | Стаття |
| 7 | `/poslugy/teza/` | `diplomna4u/src/pages/poslugy/[service].astro` + `diplomna4u/src/data/services.ts` | Теза |
| 8 | `/poslugy/referat/` | `diplomna4u/src/pages/poslugy/[service].astro` + `diplomna4u/src/data/services.ts` | Реферат |
| 9 | `/poslugy/zvit-z-praktyky/` | `diplomna4u/src/pages/poslugy/[service].astro` + `diplomna4u/src/data/services.ts` | Звіт з практики |
| 10 | `/mista/` | `diplomna4u/src/pages/mista/index.astro` | Міста (список) |
| 11 | `/kyiv/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Київ |
| 12 | `/sumy/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Суми |
| 13 | `/lviv/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Львів |
| 14 | `/zhytomyr/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Житомир |
| 15 | `/bila-tserkva/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Біла Церква |
| 16 | `/poltava/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Полтава |
| 17 | `/kharkiv/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Харків |
| 18 | `/dnipro/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Дніпро |
| 19 | `/vinnytsia/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Вінниця |
| 20 | `/odesa/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Одеса |
| 21 | `/zaporizhzhia/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Запоріжжя |
| 22 | `/chernihiv/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Чернігів |
| 23 | `/cherkasy/` | `diplomna4u/src/pages/[city]/index.astro` + `diplomna4u/src/data/cities.ts` | Місто: Черкаси |
| 24 | `/blog/` | `diplomna4u/src/pages/blog/index.astro` | Блог (список; опублікованих статей немає, демо-пост `draft: true` не індексується) |
| 25 | `/faq/` | `diplomna4u/src/pages/faq.astro` + `diplomna4u/src/data/faq.ts` | FAQ |
| 26 | `/pro-nas/` | `diplomna4u/src/pages/pro-nas.astro` | Про нас |
| 27 | `/vidhuky/` | `diplomna4u/src/pages/vidhuky.astro` + `diplomna4u/src/content/reviews/*.json` | Відгуки |
| 28 | `/kontakty/` | `diplomna4u/src/pages/kontakty.astro` | Контакти |
| 29 | `/karta-saitu/` | `diplomna4u/src/pages/karta-saitu.astro` | Карта сайту |
| 30 | `/dialkuye/` | `diplomna4u/src/pages/dialkuye.astro` | Сторінка подяки (noindex) |
| 31 | `/polityka-cookie/` | `diplomna4u/src/pages/polityka-cookie.astro` | Політика cookie |
| 32 | `/polityka-konfidentsiinosti/` | `diplomna4u/src/pages/polityka-konfidentsiinosti.astro` | Політика конфіденційності |
| 33 | `/publichna-oferta/` | `diplomna4u/src/pages/publichna-oferta.astro` | Публічна оферта |
| 34 | `/404` | `diplomna4u/src/pages/404.astro` | Сторінка 404 (noindex) |

## 2. Спільні блоки (тексти повторюються на багатьох сторінках)

| Блок | Файл | Де відображається |
|------|------|-------------------|
| Хедер | `diplomna4u/src/components/Header.astro` + `diplomna4u/src/data/navigation.ts` | усі сторінки |
| Футер | `diplomna4u/src/components/Footer.astro` | усі сторінки |
| Віджет «Зв'язок з нами» | `diplomna4u/src/components/StickyContact.astro` | усі сторінки |
| Калькулятор / QuickOrder | `diplomna4u/src/components/QuickOrder.astro` + `diplomna4u/src/data/pricing.ts` + `diplomna4u/src/utils/price.ts` | головна, poslugy, tsiny, mista, city, dialkuye, 404 |
| Форма заявки | `diplomna4u/src/components/LeadForm.astro` | багато сторінок |
| Hero | `diplomna4u/src/components/Hero.astro` + `diplomna4u/src/data/heroCopy.ts` | головна, poslugy, tsiny, city |
| FAQ-блок | `diplomna4u/src/components/FAQ.astro` + `diplomna4u/src/data/faq.ts` / `services.ts` / `cities.ts` | головна, poslugy, tsiny, mista, city |
| Мета-теги / BaseLayout | `diplomna4u/src/layouts/BaseLayout.astro` + `diplomna4u/src/lib/seo.ts` | усі сторінки |
| Cookie-banner | `diplomna4u/src/components/CookieBanner.astro` | усі сторінки |
| Основні дані сайту | `diplomna4u/src/data/site.ts` | мета, футер, контакти |
| Гарантії | `diplomna4u/src/data/guarantees.ts` + `diplomna4u/src/components/Guarantees.astro` | poslugy, послуги |
| Статистика | `diplomna4u/src/data/stats.ts` | про нас |
| Новинки блогу | `diplomna4u/src/content/blog/demo-post.md` | blog, rss (`feed.xml.ts`) |

## 3. Примітки

- `api/lead` — не сторінка з контентом, пропущено.
- `feed.xml` — технічний RSS-фід, пропущено.
- Юридичні тексти (`polityka-*`, `publichna-oferta`) позначені в TODO як «потребує перевірки» і залишаються без змін.
