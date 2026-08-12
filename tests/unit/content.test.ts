import { describe, expect, it } from 'vitest';
import { loadPortfolio, localizePortfolio, sortProjectsChronologically } from '../../src/lib/content/load';

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
});
