import { createJourneyState, selectStation, shouldOpenPortal, stepJourney } from './engine';
import { createJourneyRenderer } from './renderer';
import type { JourneyInput, JourneyLayout } from './types';

interface JourneyPayload { locale: 'zh' | 'en'; base: string; layout: JourneyLayout }

export function mountJourney(root: HTMLElement, payload: JourneyPayload): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');
  if (!canvas) return () => undefined;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const restored = sessionStorage.getItem('yunhan-journey-project') ?? undefined;
  let state = createJourneyState(payload.layout, restored);
  const renderer = createJourneyRenderer(canvas, payload.layout, reducedMotion);
  const input: JourneyInput = { left: false, right: false, jumpPressed: false };
  let frame = 0;
  let previousTime = performance.now();
  let accumulator = 0;
  let visible = !document.hidden;
  const title = root.querySelector<HTMLElement>('[data-active-title]');
  const date = root.querySelector<HTMLElement>('[data-active-date]');
  const summary = root.querySelector<HTMLElement>('[data-active-summary]');
  const open = root.querySelector<HTMLAnchorElement>('[data-active-link]');
  const status = root.querySelector<HTMLElement>('[data-journey-status]');

  const localizedHref = (id: string) => `${payload.base}/${payload.locale}/projects/${id}/`;
  const projectFor = (id: string) => payload.layout.stations.find((station) => station.projectId === id)?.project;
  const setActivePanel = (id: string) => {
    const project = projectFor(id);
    if (!project) return;
    if (title) title.textContent = project.title;
    if (date) date.textContent = project.dates.start.replace('-', '.');
    if (summary) summary.textContent = project.websiteCopy || project.summary;
    if (open) open.href = localizedHref(id);
    root.querySelectorAll<HTMLElement>('[data-project-id]').forEach((button) => {
      button.toggleAttribute('aria-current', button.dataset.projectId === id);
    });
    sessionStorage.setItem('yunhan-journey-project', id);
  };

  const choose = (id: string) => {
    state = selectStation(state, id, reducedMotion);
    setActivePanel(id);
    if (status) status.textContent = payload.locale === 'zh' ? `正在前往 ${projectFor(id)?.title}` : `Travelling to ${projectFor(id)?.title}`;
  };

  const openActive = () => {
    const id = state.autoTargetId ?? state.activeProjectId;
    location.href = localizedHref(id);
  };

  const pressJump = () => { input.jumpPressed = true; };
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') input.left = true;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') input.right = true;
    if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') pressJump();
    if (event.code === 'KeyE' || event.code === 'Enter') openActive();
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space'].includes(event.code)) event.preventDefault();
  };
  const onKeyUp = (event: KeyboardEvent) => {
    if (event.code === 'ArrowLeft' || event.code === 'KeyA') input.left = false;
    if (event.code === 'ArrowRight' || event.code === 'KeyD') input.right = false;
  };

  root.querySelectorAll<HTMLElement>('[data-project-id]').forEach((button) => {
    button.addEventListener('click', () => choose(button.dataset.projectId ?? ''));
  });
  root.querySelectorAll<HTMLElement>('[data-control]').forEach((button) => {
    const control = button.dataset.control;
    const start = (event: Event) => { event.preventDefault(); if (control === 'left') input.left = true; if (control === 'right') input.right = true; if (control === 'jump') pressJump(); if (control === 'open') openActive(); };
    const end = () => { if (control === 'left') input.left = false; if (control === 'right') input.right = false; };
    button.addEventListener('pointerdown', start);
    button.addEventListener('pointerup', end);
    button.addEventListener('pointercancel', end);
  });
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; previousTime = performance.now(); });

  const tick = (time: number) => {
    if (visible) {
      accumulator += Math.min((time - previousTime) / 1000, 1 / 30);
      while (accumulator >= 1 / 60) {
        const priorActive = state.activeProjectId;
        state = stepJourney(state, input, 1 / 60);
        input.jumpPressed = false;
        accumulator -= 1 / 60;
        if (priorActive !== state.activeProjectId && !state.autoTargetId) setActivePanel(state.activeProjectId);
        const portal = shouldOpenPortal(state);
        if (portal) window.setTimeout(() => { location.href = localizedHref(portal); }, 220);
      }
      renderer.render(state, time);
      root.dataset.playerX = state.player.x.toFixed(1);
    }
    previousTime = time;
    frame = requestAnimationFrame(tick);
  };
  root.classList.add('is-ready');
  setActivePanel(state.activeProjectId);
  frame = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frame);
    renderer.destroy();
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
  };
}
