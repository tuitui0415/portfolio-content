import type { JourneyLayout, JourneyState } from './types';

export interface JourneyRenderer {
  resize(): void;
  render(state: JourneyState, time: number): void;
  destroy(): void;
}

export function createJourneyRenderer(
  canvas: HTMLCanvasElement,
  layout: JourneyLayout,
  reducedMotion: boolean,
): JourneyRenderer {
  const context = canvas.getContext('2d', { alpha: false });
  if (!context) throw new Error('Canvas 2D is unavailable');
  let width = 0;
  let height = 0;
  let dpr = 1;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(320, Math.round(rect.width));
    height = Math.max(360, Math.round(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.imageSmoothingEnabled = false;
  };

  const drawShelves = (cameraX: number, parallax: number, alpha: number) => {
    const start = Math.floor((cameraX * parallax) / 150) * 150 - 150;
    context.globalAlpha = alpha;
    for (let worldX = start; worldX < cameraX * parallax + width + 170; worldX += 150) {
      const x = Math.round(worldX - cameraX * parallax);
      context.fillStyle = '#17221e';
      context.fillRect(x, 64, 132, height - 150);
      context.strokeStyle = '#4c382c';
      context.lineWidth = 5;
      context.strokeRect(x, 64, 132, height - 150);
      for (let row = 0; row < 5; row += 1) {
        const y = 104 + row * 82;
        context.fillStyle = '#52372b';
        context.fillRect(x + 7, y + 54, 118, 7);
        for (let book = 0; book < 8; book += 1) {
          const bookHeight = 24 + ((book * 11 + row * 7) % 26);
          context.fillStyle = ['#6d4432', '#354e43', '#705d35', '#403552'][book % 4];
          context.fillRect(x + 13 + book * 13, y + 52 - bookHeight, 9, bookHeight);
        }
      }
    }
    context.globalAlpha = 1;
  };

  const drawWing = (year: number, x: number, wingWidth: number) => {
    context.strokeStyle = 'rgba(214,168,95,.24)';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, height * .75);
    context.lineTo(x, 126);
    context.quadraticCurveTo(x + wingWidth / 2, 58, x + wingWidth, 126);
    context.lineTo(x + wingWidth, height * .75);
    context.stroke();
    context.fillStyle = 'rgba(214,168,95,.62)';
    context.font = '12px "DM Mono", monospace';
    context.fillText(String(year), x + 18, 112);
  };

  const drawStation = (state: JourneyState, station: JourneyLayout['stations'][number], time: number) => {
    const x = Math.round(station.x - state.cameraX);
    if (x < -180 || x > width + 180) return;
    const floor = Math.round(height * .75);
    const active = station.projectId === state.activeProjectId || station.projectId === state.autoTargetId;
    const pulse = reducedMotion ? 0 : Math.sin(time / 420 + station.x) * 4;
    context.fillStyle = active ? 'rgba(214,168,95,.12)' : 'rgba(6,10,9,.46)';
    context.fillRect(x - 112, 168, 224, floor - 168);
    context.strokeStyle = active ? station.accent : 'rgba(214,168,95,.2)';
    context.lineWidth = active ? 3 : 1;
    context.strokeRect(x - 112, 168, 224, floor - 168);

    context.fillStyle = '#493226';
    context.fillRect(x - 88, floor - 106, 176, 14);
    context.fillRect(x - 88, floor - 46, 176, 9);
    for (let book = 0; book < 8; book += 1) {
      const bookX = x - 74 + book * 19;
      context.fillStyle = book === 4 ? station.accent : ['#624131', '#334b41', '#645436'][book % 3];
      const bookHeight = book === 4 ? 68 + pulse : 42 + (book % 3) * 7;
      context.fillRect(bookX, floor - 47 - bookHeight, 13, bookHeight);
      if (book === 4 && active) {
        context.shadowColor = station.accent;
        context.shadowBlur = 22;
        context.strokeStyle = '#f4d18d';
        context.strokeRect(bookX - 2, floor - 49 - bookHeight, 17, bookHeight + 4);
        context.shadowBlur = 0;
      }
    }
    context.fillStyle = active ? '#f0d59d' : '#9aa59c';
    context.font = active ? '600 14px "Noto Sans SC", sans-serif' : '12px "Noto Sans SC", sans-serif';
    context.textAlign = 'center';
    const title = station.title.length > 25 ? `${station.title.slice(0, 23)}…` : station.title;
    context.fillText(title, x, floor - 128);
    context.fillStyle = '#65766d';
    context.font = '10px "DM Mono", monospace';
    context.fillText(station.date.replace('-', '.'), x, floor - 110);
    context.textAlign = 'start';
    context.fillStyle = active ? station.accent : '#4d5e55';
    context.fillRect(x - 2, floor + 7, 4, 25);
  };

  const drawPlayer = (state: JourneyState) => {
    const x = Math.round(state.player.x - state.cameraX);
    const floor = Math.round(height * .75);
    const y = Math.round(floor + state.player.y - layout.floorY);
    const flip = state.player.facing;
    context.save();
    context.translate(x, y);
    context.scale(flip, 1);
    context.fillStyle = 'rgba(0,0,0,.35)';
    context.fillRect(-21, 4, 45, 7);
    context.fillStyle = '#171917';
    context.fillRect(-13, -22, 10, 23); context.fillRect(5, -22, 10, 23);
    context.fillStyle = '#142b24';
    context.fillRect(-22, -78, 42, 58);
    context.fillStyle = '#1d4034';
    context.fillRect(-17, -75, 29, 47);
    context.fillStyle = '#d2a45d';
    context.fillRect(-4, -72, 3, 38);
    context.fillStyle = '#6a4632';
    context.fillRect(12, -63, 13, 31);
    context.fillStyle = '#d5aa85';
    context.fillRect(-13, -101, 27, 24);
    context.fillStyle = '#171a19';
    context.fillRect(-16, -105, 31, 10); context.fillRect(-16, -97, 7, 12);
    context.fillStyle = '#d6a85f';
    context.fillRect(6, -93, 9, 2); context.fillRect(-4, -93, 8, 2);
    context.strokeStyle = '#d6a85f';
    context.lineWidth = 2;
    context.strokeRect(18, -66, 14, 21);
    context.restore();
  };

  const render = (state: JourneyState, time: number) => {
    const gradient = context.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#07100e'); gradient.addColorStop(.7, '#101a17'); gradient.addColorStop(1, '#070c0b');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    drawShelves(state.cameraX, .18, .28);
    drawShelves(state.cameraX, .42, .55);
    for (const wing of layout.wings) drawWing(wing.year, wing.startX - state.cameraX, wing.endX - wing.startX);
    for (const station of layout.stations) drawStation(state, station, time);
    const floor = Math.round(height * .75);
    context.fillStyle = '#1d1915'; context.fillRect(0, floor, width, height - floor);
    context.fillStyle = '#59402d'; context.fillRect(0, floor, width, 7);
    context.strokeStyle = 'rgba(214,168,95,.12)'; context.lineWidth = 1;
    for (let x = -((state.cameraX * .75) % 90); x < width; x += 90) {
      context.beginPath(); context.moveTo(x, floor); context.lineTo(x - 35, height); context.stroke();
    }
    drawPlayer(state);
    if (!reducedMotion) {
      context.fillStyle = 'rgba(226,190,116,.45)';
      for (let particle = 0; particle < 22; particle += 1) {
        const x = (particle * 83 + time * .012) % width;
        const y = (particle * 47 - time * .006 + height) % Math.max(1, floor);
        context.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
    }
  };

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  return { resize, render, destroy: () => observer.disconnect() };
}
