// The anatomy views are computed from the source and change with the toggle.
const { test, expect } = require('@playwright/test');

test('2023 view: skipped headings, no landmarks, unnamed image', async ({ page }) => {
  await page.goto('anatomi.html');
  const root = page.locator('#anatomy');
  await expect(root).toHaveAttribute('data-version', '2023');
  await expect(page.locator('#ana-source')).toContainText('<center><h5>');
  await expect(page.locator('#ana-dom .dom-tag', { hasText: /^center$/ })).toHaveCount(1);
  await expect(page.locator('#ana-outline .out-lvl')).toHaveText(['h1', 'h3', 'h5']);
  await expect(page.locator('#ana-outline .is-skip')).toHaveCount(2);
  await expect(page.locator('#ana-landmarks')).toContainText('Inga landmärken');
  await expect(page.locator('#ana-sr')).toContainText('bild, inget namn (kanske läses filnamnet: katt.jpg)');
  await expect(page.locator('#ana-sr')).toContainText('rubrik nivå 3, Ibland vill man ha en mellanstor rubrik');
  await expect(page.locator('#ana-sr li').first()).toContainText('språk okänt');
});

test('semantic view: ordered headings, a main landmark, named image', async ({ page }) => {
  await page.goto('anatomi.html');
  const btn = page.getByRole('button', { name: 'Semantisk version' });
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#anatomy')).toHaveAttribute('data-version', 'semantic');
  await expect(page.locator('#ana-outline .out-lvl')).toHaveText(['h1', 'h2', 'h3']);
  await expect(page.locator('#ana-outline .is-skip')).toHaveCount(0);
  await expect(page.locator('#ana-landmarks .lm-role')).toHaveText(['main']);
  await expect(page.locator('#ana-sr')).toContainText('landmärke huvudinnehåll');
  await expect(page.locator('#ana-sr')).toContainText('bild, En liten kattunge som tittar in i kameran');
  await expect(page.locator('#ana-sr')).toContainText('figur, Ibland vill man bara titta');
  await expect(page.locator('#ana-dom .dom-tag', { hasText: /^center$/ })).toHaveCount(0);
  await expect(page.locator('#ana-status')).toContainText('semantiska');
  await page.getByRole('button', { name: /^2023/ }).click();
  await expect(page.locator('#ana-outline .is-skip')).toHaveCount(2);
});

test('the 2023 source shown is the original from lab.js, unchanged', async ({ page }) => {
  await page.goto('anatomi.html');
  const same = await page.evaluate(() => document.getElementById('ana-source').textContent === window.HELLO_ORIGINAL.replace(/\t/g, '  '));
  expect(same).toBe(true);
});
