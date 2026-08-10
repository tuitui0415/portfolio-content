import { describe, expect, it } from 'vitest';
import { loadPortfolio, localizePortfolio } from '../../src/lib/content/load';
import { buildJourneyLayout } from '../../src/lib/journey/layout';

describe('journey layout', () => {
  it('places all projects in strictly chronological world order', () => {
    const layout = buildJourneyLayout(localizePortfolio(loadPortfolio(), 'en').projects);
    expect(layout.stations).toHaveLength(15);
    expect(layout.stations[0].projectId).toBe('vango');
    expect(layout.stations.every((station, index, all) => index === 0 || station.x > all[index - 1].x)).toBe(true);
    expect(layout.worldWidth).toBeGreaterThan(layout.stations.at(-1)!.x);
  });

  it('creates a new library wing at each year transition', () => {
    const layout = buildJourneyLayout(localizePortfolio(loadPortfolio(), 'zh').projects);
    expect(layout.wings.map(({ year }) => year)).toEqual([2019, 2020, 2021, 2022, 2025, 2026]);
  });
});
