const { chromium } = require('@playwright/test');
const viewports = [375, 530, 768, 1440];
(async () => {
  const browser = await chromium.launch();
  for (const w of viewports) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 } });
    await page.goto('http://localhost:4321/');
    if (await page.locator('#stickyMobileOpen').isVisible().catch(()=>false)) {
      await page.locator('#stickyMobileOpen').click();
    } else {
      await page.locator('#stickyToggle').click();
    }
    await page.waitForTimeout(100);
    const consent = page.locator('#stickyForm .consent').first();
    const cbox = await consent.boundingBox();
    const style = await consent.evaluate(el => {
      const s = getComputedStyle(el);
      return { display: s.display, alignItems: s.alignItems, gap: s.gap };
    });
    const link = await consent.locator('a').boundingBox();
    console.log(`viewport ${w} consent: box=${JSON.stringify(cbox)} link=${JSON.stringify(link)} style=${JSON.stringify(style)}`);
    await page.close();
  }
  await browser.close();
})();
