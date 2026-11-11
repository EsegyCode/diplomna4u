type ContactResult = { type: string; value: string } | null;

function clean(v: unknown): string {
  if (typeof v !== 'string') return '';
  return v.replace(/[\u0000-\u001F\u007F]/g, '').replace(/\s+/g, ' ').trim();
}

function validateContact(raw: string): ContactResult {
  const v = clean(raw);
  if (!v) return null;
  const tgUrl = v.match(/^https?:\/\/t\.me\/([A-Za-z][A-Za-z0-9_]{4,31})\/?$/i);
  if (tgUrl) return { type: 'telegram', value: '@' + tgUrl[1] };
  if (/^@[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)) return { type: 'telegram', value: v };
  if (/^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(v)) return { type: 'telegram', value: '@' + v };
  if (v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
    return { type: 'email', value: v.toLowerCase() };
  }
  const digits = v.replace(/[^\d]/g, '');
  if (digits.length >= 9 && digits.length <= 15) {
    return { type: 'phone', value: '+' + digits };
  }
  return null;
}

function readUtm(): Record<string, string> {
  try {
    const stored = sessionStorage.getItem('lead_utm');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return {};
}

function persistUtm(params: Record<string, string>) {
  try {
    if (!sessionStorage.getItem('lead_utm')) {
      sessionStorage.setItem('lead_utm', JSON.stringify(params));
    }
  } catch { /* ignore */ }
}

function collectUtm(): Record<string, string> {
  const params: Record<string, string> = {};
  try {
    const sp = new URLSearchParams(location.search);
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const val = sp.get(k);
      if (val) params[k] = val;
    }
  } catch { /* ignore */ }
  const first = readUtm();
  if (Object.keys(first).length > 0) return first;
  persistUtm(params);
  return params;
}

function closestStatus(form: HTMLFormElement): HTMLElement {
  let el = form.querySelector<HTMLElement>('.form-status, [data-qo-status]');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-status';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    form.appendChild(el);
  } else if (!el.hasAttribute('aria-live')) {
    el.setAttribute('aria-live', 'polite');
  }
  if (!el.hasAttribute('role')) el.setAttribute('role', 'status');
  return el;
}

function setError(form: HTMLFormElement, field: string, msg: string) {
  const el = form.querySelector<HTMLElement>(`[data-err="${field}"]`);
  if (el) el.textContent = msg;
  let input: HTMLElement | null = null;
  if (field === 'work_type') {
    input = form.querySelector<HTMLElement>('[name="work_type"], [name="workType"], [data-qo-worktype]');
  } else {
    input = form.querySelector<HTMLElement>(`[name="${field}"]`);
  }
  if (input) input.setAttribute('aria-invalid', 'true');
  if (field === 'consent') {
    const consentInput = form.querySelector<HTMLElement>('input[name="consent"], input[name="qo_consent"], [data-qo-consent]');
    consentInput?.setAttribute('aria-invalid', 'true');
  }
}

function clearErrors(form: HTMLFormElement) {
  form.querySelectorAll('.field-error').forEach(e => e.textContent = '');
  form.querySelectorAll('[aria-invalid="true"]').forEach(e => e.removeAttribute('aria-invalid'));
}

