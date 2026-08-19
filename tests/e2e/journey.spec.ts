import { expect, test } from '@playwright/test';

test('timeline selection activates and opens a project dossier', async ({ page }) => {
  await page.goto('/portfolio-content/en/journey/');
  await page.getByRole('button', { name: /Rhythm Watershed/ }).click();
  await expect(page.locator('[data-active-title]')).toHaveText('Rhythm Watershed');
  await page.getByRole('link', { name: /open project dossier/i }).click();
  await expect(page).toHaveURL(/\/en\/projects\/rhythm-watershed\/$/);
});

test('keyboard movement changes the reported librarian position', async ({ page }) => {
  await page.goto('/portfolio-content/en/journey/');
  const root = page.locator('[data-journey-root]');
  const before = await root.getAttribute('data-player-x');
  await page.keyboard.down('ArrowRight');
  await page.waitForTimeout(350);
  await page.keyboard.up('ArrowRight');
  await expect.poll(() => root.getAttribute('data-player-x')).not.toBe(before);
});

test('the timeline exposes fourteen distinct project records', async ({ page }) => {
  await page.goto('/portfolio-content/zh/journey/');
  await expect(page.locator('.journey-fallback li')).toHaveCount(14);
  await expect(page.locator('.journey-fallback')).not.toContainText('A Room Without Wall');
  await expect(
    page.locator('canvas[aria-label="可操控的像素图书馆，按时间排列 14 个项目"]'),
  ).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', '按时间探索魏允瀚的 14 个项目。');
});
