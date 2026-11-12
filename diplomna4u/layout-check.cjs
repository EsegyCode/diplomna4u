const { chromium } = require('@playwright/test');
const viewports = [375, 530, 768, 1440];
(async () => {
  const browser = await chromium.launch();
  for (const w of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:4321/');
    const form = page.locator('[data-qo]').first();
    const next = form.locator('[data-next]');
    if (await next.isVisible()) await next.click();
    await page.waitForTimeout(200);
    const btn = form.locator('button[type="submit"]').first();
    const box = await btn.boundingBox();
    const styles = await btn.evaluate(el => {
      const s = getComputedStyle(el);
      return { height: s.height, minHeight: s.minHeight, flex: s.flex, width: s.width, maxHeight: s.maxHeight };
    });
    console.log(`viewport ${w} submit: box=${JSON.stringify(box)} styles=${JSON.stringify(styles)}`);
    const toggleVisible = await page.locator('#stickyToggle').isVisible().catch(() => false);
    if (toggleVisible) {
      await page.locator('#stickyToggle').click();
      await page.waitForTimeout(100);
      const consent = page.locator('#stickyForm .consent').first();
      const cbox = await consent.boundingBox();
      const style = await consent.evaluate(el => {
        const s = getComputedStyle(el);
        return { display: s.display, alignItems: s.alignItems, gap: s.gap, flexWrap: s.flexWrap };
      });
      console.log(`viewport ${w} sticky consent: box=${JSON.stringify(cbox)} style=${JSON.stringify(style)}`);
      await page.locator('#stickyClose').click().catch(() => {});
    }
    await page.close();
  }
  await browser.close();
})();
