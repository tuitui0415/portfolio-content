import { describe, expect, it } from 'vitest';
import { loadPortfolio, localizePortfolio, sortProjectsChronologically } from '../../src/lib/content/load';
import { getProjectMedia } from '../../src/lib/content/media';

describe('portfolio content', () => {
  it('loads every project with a confirmed start date', () => {
    const data = loadPortfolio();
    expect(data.projects).toHaveLength(15);
    expect(data.projects.every((project) => /^\d{4}-\d{2}$/.test(project.dates.start))).toBe(true);
  });

  it('orders the archive from Vango to the July 2026 projects', () => {
    const ids = sortProjectsChronologically(loadPortfolio().projects).map((project) => project.id);
    expect(ids[0]).toBe('vango');
    expect(ids.slice(-2).sort()).toEqual(['modular-mining-game', 'rhythm-watershed']);
  });

  it('resolves links and preserves NSFW team attribution', () => {
    const portfolio = localizePortfolio(loadPortfolio(), 'en');
    const project = portfolio.projects.find(({ id }) => id === 'interpretable-nsfw-text-moderation');
    expect(project?.teamContext).toContain('Raymond');
    expect(project?.links.some(({ url }) => url.includes('github.com'))).toBe(true);
  });

  it('publishes Vango as a team Figma prototype with a complete real preview', () => {
    const zh = localizePortfolio(loadPortfolio(), 'zh').projects.find(({ id }) => id === 'vango');
    const en = localizePortfolio(loadPortfolio(), 'en').projects.find(({ id }) => id === 'vango');
    const media = getProjectMedia('vango');

    expect(zh?.teamContext).toBe('团队项目');
    expect(zh?.websiteCopy).toBe('Vango 是一款用于浏览与介绍游戏作品的 Figma 交互原型。原型包含作品发现、分类筛选、详情浏览、搜索、评论、个人主页及内容发布等界面流程。');
    expect(en?.websiteCopy).toBe('Vango is a Figma interactive prototype for discovering, browsing, and presenting game projects. It includes flows for discovery, filtering, project details, search, comments, user profiles, and content publishing.');
    expect(media).toMatchObject({
      kind: 'image',
      src: '/portfolio-content/generated/projects/vango.webp',
      fit: 'contain',
    });
  });
});
