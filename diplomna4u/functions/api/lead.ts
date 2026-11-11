interface Env {
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
  TURNSTILE_SECRET_KEY?: string;
  PUBLIC_SITE_URL?: string;
  DRY_RUN?: string;
}

interface LeadData {
  [key: string]: unknown;
}

const ALLOWED_HOSTS = new Set([
  'diplomna4u.cx.ua',
  'www.diplomna4u.cx.ua',
  'diplomna4u.pages.dev',
  'localhost',
  '127.0.0.1',
]);

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function json(data: unknown, status = 200, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...extra,
    },
  });
}

function cleanString(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function isAllowedOrigin(request: Request, env: Env): boolean {
  const raw = request.headers.get('origin') || request.headers.get('referer');
  if (!raw) return false;
  try {
    const host = new URL(raw).hostname.toLowerCase();
    if (ALLOWED_HOSTS.has(host)) return true;
    if (host.endsWith('.diplomna4u.pages.dev')) return true;
    const configured = (env.PUBLIC_SITE_URL || '').trim();
    if (configured) {
      try {
        if (host === new URL(configured).hostname.toLowerCase()) return true;
      } catch {
        /* ignore */
      }
    }
    return false;
  } catch {
    return false;
  }
}

function normalizeContact(raw: string): { type: string; value: string } | null {
  const value = raw.trim();
  if (!value) return null;

  // Telegram URL
  let v = value;
  const m = v.match(/^https?:\/\/t\.me\/([A-Za-z][A-Za-z0-9_]{4,31})\/?$/i);
  if (m) v = '@' + m[1];

  // Telegram username
  if (/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)) {
    return { type: 'telegram', value: '@' + v };
  }
  if (/^@[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)) {
    return { type: 'telegram', value: v };
  }

  // Email
  if (v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return { type: 'email', value: v.toLowerCase() };
  }

  // Phone
  const hasPlus = v.startsWith('+');
  const digits = v.replace(/[^\d]/g, '');
  if (digits.length >= 9 && digits.length <= 15) {
    return { type: 'phone', value: (hasPlus ? '+' : '+') + digits };
  }

  return null;
}

function countUrls(text: string): number {
  return (text.match(/https?:\/\/[^\s]+/gi) || []).length;
}

function kyivTime(): string {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(now);
  const get = (type: string) => parts.find(p => p.type === type)?.value || '';
  return `${get('day')}.${get('month')}.${get('year')} ${get('hour')}:${get('minute')}`;
}

