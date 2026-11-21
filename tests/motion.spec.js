// Motion is on by default, even with Reduce motion on; the quiet button turns it off and the choice is kept.
const { test, expect } = require('@playwright/test');

test.use({ contextOptions: { reducedMotion: 'reduce' } });

const entrance = (page) => page.evaluate(() => getComputedStyle(document.querySelector('h1')).animationName);
const running = (page) => page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && !(a instanceof CSSTransition)).length);

test('lesson page moves by default and the motion button stops it across reloads', async ({ page }) => {
  await page.goto('index.html');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  expect(await entrance(page)).toBe('course-rise');
  const btn = page.getByRole('button', { name: 'Pausa rörelse' });
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveAttribute('title', 'Pausa rörelse');

  await btn.click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.getByRole('button', { name: 'Starta rörelse' })).toHaveAttribute('aria-pressed', 'false');

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  expect(await entrance(page)).toBe('none');
  expect(await running(page)).toBe(0);
  await page.getByRole('button', { name: 'Starta rörelse' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
});

test('anatomy rows animate by default and are still once motion is paused', async ({ page }) => {
  await page.goto('anatomi.html');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByRole('button', { name: 'Semantisk version' }).click();
  expect(await running(page)).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Pausa rörelse' }).click();
  await page.getByRole('button', { name: /^2023/ }).click();
  expect(await running(page)).toBe(0);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
});

test('the course bar has no text pill: an icon button with a name only', async ({ page }) => {
  await page.goto('index.html');
  const btn = page.locator('.course-motion');
  await expect(btn).toHaveText('');
  const box = await btn.boundingBox();
  expect(Math.round(box.width)).toBe(34);
  expect(Math.round(box.height)).toBe(34);
  await expect(page.locator('.course-bar [aria-current="page"]')).toContainText('Hello Web');
});
