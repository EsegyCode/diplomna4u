// src/pages/api/lead.ts
// ЗАГЛУШКА — SSG не обслуговує цей файл у продакшені.
// Реальний обробник: functions/api/lead.ts (Cloudflare Pages Function)
// TODO: підключити backend / Telegram-бот / CRM / Formspree / serverless

export function GET() {
  return new Response(JSON.stringify({ ok: false, error: 'Use POST' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function POST() {
  return new Response(JSON.stringify({ ok: false, error: 'Configure functions/api/lead.ts' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  });
}
