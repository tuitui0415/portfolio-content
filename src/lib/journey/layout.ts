import type { ProjectViewModel } from '../content/types';
import type { JourneyLayout, JourneyStation, JourneyWing } from './types';

const ACCENTS = ['#d6a85f', '#70aa9c', '#c97861', '#9d88c6', '#719ac2'];

export function buildJourneyLayout(projects: ProjectViewModel[]): JourneyLayout {
  const floorY = 420;
  let x = 340;
  let previousYear = 0;
  const stations: JourneyStation[] = projects.map((project, index) => {
    const year = Number(project.dates.start.slice(0, 4));
    if (previousYear && year !== previousYear) x += 180;
    const station = {
      projectId: project.id,
      title: project.title,
      date: project.dates.start,
      type: project.type,
      x,
      accent: ACCENTS[index % ACCENTS.length],
      project,
    };
    x += 410;
    previousYear = year;
    return station;
  });

  const wings: JourneyWing[] = [];
  for (const station of stations) {
    const year = Number(station.date.slice(0, 4));
    const last = wings.at(-1);
    if (!last || last.year !== year) wings.push({ year, startX: station.x - 170, endX: station.x + 170 });
    else last.endX = station.x + 170;
  }

  return { stations, wings, worldWidth: (stations.at(-1)?.x ?? 0) + 420, floorY };
}
