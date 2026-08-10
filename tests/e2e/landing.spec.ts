import { expect, test } from '@playwright/test';

test('Chinese landing offers About and Journey as clear primary paths', async ({ page }) => {
  await page.goto('/portfolio-content/zh/');
  await expect(page.getByRole('link', { name: /设计师档案/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /开始旅程/ })).toHaveAttribute('href', /\/zh\/journey\/$/);
});

test('English landing links the librarian portrait to About', async ({ page }) => {
  await page.goto('/portfolio-content/en/');
  await expect(page.getByRole('link', { name: /designer dossier/i })).toHaveAttribute('href', /\/en\/about\/$/);
});
