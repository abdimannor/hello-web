// Every page loads cleanly and passes axe-core.
const { test, expect } = require('@playwright/test');
const { watch, axe } = require('./helpers');

for (const file of ['index.html', 'anatomi.html']) {
  test(`${file} loads without console errors or failed requests`, async ({ page }) => {
    const problems = watch(page);
    await page.goto(file, { waitUntil: 'networkidle' });
    await expect(page.locator('h1').first()).toBeVisible();
    // The 2023 preview frames are sandboxed on purpose (sandbox=""), and Chrome logs that it blocks scripts there.
    expect(problems.filter((m) => !m.includes('frame is sandboxed'))).toEqual([]);
  });

  test(`${file} has no axe violations`, async ({ page }) => {
    await page.goto(file, { waitUntil: 'networkidle' });
    await axe(page);
  });
}

test('anatomy page has no axe violations in the semantic view', async ({ page }) => {
  await page.goto('anatomi.html', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Semantisk version' }).click();
  await axe(page);
});

test('the lesson page links to the anatomy page', async ({ page }) => {
  await page.goto('index.html');
  await page.getByRole('link', { name: /Öppna anatomin/ }).click();
  await expect(page).toHaveURL(/anatomi\.html$/);
});
