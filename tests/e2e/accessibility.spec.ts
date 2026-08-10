import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('key routes have no serious automated accessibility violations', async ({ page }) => {
  for (const path of ['/zh/', '/en/about/', '/en/journey/', '/zh/projects/isolation/']) {
    await page.goto(`/portfolio-content${path}`);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter(({ impact }) => impact === 'critical' || impact === 'serious')).toEqual([]);
  }
});

test('keyboard focus remains visibly styled', async ({ page }) => {
  await page.goto('/portfolio-content/en/');
  await page.keyboard.press('Tab');
  const focused = page.locator(':focus-visible');
  await expect(focused).toBeVisible();
  expect(await focused.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe('none');
});
