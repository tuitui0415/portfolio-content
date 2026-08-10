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
    context.fillStyle = 'rgba(0,0,0,.38)';
    context.fillRect(-24, 4, 51, 7);
    // boots and tapered trousers
    context.fillStyle = '#111615';
    context.beginPath(); context.moveTo(-15, -31); context.lineTo(-2, -31); context.lineTo(-5, 1); context.lineTo(-16, 1); context.fill();
    context.beginPath(); context.moveTo(3, -31); context.lineTo(15, -29); context.lineTo(18, 1); context.lineTo(6, 1); context.fill();
    context.fillStyle = '#24221e'; context.fillRect(-19, -3, 16, 5); context.fillRect(6, -3, 17, 5);
    // long archivist coat with an asymmetric hem
    context.fillStyle = '#0f2922';
    context.beginPath();
    context.moveTo(-18, -78); context.lineTo(17, -78); context.lineTo(23, -58); context.lineTo(18, -25);
    context.lineTo(8, -18); context.lineTo(0, -36); context.lineTo(-9, -17); context.lineTo(-23, -25); context.lineTo(-24, -58); context.closePath(); context.fill();
    context.fillStyle = '#1d4538';
    context.beginPath(); context.moveTo(-14, -74); context.lineTo(3, -78); context.lineTo(10, -39); context.lineTo(-2, -32); context.lineTo(-14, -42); context.closePath(); context.fill();
    // sleeves and hands
    context.fillStyle = '#16372e';
    context.beginPath(); context.moveTo(-19, -72); context.lineTo(-29, -58); context.lineTo(-32, -39); context.lineTo(-24, -36); context.lineTo(-16, -60); context.fill();
    context.beginPath(); context.moveTo(16, -70); context.lineTo(29, -57); context.lineTo(28, -39); context.lineTo(20, -40); context.lineTo(10, -60); context.fill();
    context.fillStyle = '#c99673'; context.fillRect(-31, -41, 8, 8); context.fillRect(22, -42, 8, 8);
    // lapels, buttons, satchel strap and catalogue bag
    context.fillStyle = '#d2a45d'; context.fillRect(-2, -72, 2, 39); context.fillRect(2, -66, 3, 3); context.fillRect(2, -55, 3, 3); context.fillRect(2, -44, 3, 3);
    context.strokeStyle = '#7b5034'; context.lineWidth = 4; context.beginPath(); context.moveTo(-12, -77); context.lineTo(19, -36); context.stroke();
    context.fillStyle = '#68422e'; context.fillRect(17, -49, 16, 25); context.fillStyle = '#b58347'; context.fillRect(19, -46, 12, 2); context.fillRect(19, -30, 12, 2);
    // neck and face
    context.fillStyle = '#bc805e'; context.fillRect(-6, -84, 12, 9);
    context.fillStyle = '#d5a27e';
    context.beginPath(); context.moveTo(-13, -103); context.lineTo(10, -105); context.lineTo(16, -96); context.lineTo(10, -82); context.lineTo(-10, -82); context.lineTo(-16, -93); context.closePath(); context.fill();
    // layered hair silhouette
    context.fillStyle = '#111616';
    context.fillRect(-17, -106, 30, 8); context.fillRect(-14, -110, 23, 7); context.fillRect(-18, -101, 7, 12); context.fillRect(8, -103, 8, 11);
    context.fillRect(-8, -112, 7, 6); context.fillRect(2, -111, 8, 6);
    // glasses and eye highlight
    context.strokeStyle = '#d4b16c'; context.lineWidth = 1;
    context.strokeRect(-11, -98, 9, 5); context.strokeRect(2, -98, 9, 5); context.fillStyle = '#d4b16c'; context.fillRect(-2, -96, 4, 1);
    context.fillStyle = '#f0d5a1'; context.fillRect(8, -96, 1, 1);
    // glowing archive book in the forward hand
    context.fillStyle = '#8c5a32'; context.fillRect(-38, -56, 12, 20); context.strokeStyle = '#e2b861'; context.lineWidth = 2; context.strokeRect(-39, -57, 14, 22);
    context.shadowColor = '#d6a85f'; context.shadowBlur = 10; context.fillStyle = '#f0d59c'; context.fillRect(-35, -53, 6, 14); context.shadowBlur = 0;
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
