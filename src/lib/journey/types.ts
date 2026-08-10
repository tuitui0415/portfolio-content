import type { ProjectViewModel } from '../content/types';

export interface JourneyStation {
  projectId: string;
  title: string;
  date: string;
  type: string;
  x: number;
  accent: string;
  project: ProjectViewModel;
}

export interface JourneyWing { year: number; startX: number; endX: number }

export interface JourneyLayout {
  stations: JourneyStation[];
  wings: JourneyWing[];
  worldWidth: number;
  floorY: number;
}

export interface JourneyPlayer { x: number; y: number; vx: number; vy: number; grounded: boolean; facing: -1 | 1 }

export interface JourneyState {
  layout: JourneyLayout;
  player: JourneyPlayer;
  activeProjectId: string;
  autoTargetId: string | null;
  portalProjectId: string | null;
  cameraX: number;
}

export interface JourneyInput { left: boolean; right: boolean; jumpPressed: boolean }
