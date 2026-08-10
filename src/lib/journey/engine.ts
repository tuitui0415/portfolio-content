import type { JourneyInput, JourneyLayout, JourneyState } from './types';

const MAX_SPEED = 440;
const ACCELERATION = 1250;
const GRAVITY = 1550;
const JUMP_SPEED = 620;
const ACTIVE_RADIUS = 150;

function stationById(layout: JourneyLayout, id: string) {
  return layout.stations.find((station) => station.projectId === id);
}

function nearestStation(layout: JourneyLayout, x: number) {
  return layout.stations.reduce((nearest, station) =>
    Math.abs(station.x - x) < Math.abs(nearest.x - x) ? station : nearest,
  layout.stations[0]);
}

export function createJourneyState(layout: JourneyLayout, restoredProjectId?: string): JourneyState {
  const station = stationById(layout, restoredProjectId ?? '') ?? layout.stations[0];
  return {
    layout,
    player: { x: station.x, y: layout.floorY, vx: 0, vy: 0, grounded: true, facing: 1 },
    activeProjectId: station.projectId,
    autoTargetId: null,
    portalProjectId: null,
    cameraX: Math.max(0, station.x - 320),
  };
}

export function selectStation(state: JourneyState, projectId: string, reducedMotion: boolean): JourneyState {
  if (reducedMotion) {
    const station = stationById(state.layout, projectId);
    if (!station) return state;
    return {
      ...state,
      player: { ...state.player, x: station.x, y: state.layout.floorY, vx: 0, vy: 0, grounded: true },
      activeProjectId: projectId,
      autoTargetId: null,
      portalProjectId: null,
      cameraX: Math.max(0, station.x - 320),
    };
  }
  return { ...state, autoTargetId: projectId, portalProjectId: null };
}

export function stepJourney(state: JourneyState, input: JourneyInput, dtSeconds: number): JourneyState {
  const layout = state.layout;
  const dt = Math.min(Math.max(dtSeconds, 0), 1 / 30);
  const next: JourneyState = { ...state, player: { ...state.player }, portalProjectId: null };
  const manual = input.left || input.right;
  if (manual) next.autoTargetId = null;

  let direction = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  if (next.autoTargetId && !manual) {
    const target = stationById(layout, next.autoTargetId);
    if (!target) next.autoTargetId = null;
    else {
      const distance = target.x - next.player.x;
      if (Math.abs(distance) <= 7) {
        next.player.x = target.x;
        next.player.vx = 0;
        next.activeProjectId = target.projectId;
        next.autoTargetId = null;
      } else direction = Math.sign(distance);
    }
  }

  if (direction !== 0) {
    next.player.vx += direction * ACCELERATION * dt;
    next.player.vx = Math.max(-MAX_SPEED, Math.min(MAX_SPEED, next.player.vx));
    next.player.facing = direction < 0 ? -1 : 1;
  } else if (!next.autoTargetId) {
    next.player.vx *= Math.pow(.0008, dt);
    if (Math.abs(next.player.vx) < 1) next.player.vx = 0;
  }

  if (input.jumpPressed && next.player.grounded) {
    next.player.vy = -JUMP_SPEED;
    next.player.grounded = false;
    const active = stationById(layout, next.activeProjectId);
    if (active && Math.abs(active.x - next.player.x) <= ACTIVE_RADIUS) next.portalProjectId = active.projectId;
  }

  next.player.x = Math.max(80, Math.min(layout.worldWidth - 80, next.player.x + next.player.vx * dt));
  next.player.vy += GRAVITY * dt;
  next.player.y += next.player.vy * dt;
  if (next.player.y >= layout.floorY) {
    next.player.y = layout.floorY;
    next.player.vy = 0;
    next.player.grounded = true;
  }

  const nearest = nearestStation(layout, next.player.x);
  if (Math.abs(nearest.x - next.player.x) <= ACTIVE_RADIUS) next.activeProjectId = nearest.projectId;
  next.cameraX += (Math.max(0, Math.min(layout.worldWidth - 640, next.player.x - 320)) - next.cameraX) * Math.min(1, dt * 8);
  return next;
}

export function shouldOpenPortal(state: JourneyState): string | null {
  return state.portalProjectId;
}