function buildMessage(data: Record<string, unknown>, sourceLabel: string): string {
  const lines: string[] = [];
  lines.push(`🆕 <b>Нова заявка</b> · ${esc(sourceLabel)}`);
  lines.push('');
  if (data.name) lines.push(`👤 <b>Імʼя:</b> ${esc(String(data.name))}`);
  if (data.contact) lines.push(`📲 <b>Контакт (${esc(String(data.contactType))}):</b> ${esc(String(data.contact))}`);
  if (data.workType) lines.push(`🎓 <b>Тип роботи:</b> ${esc(String(data.workType))}`);
  if (data.direction) lines.push(`🧭 <b>Напрям:</b> ${esc(String(data.direction))}`);
  if (data.topic) lines.push(`📝 <b>Тема:</b> ${esc(String(data.topic)).slice(0, 4096)}`);
  if (data.pages) lines.push(`📄 <b>Обсяг:</b> ${esc(String(data.pages))} стор.`);
  if (data.deadline) lines.push(`⏱ <b>Термін:</b> ${esc(String(data.deadline))}`);
  if (data.estimatedPrice) lines.push(`💰 <b>Орієнтовна вартість:</b> ${esc(String(data.estimatedPrice))}`);
  if (data.comment) lines.push(`💬 <b>Коментар:</b> ${esc(String(data.comment)).slice(0, 4096)}`);
  if (data.pageUrl) lines.push(`🔗 <b>Сторінка:</b> ${esc(String(data.pageUrl))}`);
  if (data.utm && typeof data.utm === 'object') {
    const utm = Object.entries(data.utm as Record<string, string>)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${v}`)
      .join(', ');
    if (utm) lines.push(`📈 <b>UTM:</b> ${esc(utm)}`);
  }
  lines.push(`🕒 ${kyivTime()} (Київ)`);

  let text = lines.join('\n');
  if (text.length > 4096) text = text.slice(0, 4093) + '...';
  return text;
}

async function sendTelegram(env: Env, text: string, keyboard: unknown): Promise<{ ok: boolean; status: number; description?: string; migrateTo?: number; retryAfter?: number }> {
  const token = env.TELEGRAM_BOT_TOKEN as string;
  const chatId = env.TELEGRAM_CHAT_ID as string;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const payload: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true };
  if (keyboard) payload.reply_markup = keyboard;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);

    let body: any = null;
    try { body = await res.json(); } catch { body = null; }

    console.log('telegram_api_response', JSON.stringify({ status: res.status, ok: res.ok, body, time: new Date().toISOString() }));

    if (res.ok && body && body.ok) return { ok: true, status: res.status };

    const retryAfter = body?.parameters?.retry_after;
    const migrateTo = body?.parameters?.migrate_to_chat_id;
    if (migrateTo) console.error('WARNING: Telegram migrate_to_chat_id', migrateTo, 'update TELEGRAM_CHAT_ID');
    return {
      ok: false,
      status: res.status,
      description: body?.description || res.statusText,
      retryAfter: typeof retryAfter === 'number' ? retryAfter : undefined,
      migrateTo,
    };
   } catch (e) {
    clearTimeout(timer);
    console.error('telegram_api_error', JSON.stringify({ message: (e as Error)?.message || 'network error', time: new Date().toISOString() }));
    return { ok: false, status: 0, description: (e as Error)?.message || 'network error' };
  }
}

async function attemptSend(env: Env, text: string, keyboard: unknown): Promise<{ ok: boolean; status: number; description?: string }> {
  let result = await sendTelegram(env, text, keyboard);
  if (result.ok) return result;

  // retry on 429/5xx/network with optional retry_after (cap 3s)
  const retriable = result.status === 0 || result.status === 429 || result.status >= 500;
  if (retriable) {
    let wait = 1000;
    if (result.retryAfter && result.retryAfter <= 3) wait = result.retryAfter * 1000;
    console.warn('telegram_retry', JSON.stringify({ status: result.status, waitMs: wait, time: new Date().toISOString() }));
    await new Promise(r => setTimeout(r, wait));
    result = await sendTelegram(env, text, keyboard);
  }
  if (!result.ok) {
    console.error('telegram_send_failed', JSON.stringify({ status: result.status, description: result.description, time: new Date().toISOString() }));
  }
  return result;
}

async function verifyTurnstile(env: Env, token: string, ip: string): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY || !token) return true;
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: ip }),
    });
    const json = await res.json();
    return Boolean(json?.success);
  } catch {
    return false;
  }
}

const SOURCE_LABELS: Record<string, string> = {
  contact: 'Форма на сторінці',
  'quick-order': 'Калькулятор',
  'sticky-contact': 'Липка форма',
  'sticky-widget': 'Віджет «Зв’язок з нами»',
  'lead': 'Форма',
};

async function handlePost(context: any): Promise<Response> {
  const { request, env } = context;
  const rawEnv = env || {};

  // Missing env
  if (!rawEnv.TELEGRAM_BOT_TOKEN || !rawEnv.TELEGRAM_CHAT_ID) {
    const missing = !rawEnv.TELEGRAM_BOT_TOKEN ? 'TELEGRAM_BOT_TOKEN' : 'TELEGRAM_CHAT_ID';
    console.error('Missing env var:', missing);
    return json({ ok: false, code: 'config' }, 500);
  }

  // Origin protection
  if (!isAllowedOrigin(request, rawEnv)) {
    return json({ ok: false, code: 'forbidden' }, 403);
  }

  // Content-Type
  const ct = request.headers.get('content-type') || '';
  if (!ct.includes('application/json')) {
    return json({ ok: false, code: 'content_type' }, 415);
  }

  // Body size
  let bodyText = '';
  try {
    bodyText = await request.text();
  } catch {
    return json({ ok: false, code: 'bad_request' }, 400);
  }
  if (bodyText.length > 16 * 1024) {
    return json({ ok: false, code: 'too_large' }, 413);
  }

  let data: LeadData;
  try {
    data = JSON.parse(bodyText || '{}');
  } catch {
    return json({ ok: false, code: 'validation', fields: { contact: 'Невірний формат даних' } }, 400);
  }
  if (typeof data !== 'object' || data === null) {
    return json({ ok: false, code: 'validation', fields: {} }, 400);
  }

  // Honeypot
  const honey = cleanString(data.website, 200);
  if (honey) {
    console.log('lead_drop', JSON.stringify({ reason: 'honeypot', source: cleanString(data.source, 40), contact: cleanString(data.contact, 254), startedAt: data.formStartedAt, time: new Date().toISOString() }));
    return json({ ok: true }, 200);
  }

  // Time trap
  const started = Number(data.formStartedAt);
  if (started && Number.isFinite(started)) {
    const age = Date.now() - started;
    if (age < 2500) {
      console.log('lead_drop', JSON.stringify({ reason: 'time_trap_fast', source: cleanString(data.source, 40), contact: cleanString(data.contact, 254), ageMs: age, thresholdMs: 2500, time: new Date().toISOString() }));
      return json({ ok: true }, 200); // too fast: silent drop
    }
    if (age > 24 * 60 * 60 * 1000) {
      console.log('lead_drop', JSON.stringify({ reason: 'time_trap_stale', source: cleanString(data.source, 40), contact: cleanString(data.contact, 254), ageMs: age, thresholdMs: 86400000, time: new Date().toISOString() }));
      return json({ ok: false, code: 'validation', fields: {} }, 400);
    }
  }

  // Turnstile (optional)
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '';
  const turnstileToken = cleanString(data['cf-turnstile-response'], 2048);
  const turnstileOk = await verifyTurnstile(rawEnv, turnstileToken, ip);
  if (!turnstileOk) {
    console.log('lead_drop', JSON.stringify({ reason: 'turnstile_failed', source, ip, time: new Date().toISOString() }));
    return json({ ok: false, code: 'spam', fields: {} }, 400);
  }

  // Map fields
  const source = cleanString(data.source, 40) || 'lead';
  const name = cleanString(data.name, 80);
  const workType = cleanString(data.workType, 200);
  const direction = cleanString(data.direction, 200);
  const topic = cleanString(data.topic, 200);
  const comment = cleanString(data.comment, 1000);
  const pageUrl = cleanString(data.pageUrl, 200);
  const rawContact = cleanString(data.contact, 254);
  const pagesRaw = data.pages;
  const pages = (typeof pagesRaw === 'number' && Number.isInteger(pagesRaw) && pagesRaw >= 10 && pagesRaw <= 300) ? pagesRaw : undefined;
  const deadline = cleanString(data.deadline, 60) || undefined;
  const estimatedPrice = cleanString(data.estimatedPrice, 40) || undefined;

  // normalize utm
  const utmRaw = (data.utm && typeof data.utm === 'object') ? (data.utm as Record<string, unknown>) : {};
  const utm: Record<string, string> = {};
  for (const k of ['utm_source','utm_medium','utm_campaign','utm_term','utm_content']) {
    utm[k] = cleanString(utmRaw[k], 80);
  }
  // accept shorter keys too
  if (!utm.utm_source) utm.utm_source = cleanString(utmRaw.source, 80);

  const contact = normalizeContact(rawContact);

  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = 'Вкажи імʼя';
  if (!contact) fields.contact = 'Вкажи Telegram, телефон або email';
  if (data.consent !== true) fields.consent = 'Підтверди згоду на обробку даних';

  if (Object.keys(fields).length > 0) {
    console.log('lead_drop', JSON.stringify({ reason: 'validation_failed', source, fields, time: new Date().toISOString() }));
    return json({ ok: false, code: 'validation', fields }, 400);
  }

  // Link/repeat guard
  const textForLinks = `${topic} ${comment}`;
  const linkCount = countUrls(textForLinks);
  if (linkCount > 3) {
    console.log('lead_drop', JSON.stringify({ reason: 'too_many_links', source, contactType: contact!.type, contact, linkCount, threshold: 3, time: new Date().toISOString() }));
    return json({ ok: true }, 200);
  }

  // Consent field aliases
  const consent = data.consent === true;

  // deadline check: if provided, just string, already capped

  const sourceLabel = SOURCE_LABELS[source] || 'Форма';

  const payload: Record<string, unknown> = {
    name, contact: contact!.value, contactType: contact!.type, workType, direction, topic, pages, deadline, estimatedPrice, comment, pageUrl, utm,
  };

  const text = buildMessage(payload, sourceLabel);

  const keyboard = contact!.type === 'telegram' ? {
    inline_keyboard: [[{ text: 'Відповісти в Telegram', url: `https://t.me/${contact!.value.replace(/^@/, '')}` }]],
  } : undefined;

  if (rawEnv.DRY_RUN === '1') {
    return json({ ok: true, dryRun: true }, 200);
  }

  const result = await attemptSend(rawEnv, text, keyboard);
  if (result.ok) {
    console.log('lead_accepted', JSON.stringify({ source, contactType: contact!.type, contact, time: new Date().toISOString() }));
    return json({ ok: true }, 200);
  }

  console.error('telegram_error', result.status, result.description);
  return json({ ok: false, code: 'telegram', reason: 'telegram_failed' }, 502);
}

export async function onRequest(context: any): Promise<Response> {
  try {
    const { request } = context;
    const method = request.method.toUpperCase();

    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
          'X-Robots-Tag': 'noindex',
        },
      });
    }

    if (method !== 'POST') {
      return json({ ok: false, code: 'method_not_allowed' }, 405, { Allow: 'POST' });
    }

    return await handlePost(context);
  } catch (e) {
    console.error('lead_function_error', (e as Error)?.message);
    return json({ ok: false, code: 'server_error' }, 500);
  }
}