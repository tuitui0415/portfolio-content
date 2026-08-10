import { expect, test } from '@playwright/test';

test('Chinese landing is factual and offers two clear primary paths', async ({ page }) => {
  await page.goto('/portfolio-content/zh/');
  await expect(page.getByRole('heading', { name: '魏允瀚' })).toBeVisible();
  await expect(page.getByText('计算机科学硕士 · 游戏项目 / XR / 图形开发')).toBeVisible();
  await expect(page.getByRole('link', { name: '个人信息' })).toHaveAttribute('href', /\/zh\/about\/$/);
  await expect(page.getByRole('link', { name: '浏览项目' })).toHaveAttribute('href', /\/zh\/journey\/$/);
  await expect(page.locator('main img')).toHaveCount(0);
  await expect(page.getByText(/可探索、可理解、可记住/)).toHaveCount(0);
});

test('English landing uses the same restrained information hierarchy', async ({ page }) => {
  await page.goto('/portfolio-content/en/');
  const landing = page.locator('.landing-hero');
  await expect(page.getByRole('heading', { name: 'Yunhan Wei' })).toBeVisible();
  await expect(page.getByText('M.S. Computer Science · Game Projects / XR / Graphics')).toBeVisible();
  await expect(landing.getByRole('link', { name: 'About' })).toHaveAttribute('href', /\/en\/about\/$/);
  await expect(landing.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', /\/en\/journey\/$/);
});
