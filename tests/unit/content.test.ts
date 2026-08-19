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

  it('uses the complete Vango screenshot as real project media', () => {
    expect(getProjectMedia('vango')).toMatchObject({
      kind: 'image',
      src: '/portfolio-content/generated/projects/vango.webp',
      fit: 'contain',
    });
  });

  it('presents Psychotherapy with confirmed content and both real screenshots', () => {
    const portfolio = localizePortfolio(loadPortfolio(), 'en');
    const project = portfolio.projects.find(({ id }) => id === 'psychotherapy');

    expect(project?.title).toBe('Psychotherapy');
    expect(project?.summary).toContain('four personalities');
    expect(getProjectMedia('psychotherapy')).toMatchObject({
      kind: 'image',
      src: '/portfolio-content/generated/projects/psychotherapy-code.webp',
      fit: 'contain',
      detail: {
        src: '/portfolio-content/generated/projects/psychotherapy-gameplay.webp',
      },
    });
  });

  it('presents Fishing on a Flat Earth without personal-role copy and with its real screenshot', () => {
    const portfolio = localizePortfolio(loadPortfolio(), 'en');
    const project = portfolio.projects.find(({ id }) => id === 'fishing-on-a-flat-earth');

    expect(project?.summary).toContain('planar ocean');
    expect(project?.summary).toContain('sphere');
    expect(project?.roles).toEqual([]);
    expect(getProjectMedia('fishing-on-a-flat-earth')).toMatchObject({
      kind: 'image',
      src: '/portfolio-content/generated/projects/fishing-on-a-flat-earth.webp',
      fit: 'contain',
    });
  });
});
