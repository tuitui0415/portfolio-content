import { expect, test } from '@playwright/test';

test('NSFW dossier preserves team attribution and source link', async ({ page }) => {
  await page.goto('/portfolio-content/en/projects/interpretable-nsfw-text-moderation/');
  await expect(page.locator('.project-meta dd').filter({ hasText: 'Raymond Kang' })).toBeVisible();
  await expect(page.getByRole('link', { name: /team code/i })).toBeVisible();
});

test('a concept-only project labels its visual honestly', async ({ page }) => {
  await page.goto('/portfolio-content/zh/projects/isolation/');
  await expect(page.getByText('概念视觉')).toBeVisible();
  await expect(page.getByRole('link', { name: /返回项目图书馆/ })).toBeVisible();
});