function collectPayload(form: HTMLFormElement): { ok: boolean; payload?: Record<string, unknown>; firstInvalid?: string } {
  const sourceHidden = form.querySelector<HTMLInputElement>('input[name="source"]');
  let source = sourceHidden?.value?.trim() || '';
  if (!source) {
    if (form.hasAttribute('data-qo')) source = 'quick-order';
    else if (form.id === 'stickyForm') source = 'sticky-widget';
    else source = 'contact';
  }

  const qName = form.querySelector<HTMLInputElement>('[data-qo-name]')?.value?.trim();
  const nameField = qName || form.querySelector<HTMLInputElement>('input[name="name"]')?.value?.trim() || '';

  const qContact = form.querySelector<HTMLInputElement>('[data-qo-contact]')?.value?.trim();
  const contactRaw = qContact || form.querySelector<HTMLInputElement>('input[name="contact"]')?.value?.trim()
    || form.querySelector<HTMLInputElement>('input[name="phone"]')?.value?.trim() || '';

  const workType = form.querySelector<HTMLSelectElement>('[data-qo-worktype]')?.value?.trim()
    || form.querySelector<HTMLSelectElement>('select[name="work_type"]')?.value?.trim()
    || form.querySelector<HTMLSelectElement>('select[name="workType"]')?.value?.trim() || '';

  const comment = form.querySelector<HTMLTextAreaElement>('[data-qo-comment]')?.value?.trim()
    || form.querySelector<HTMLTextAreaElement>('textarea[name="comment"]')?.value?.trim() || '';

  const consentEl = form.querySelector<HTMLInputElement>('input[name="consent"]') || form.querySelector<HTMLInputElement>('input[name="qo_consent"]') || form.querySelector<HTMLInputElement>('[data-qo-consent]');
  const consent = !!consentEl?.checked;

  const calcRaw = form.querySelector<HTMLInputElement>('input[name="calc_payload"]')?.value || '';
  let calc: Record<string, any> = {};
  if (calcRaw) {
    try { calc = JSON.parse(calcRaw); } catch { calc = {}; }
  }

  const payload: Record<string, unknown> = {
    source,
    name: nameField,
    contact: contactRaw,
    workType: workType || calc.workType || '',
    direction: clean(calc.specialty || calc.direction || ''),
    topic: clean((form.querySelector('input[name="topic"]') as HTMLInputElement | null)?.value || calc.topic || ''),
    pages: (typeof calc.pagesFrom !== 'undefined' && calc.pagesFrom) ? Number(calc.pagesFrom) : undefined,
    deadline: calc.deadline || '',
    estimatedPrice: calc.price ? String(calc.price) : '',
    comment,
    pageUrl: location.pathname,
    utm: collectUtm(),
    formStartedAt: (form.querySelector<HTMLInputElement>('input[name="formStartedAt"]')?.value || '').trim() ? Number(form.querySelector<HTMLInputElement>('input[name="formStartedAt"]')!.value) : undefined,
    hp_trap_x7: form.querySelector<HTMLInputElement>('input[name="hp_trap_x7"]')?.value || form.querySelector<HTMLInputElement>('input[name="hp"]')?.value || '',
    website: form.querySelector<HTMLInputElement>('input[name="website"]')?.value || '',
    consent,
  };

  let firstInvalid = '';
  let ok = true;
  if (nameField.length < 2) {
    setError(form, 'name', 'Р’РєР°Р¶Рё С–РјКјСЏ');
    ok = false;
    if (!firstInvalid) firstInvalid = 'name';
  }
  const contactRes = validateContact(contactRaw);
  if (!contactRes) {
    setError(form, 'contact', 'Р’РєР°Р¶Рё Telegram, С‚РµР»РµС„РѕРЅ Р°Р±Рѕ email');
    ok = false;
    if (!firstInvalid) firstInvalid = 'contact';
  } else {
    payload.contactType = contactRes.type;
  }

  const hasWorkTypeField = !!form.querySelector('select[name="work_type"], select[name="workType"], [data-qo-worktype]');
  const resolvedWorkType = String(payload.workType || '');
  if (hasWorkTypeField && !resolvedWorkType.trim()) {
    setError(form, 'work_type', 'РћР±РµСЂС–С‚СЊ С‚РёРї СЂРѕР±РѕС‚Рё');
    ok = false;
    if (!firstInvalid) firstInvalid = 'work_type';
  }

  if (!consent) {
    setError(form, 'consent', 'РџС–РґС‚РІРµСЂРґРё Р·РіРѕРґСѓ РЅР° РѕР±СЂРѕР±РєСѓ РґР°РЅРёС…');
    ok = false;
    if (!firstInvalid) firstInvalid = 'consent';
  }

  if (!ok) return { ok: false, firstInvalid };

  payload.contact = contactRes!.value;
  return { ok: true, payload, firstInvalid: '' };
}

const COOLDOWN_MS = 15000;
const COOLDOWN_KEY = 'lead_cooldown_until';

function cooldownUntil(): number {
  try { return Number(localStorage.getItem(COOLDOWN_KEY) || '0'); } catch { return 0; }
}

function setCooldown(ms = COOLDOWN_MS) {
  const until = Date.now() + Math.max(1000, ms);
  try { localStorage.setItem(COOLDOWN_KEY, String(until)); } catch { /* ignore */ }
  syncAllForms();
  scheduleCooldownSync();
  startCooldownTicker();
}

function cooldownActive(): boolean {
  return Date.now() < cooldownUntil();
}

function cooldownRemainingSec(): number {
  const ms = cooldownUntil() - Date.now();
  return ms > 0 ? Math.ceil(ms / 1000) : 0;
}

