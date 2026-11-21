// Reduce motion is on: the page is still until the visitor turns motion on, and the choice is kept.
const { test, expect } = require('@playwright/test');

test.use({ contextOptions: { reducedMotion: 'reduce' } });

const running = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);

test('anatomy rows are still by default and animate after the motion switch', async ({ page }) => {
  await page.goto('anatomi.html');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.getByRole('button', { name: 'Semantisk version' }).click();
  expect(await running(page)).toBe(0);

  await page.locator('.course-motion button').click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: /^2023/ }).click();
  expect(await running(page)).toBeGreaterThan(0);

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
});
