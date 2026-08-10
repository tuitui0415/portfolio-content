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

test('the no-script chronological list exposes every project', async ({ page }) => {
  await page.goto('/portfolio-content/zh/journey/');
  await expect(page.locator('.journey-fallback li')).toHaveCount(15);
});