function parseRetryAfter(res: Response): number {
  const h = res.headers.get('Retry-After');
  if (!h) return COOLDOWN_MS;
  const sec = Number(h);
  if (Number.isFinite(sec) && sec > 0) return sec * 1000;
  const date = Date.parse(h);
  if (!isNaN(date)) {
    const ms = date - Date.now();
    if (ms > 0) return ms;
  }
  return COOLDOWN_MS;
}

const boundForms: HTMLFormElement[] = [];

let cooldownTicker: number | null = null;

function startCooldownTicker() {
  if (cooldownTicker !== null) return;
  cooldownTicker = window.setInterval(() => {
    syncAllForms();
    if (!cooldownActive()) {
      if (cooldownTicker !== null) {
        window.clearInterval(cooldownTicker);
        cooldownTicker = null;
      }
      syncAllForms();
    }
  }, 1000);
}

function syncAllForms() {
  boundForms.forEach((f) => syncConsent(f));
}

function scheduleCooldownSync() {
  const delay = cooldownUntil() - Date.now();
  if (delay > 0) {
    window.setTimeout(() => {
      syncAllForms();
      const rest = cooldownUntil() - Date.now();
      if (rest > 0) scheduleCooldownSync();
    }, delay + 50);
  }
}

function syncConsent(form: HTMLFormElement) {
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"], input[name="qo_consent"], [data-qo-consent]');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"], .submit-btn');
  const hint = form.querySelector<HTMLElement>('[data-consent-hint]');
  const checked = !!consent?.checked;
  const cd = cooldownActive();
  const disabled = !checked || cd;
  if (btn) {
    // Keep HTML disabled only for cooldown/hard-block; consent-only uses aria-disabled
    // so the control stays focusable and can surface validation on activation attempts.
    btn.disabled = cd;
    btn.setAttribute('aria-disabled', disabled ? 'true' : 'false');
  }
  if (hint) {
    if (!checked) {
      hint.textContent = 'РџРѕСЃС‚Р°РІ РіР°Р»РѕС‡РєСѓ Р·РіРѕРґРё, С‰РѕР± РЅР°РґС–СЃР»Р°С‚Рё Р·Р°СЏРІРєСѓ.';
      hint.style.display = '';
    } else if (cd) {
      const sec = cooldownRemainingSec();
      hint.textContent = sec > 0
        ? `РџРѕРІС‚РѕСЂРЅРѕ РјРѕР¶РЅР° РЅР°РґС–СЃР»Р°С‚Рё С‡РµСЂРµР· ${sec} СЃ.`
        : 'Р—Р°С‡РµРєР°Р№ РїРµСЂРµРґ РЅР°СЃС‚СѓРїРЅРѕСЋ Р·Р°СЏРІРєРѕСЋ.';
      hint.style.display = '';
    } else {
      hint.style.display = 'none';
    }
  }
  const status = form.querySelector<HTMLElement>('.form-status, [data-qo-status]');
  if (status && !status.hasAttribute('aria-live')) status.setAttribute('aria-live', 'polite');
}

