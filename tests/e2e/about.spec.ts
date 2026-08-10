import { expect, test } from '@playwright/test';

test('About shows public contact facts and completed MSCS', async ({ page }) => {
  await page.goto('/portfolio-content/en/about/');
  await expect(page.getByText('+86 17372796758')).toBeVisible();
  await expect(page.getByText(/June 11, 2026/)).toBeVisible();
  await expect(page.getByRole('link', { name: /download.*resume/i })).toHaveAttribute('href', /yunhan-wei-resume-zh\.pdf$/);
});
