// Cloudflare Pages Function: /api/lead
export async function onRequestPost(context: any) {
  const { request, env } = context;
  try {
    const form = await request.formData();
    const hp = (form.get('hp') || '').toString();
    if (hp) return json({ ok: true }, 200); // honeypot

    const name = (form.get('name') || form.get('qo_name') || '').toString().trim();
    const contact = (form.get('contact') || form.get('qo_contact') || '').toString().trim();
    const workType = (form.get('work_type') || form.get('qo_work_type') || '').toString();
    const comment = (form.get('comment') || form.get('qo_comment') || '').toString();
    const email = (form.get('email') || form.get('qo_email') || '').toString();
    const calcPayload = (form.get('calc_payload') || '').toString();
    const city = (form.get('city') || '').toString();
    const pageUrl = (form.get('page_url') || '').toString();
    const source = (form.get('source') || '').toString();

    if (!name || name.length < 2) return json({ ok: false, error: 'Ім' }, 400);
    if (!contact || contact.length < 3) return json({ ok: false, error: 'Контакт' }, 400);

    const token = env.TELEGRAM_BOT_TOKEN;
    const chatId = env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) {
      return json({ ok: false, error: 'Telegram not configured (TODO)' }, 500);
    }

    const lines = [
      '_##Нова заявка — Diplomna 4 U##_',
      `Ім'я: ${name}`,
      `Контакт: ${contact}`,
      workType ? `Тип роботи: ${workType}` : '',
      email ? `Email: ${email}` : '',
      comment ? `Коментар: ${comment}` : '',
      city ? `Місто: ${city}` : '',
      source ? `Джерело: ${source}` : '',
      pageUrl ? `Сторінка: ${pageUrl}` : '',
      calcPayload ? `Калькулятор: ${calcPayload}` : '',
    ].filter(Boolean);

    const text = lines.join('\n');
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
    });
    if (!res.ok) return json({ ok: false, error: 'Telegram error' }, 502);
    return json({ ok: true }, 200);
  } catch (e: any) {
    return json({ ok: false, error: String(e?.message || e) }, 500);
  }
}

export function onRequestGet() {
  return json({ ok: false, error: 'Use POST' }, 405);
}

function json(body: any, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
