type ContactResult = { type: string; value: string } | null;

const sourceLabels: Record<string, string> = {
  contact: 'Форма на сторінці',
  'quick-order': 'Калькулятор',
  'sticky-contact': 'Липка форма',
  lead: 'Форма',
};

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

function ensureHidden(form: HTMLFormElement, name: string, value = ''): HTMLInputElement {
  let el = form.querySelector<HTMLInputElement>(`input[name="${name}"]`);
  if (!el) {
    el = document.createElement('input');
    el.type = 'hidden';
    el.name = name;
    el.value = value;
    form.appendChild(el);
  }
  return el;
}

function closestStatus(form: HTMLFormElement): HTMLElement {
  let el = form.querySelector<HTMLElement>('.form-status');
  if (!el) {
    el = document.createElement('div');
    el.className = 'form-status';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    form.appendChild(el);
  }
  return el;
}

function setError(form: HTMLFormElement, field: string, msg: string) {
  const el = form.querySelector<HTMLElement>(`[data-err="${field}"]`);
  if (el) el.textContent = msg;
  const input = form.querySelector<HTMLElement>(`[name="${field}"]`);
  if (input) input.setAttribute('aria-invalid', 'true');
  if (field === 'consent') {
    const consentInput = form.querySelector<HTMLElement>('input[name="consent"], input[name="qo_consent"]');
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
    else if (form.id === 'stickyForm') source = 'sticky-contact';
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

  const consentEl = form.querySelector<HTMLInputElement>('input[name="consent"]') || form.querySelector<HTMLInputElement>('input[name="qo_consent"]');
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
    formStartedAt: Number(form.querySelector<HTMLInputElement>('input[name="formStartedAt"]')?.value || Date.now()),
    website: form.querySelector<HTMLInputElement>('input[name="website"]')?.value || '',
    consent,
  };

  let firstInvalid = '';
  let ok = true;
  if (nameField.length < 2) {
    setError(form, 'name', 'Вкажи імʼя');
    ok = false;
    if (!firstInvalid) firstInvalid = 'name';
  }
  const contactRes = validateContact(contactRaw);
  if (!contactRes) {
    setError(form, 'contact', 'Вкажи Telegram, телефон або email');
    ok = false;
    if (!firstInvalid) firstInvalid = 'contact';
  } else {
    payload.contactType = contactRes.type;
  }
  if (!consent) {
    setError(form, 'consent', 'Підтверди згоду на обробку даних');
    ok = false;
    if (!firstInvalid) firstInvalid = 'consent';
  }

  if (!ok) return { ok: false, firstInvalid };

  payload.contact = contactRes!.value;
  return { ok: true, payload, firstInvalid: '' };
}

async function submitForm(form: HTMLFormElement) {
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"], .submit-btn');
  const status = closestStatus(form);
  const result = collectPayload(form);
  if (!result.ok) {
    if (result.firstInvalid) {
      const field = form.querySelector<HTMLElement>(`[name="${result.firstInvalid}"]`);
      field?.focus();
    }
    return;
  }
  const payload = result.payload!;
  if (btn) {
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');
    btn.textContent = 'Надсилаємо…';
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
    if (res.ok && json.ok) {
      status.textContent = 'Дякуємо! Ми зв’яжемося з тобою найближчим часом.';
      form.reset();
      const ts = form.querySelector<HTMLInputElement>('input[name="formStartedAt"]');
      if (ts) ts.value = String(Date.now());
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
        status.textContent = 'Не вдалося надіслати заявку. Спробуй ще раз або напиши нам у Telegram.';
      } else {
        status.textContent = 'Перевір заповнення полів.';
      }
    }
  } catch {
    clearTimeout(timer);
    status.textContent = 'Не вдалося надіслати заявку. Спробуй ще раз або напиши нам у Telegram.';
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
      btn.textContent = (btn as HTMLButtonElement).dataset.label || 'Відправити заявку';
    }
  }
}

function syncConsent(form: HTMLFormElement) {
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"], input[name="qo_consent"]');
  const btn = form.querySelector<HTMLButtonElement>('button[type="submit"], .submit-btn');
  const hint = form.querySelector<HTMLElement>('[data-consent-hint]');
  const checked = !!consent?.checked;
  if (btn) btn.disabled = !checked;
  if (hint) hint.style.display = checked ? 'none' : '';
}

function initForm(form: HTMLFormElement) {
  if (form.dataset.leadBound === '1') return;
  form.dataset.leadBound = '1';

  const hp = document.createElement('input');
  hp.type = 'text';
  hp.name = 'website';
  hp.tabIndex = -1;
  hp.autocomplete = 'off';
  hp.setAttribute('aria-hidden', 'true');
  hp.style.position = 'absolute';
  hp.style.left = '-9999px';
  hp.style.width = '1px';
  hp.style.height = '1px';
  hp.style.overflow = 'hidden';
  form.appendChild(hp);

  const ts = document.createElement('input');
  ts.type = 'hidden';
  ts.name = 'formStartedAt';
  ts.value = String(Date.now());
  form.appendChild(ts);

  syncConsent(form);
  const consent = form.querySelector<HTMLInputElement>('input[name="consent"], input[name="qo_consent"]');
  consent?.addEventListener('change', () => syncConsent(form));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors(form);
    submitForm(form);
  });
}

export function initLeadForms() {
  const forms = Array.from(document.querySelectorAll<HTMLFormElement>('[data-lead-form], [data-qo], #stickyForm'));
  forms.forEach(initForm);
}
