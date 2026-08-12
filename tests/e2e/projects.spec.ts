import { expect, test } from '@playwright/test';

test('NSFW dossier preserves team attribution and source link', async ({ page }) => {
  await page.goto('/portfolio-content/en/projects/interpretable-nsfw-text-moderation/');
  await expect(page.locator('.project-meta dd').filter({ hasText: 'Raymond Kang' })).toBeVisible();
  await expect(page.getByRole('link', { name: /team code/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Iteration & Validation' })).toHaveCount(0);
  await expect(page.getByText(/not run because of time constraints/i)).toHaveCount(0);
});

test('a concept-only project labels its visual honestly', async ({ page }) => {
  await page.goto('/portfolio-content/zh/projects/isolation/');
  await expect(page.getByText('概念视觉')).toBeVisible();
  await expect(page.getByRole('link', { name: /返回项目图书馆/ })).toBeVisible();
});

test('public dossiers omit unavailable-source and missing-context notes', async ({ page }) => {
  await page.goto('/portfolio-content/zh/projects/slacker-simulator/');
  await expect(page.getByText(/无法访问|不作为当前公开展示素材/)).toHaveCount(0);
  await expect(page.getByText(/source-unavailable/i)).toHaveCount(0);

  await page.goto('/portfolio-content/zh/projects/psychotherapy/');
  await expect(page.getByText(/缺少项目背景说明/)).toHaveCount(0);
});

test('Vango shows the user-authored summary and complete screenshot', async ({ page }) => {
  await page.goto('/portfolio-content/zh/projects/vango/');
  await expect(page.getByText(/Vango 是一款用于浏览与介绍游戏作品的 Figma 交互原型/).first()).toBeVisible();
  await expect(page.locator('.real-media--contain img')).toHaveAttribute('src', '/portfolio-content/generated/projects/vango.webp');
  await expect(page.getByText('概念视觉')).toHaveCount(0);
});

test('Psychotherapy shows confirmed copy and both real project screenshots', async ({ page }) => {
  await page.goto('/portfolio-content/zh/projects/psychotherapy/');
  await expect(page.getByRole('heading', { name: 'Psychotherapy' })).toBeVisible();
  await expect(page.getByText(/玩家扮演精神科医生，通过与一名拥有四种人格的特殊患者交谈/).first()).toBeVisible();
  await expect(page.locator('.real-media--contain img')).toHaveAttribute(
    'src',
    '/portfolio-content/generated/projects/psychotherapy-code.webp',
  );
  await expect(page.locator('.project-evidence img')).toHaveAttribute(
    'src',
    '/portfolio-content/generated/projects/psychotherapy-gameplay.webp',
  );
  await expect(page.getByText('概念视觉')).toHaveCount(0);
});