async function submitForm(form: HTMLFormElement) {
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"], .submit-btn');
  const status = closestStatus(form);
  const result = collectPayload(form);
  if (!result.ok) {
    if (result.firstInvalid) {
      let field: HTMLElement | null = null;
      if (result.firstInvalid === 'work_type') {
        field = form.querySelector<HTMLElement>('[name="work_type"], [name="workType"], [data-qo-worktype]');
      } else {
        field = form.querySelector<HTMLElement>(`[name="${result.firstInvalid}"], [data-err="${result.firstInvalid}"]`);
      }
      field?.focus?.();
    }
    return;
  }
  const payload = result.payload!;

  if (btn) {
    if (!btn.dataset.originalLabel) {
      btn.dataset.originalLabel = btn.textContent?.trim() || btn.dataset.label || 'Р’С–РґРїСЂР°РІРёС‚Рё Р·Р°СЏРІРєСѓ';
    }
    btn.disabled = true;
    btn.setAttribute('aria-disabled', 'true');
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'РќР°РґСЃРёР»Р°С”РјРѕвЂ¦';
  }
  status.textContent = '';

  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 12000);
  try {
    const res = await fetch('/api/lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timer);
    const json = await res.json().catch(() => ({}));
    if (res.status === 429) {
      status.textContent = 'Р—Р°Р±Р°РіР°С‚Рѕ СЃРїСЂРѕР±, СЃРїСЂРѕР±СѓР№С‚Рµ РїС–Р·РЅС–С€Рµ';
      setCooldown(parseRetryAfter(res));
    } else if (res.ok && json.ok) {
      status.textContent = 'Р”СЏРєСѓС”РјРѕ! РњРё Р·РІвЂ™СЏР¶РµРјРѕСЃСЏ Р· С‚РѕР±РѕСЋ РЅР°Р№Р±Р»РёР¶С‡РёРј С‡Р°СЃРѕРј.';
      setCooldown();
      form.reset();
      const ts = form.querySelector<HTMLInputElement>('input[name="formStartedAt"]');
      if (ts) ts.value = '';
      const consentHint = form.querySelector<HTMLElement>('[data-consent-hint]');
      if (consentHint) consentHint.style.display = '';
      if ((form as any).dataset.redirect === 'thanks') {
        location.href = '/dyakuemo/';
      }
    } else {
      if (json.fields && typeof json.fields === 'object') {
        for (const [k, v] of Object.entries(json.fields)) {
          const el = form.querySelector<HTMLElement>(`[data-err="${k}"]`);
          if (el) el.textContent = String(v);
        }
      }
      if (res.status >= 500) {
        status.textContent = 'РќРµ РІРґР°Р»РѕСЃСЏ РЅР°РґС–СЃР»Р°С‚Рё Р·Р°СЏРІРєСѓ. РЎРїСЂРѕР±СѓР№ С‰Рµ СЂР°Р· Р°Р±Рѕ РЅР°РїРёС€Рё РЅР°Рј Сѓ Telegram.';
      } else {
        status.textContent = 'РџРµСЂРµРІС–СЂ Р·Р°РїРѕРІРЅРµРЅРЅСЏ РїРѕР»С–РІ.';
      }
    }
  } catch {
    clearTimeout(timer);
    status.textContent = 'РќРµ РІРґР°Р»РѕСЃСЏ РЅР°РґС–СЃР»Р°С‚Рё Р·Р°СЏРІРєСѓ. РЎРїСЂРѕР±СѓР№ С‰Рµ СЂР°Р· Р°Р±Рѕ РЅР°РїРёС€Рё РЅР°Рј Сѓ Telegram.';
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      const restore = btn.dataset.originalLabel || btn.dataset.label || 'Р’С–РґРїСЂР°РІРёС‚Рё Р·Р°СЏРІРєСѓ';
      btn.textContent = restore;
    }
    syncAllForms();
    scheduleCooldownSync();
  }
}

function markFormStarted(form: HTMLFormElement) {
  const ts = form.querySelector<HTMLInputElement>('input[name="formStartedAt"]');
  if (ts && !ts.value) ts.value = String(Date.now());
}

function initForm(form: HTMLFormElement) {
  if (form.dataset.leadBound === '1') return;
  form.dataset.leadBound = '1';
  boundForms.push(form);

  const hp = form.querySelector<HTMLInputElement>('input[name="hp_trap_x7"], input[name="website"], input[name="hp"]') || document.createElement('input');
  if (!hp.parentNode) form.appendChild(hp);
  hp.type = 'text';
  hp.name = 'hp_trap_x7';
  hp.tabIndex = -1;
  hp.autocomplete = 'off';
  hp.setAttribute('aria-hidden', 'true');
  hp.style.position = 'absolute';
  hp.style.left = '-9999px';
  hp.style.width = '1px';
  hp.style.height = '1px';
  hp.style.overflow = 'hidden';

  // Set formStartedAt on first focus in any field.
  const fieldEls = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input:not([type="hidden"]), select, textarea'));
  for (const el of fieldEls) {
    el.addEventListener('focus', () => markFormStarted(form), { once: true });
  }

  let ts = form.querySelector<HTMLInputElement>('input[name="formStartedAt"]');
  if (!ts) {
    ts = document.createElement('input');
    ts.type = 'hidden';
    ts.name = 'formStartedAt';
    form.appendChild(ts);
  }
  if (!ts.value) ts.value = '';

  syncConsent(form);
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"], input[name="qo_consent"], [data-qo-consent]');
  consent?.addEventListener('change', () => {
    syncConsent(form);
    syncAllForms();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    submitForm(form);
  });
}

export function initLeadForms() {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('[data-lead-form], [data-qo], #stickyForm'));
  forms.forEach(initForm);
  syncAllForms();
  scheduleCooldownSync();
  if (cooldownActive()) startCooldownTicker();
  window.addEventListener('storage', (e) => {
    if (e.key === COOLDOWN_KEY) {
      syncAllForms();
      scheduleCooldownSync();
      if (cooldownActive()) startCooldownTicker();
    }
  });
}
