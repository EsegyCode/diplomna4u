# Форми сайту

## Інвентар

| Форма | Файл | Поля | source id | Де відображається |
|---|---|---|---|---|
| Готовий почати? | `src/components/LeadForm.astro` | name, contact, work_type, comment, consent | `contact` | головна, сторінки послуг/міст/контакти |
| Калькулятор | `src/components/QuickOrder.astro` (крок 2) | qo_name, qo_contact, qo_comment, consent + calc_payload | `quick-order` | головна, послуги, міста |
| Липка форма | `src/components/StickyContact.astro` | name, phone, workType, consent | `sticky-contact` | усі сторінки |

## Поля → Telegram
`name`, `contact` (з `contactType`), `workType`, `direction`, `topic`, `pages`, `deadline`, `estimatedPrice`, `comment`, `pageUrl`, `utm`, `formStartedAt`, `website` (honeypot). Endpoint: `POST /api/lead`.