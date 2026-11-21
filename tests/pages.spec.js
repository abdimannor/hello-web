// Every page loads cleanly and passes axe-core.
const { test, expect } = require('@playwright/test');
const { watch, axe } = require('./helpers');

for (const file of ['index.html', 'original.html', 'anatomi.html']) {
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

test('the original exercise lives on original.html, verbatim, and is framed on the lesson page', async ({ page }) => {
  await page.goto('original.html');
  await expect(page.locator('h1')).toHaveText('Hej och välkommen, detta är en stor rubrik');
  await expect(page.locator('.red')).toHaveText('Hur gör man när man vill ha 2 olika rader med vanlig löpande text, där andra raden är röd?');
  await expect(page.locator('.kitten figcaption')).toContainText('Comic Sans Ms');
  await page.goto('index.html');
  const frame = page.frameLocator('.browser iframe');
  await expect(frame.locator('h1')).toHaveText('Hej och välkommen, detta är en stor rubrik');
  await expect(frame.locator('.course-bar')).toHaveCount(0);
  await page.getByRole('link', { name: /Öppna originalet/ }).click();
  await expect(page).toHaveURL(/original\.html$/);
});

test('the lesson page is a lesson: hero, goals, try-it task and next lesson', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('h1')).toContainText(/din första HTML.sida/);
  await expect(page.locator('.goals li')).toHaveCount(3);
  await expect(page.getByRole('heading', { name: 'Laga min första sida' })).toBeVisible();
  await expect(page.locator('.course-next a')).toContainText('Tech World');
});
