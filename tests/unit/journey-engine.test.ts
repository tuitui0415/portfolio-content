import { describe, expect, it } from 'vitest';
import { loadPortfolio, localizePortfolio } from '../../src/lib/content/load';
import { buildJourneyLayout } from '../../src/lib/journey/layout';
import { createJourneyState, selectStation, shouldOpenPortal, stepJourney } from '../../src/lib/journey/engine';

const layout = buildJourneyLayout(localizePortfolio(loadPortfolio(), 'en').projects);
const idle = { left: false, right: false, jumpPressed: false };

describe('journey engine', () => {
  it('lands exactly on the floor after a jump', () => {
    let state = createJourneyState(layout);
    state = stepJourney(state, { ...idle, jumpPressed: true }, 1 / 60);
    for (let frame = 0; frame < 120; frame += 1) state = stepJourney(state, idle, 1 / 60);
    expect(state.player.y).toBe(layout.floorY);
    expect(state.player.grounded).toBe(true);
  });

  it('auto-travel stops at the selected station', () => {
    let state = selectStation(createJourneyState(layout), 'rhythm-watershed', false);
    for (let frame = 0; frame < 1200 && state.autoTargetId; frame += 1) state = stepJourney(state, idle, 1 / 60);
    expect(state.activeProjectId).toBe('rhythm-watershed');
    expect(state.autoTargetId).toBeNull();
  });

  it('reduced motion selects a station without auto-running', () => {
    const state = selectStation(createJourneyState(layout), 'isolation', true);
    expect(state.activeProjectId).toBe('isolation');
    expect(state.autoTargetId).toBeNull();
  });

  it('a jump at the active book portal exposes the project id', () => {
    let state = selectStation(createJourneyState(layout), 'vango', true);
    state = stepJourney(state, { ...idle, jumpPressed: true }, 1 / 60);
    expect(shouldOpenPortal(state)).toBe('vango');
  });
});
