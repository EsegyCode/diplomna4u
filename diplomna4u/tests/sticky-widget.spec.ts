import { expect, test } from '@playwright/test';

async function openWidget(page: any) {
  const mobile = page.locator('#stickyMobileOpen');
  if (await mobile.isVisible()) {
    await mobile.click();
  } else {
    await page.locator('#stickyToggle').click();
  }
  await expect(page.locator('#stickyPanel')).not.toHaveAttribute('hidden');
}

async function fillValid(page: any) {
  await page.fill('#stickyForm input[name="name"]', 'Тест');
  await page.fill('#stickyForm input[name="contact"]', '+380501234567');
  await page.selectOption('#stickyForm select[name="work_type"]', { index: 1 });
  await page.check('#stickyForm input[name="consent"]');
}

test('opens and closes, button uncovered', async ({ page }) => {
  await page.goto('/');
  await openWidget(page);
  const submit = page.locator('#stickyForm button[type="submit"]');
  const box = await submit.boundingBox();
  expect(box).not.toBeNull();
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  const tag = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.tagName?.toLowerCase() ?? null, [cx, cy]);
  expect(tag).toBe('button');
  await page.locator('#stickyClose').click();
  await expect(page.locator('#stickyPanel')).toHaveAttribute('hidden');
});

test('empty submit shows validation and sends no request', async ({ page }) => {
  await page.goto('/');
  await openWidget(page);
  let requested = false;
  page.on('request', (r: any) => {
    if (r.url().includes('/api/lead')) requested = true;
  });
  const submit = page.locator('#stickyForm button[type="submit"]');
  await submit.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  expect(requested).toBe(false);
  await expect(page.locator('#stickyForm span[data-err="name"]')).not.toBeEmpty();
  await expect(page.locator('#stickyForm span[data-err="contact"]')).not.toBeEmpty();
  await expect(page.locator('#stickyForm span[data-err="consent"]')).not.toBeEmpty();

  // Space also does not send a request when disabled/empty
  await page.locator('#stickyForm input[name="name"]').fill('x');
  // ensure consent unchecked; button disabled, but try clicking submit via Space on the button
  await submit.focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
  expect(requested).toBe(false);
});

test('valid submit posts to /api/lead and succeeds', async ({ page }) => {
  await page.goto('/');
  await openWidget(page);
  await fillValid(page);
  await page.waitForTimeout(3100);
  const reqPromise = page.waitForRequest((r: any) => r.url().includes('/api/lead') && r.method() === 'POST');
  await page.locator('#stickyForm button[type="submit"]').click();
  const req = await reqPromise;
  const payload = req.postDataJSON();
  expect(payload.source).toBe('sticky-widget');
  expect(payload.name).toBe('Тест');
  expect(payload.contact).toMatch(/^\+/);
  expect(payload.workType).toBeTruthy();
  expect(payload.consent).toBe(true);
  expect(payload.pageUrl).toBeTruthy();
  const response = await req.response();
  expect(response?.status()).toBe(200);
  const json = await response?.json();
  expect(json.ok).toBe(true);
  await expect(page.locator('#stickyForm .form-status')).toContainText('Дякуємо');
  await expect(page.locator('#stickyForm input[name="name"]')).toHaveValue('');
});

test.describe('cooldown', () => {
  test('home submission disables widget button for cooldown, then works', async ({ page }) => {
    await page.goto('/');
    const homeForm = page.locator('[data-lead-form]').first();
    await homeForm.locator('input[name="name"]').fill('Тест');
    await homeForm.locator('input[name="contact"]').fill('@test_user');
    const workSelect = homeForm.locator('select[name="work_type"], select[name="workType"]');
    if (await workSelect.count()) await workSelect.first().selectOption({ index: 1 });
    await homeForm.locator('input[name="consent"]').check();
    await page.waitForTimeout(3100);
    await Promise.all([
      homeForm.locator('button[type="submit"]').click(),
      page.waitForResponse((r: any) => r.url().includes('/api/lead') && r.request().method() === 'POST'),
    ]);
    await openWidget(page);
    const widgetBtn = page.locator('#stickyForm button[type="submit"]');
    await expect(widgetBtn).toBeDisabled();
    await page.waitForTimeout(16000);
    // consent must be checked for button to enable
    await page.locator('#stickyForm input[name="consent"]').check();
    await expect(widgetBtn).toBeEnabled();
  });
});
