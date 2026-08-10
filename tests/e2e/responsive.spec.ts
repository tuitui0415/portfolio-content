import { expect, test } from '@playwright/test';

for (const path of ['/zh/', '/en/about/', '/zh/journey/', '/en/projects/rhythm-watershed/']) {
  test(`mobile ${path} does not overflow the viewport`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/portfolio-content${path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  });
}

test('reduced motion selection skips auto-travel', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/portfolio-content/en/journey/');
  await page.getByRole('button', { name: /Rhythm Watershed/ }).click();
  await expect(page.locator('[data-active-title]')).toHaveText('Rhythm Watershed');
  await expect.poll(async () => Number(await page.locator('[data-journey-root]').getAttribute('data-player-x'))).toBeGreaterThan(5000);
});
