import { gzipSync } from 'node:zlib';
import { readFileSync, readdirSync } from 'node:fs';
import { expect, test } from '@playwright/test';

test('the authored journey bundle stays below 120 KB gzip', () => {
  const files = readdirSync('dist/_astro')
    .filter((file) => file.startsWith('JourneyShell') && file.endsWith('.js'))
    .map((file) => `dist/_astro/${file}`);
  expect(files.length).toBeGreaterThan(0);
  const bytes = files.reduce((total, file) => total + gzipSync(readFileSync(file)).byteLength, 0);
  expect(bytes).toBeLessThanOrEqual(120 * 1024);
});

test('hero image is compact and dimensioned', async ({ page }) => {
  await page.goto('/portfolio-content/en/');
  const hero = page.locator('.librarian-link img');
  await expect(hero).toHaveAttribute('width', '800');
  const resource = await page.evaluate(() => performance.getEntriesByType('resource').find((entry) => entry.name.includes('librarian-hero'))?.name);
  expect(resource).toContain('librarian-hero.webp');
});
