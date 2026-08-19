import type { ProjectMedia } from './types';

const accents = ['#e8b45b', '#76b9a5', '#d9826b', '#9f8bc8', '#7da5d8'];

const realMedia: Record<string, ProjectMedia> = {
  vango: {
    kind: 'image',
    src: '/portfolio-content/generated/projects/vango.webp',
    alt: {
      zh: 'Vango 的 Figma 页面结构与主要交互流程',
      en: 'Vango’s Figma screen structure and primary interaction flows',
    },
    accent: '#b7c66b',
    fit: 'contain',
  },
  psychotherapy: {
    kind: 'image',
    src: '/portfolio-content/generated/projects/psychotherapy-code.webp',
    alt: {
      zh: 'Psychotherapy 的 Ink 场景代码与项目文件结构',
      en: 'Psychotherapy Ink scene code and project file structure',
    },
    accent: '#78a7d8',
    fit: 'contain',
    detail: {
      src: '/portfolio-content/generated/projects/psychotherapy-gameplay.webp',
      alt: {
        zh: 'Psychotherapy 网页互动叙事的剧情选择界面',
        en: 'Psychotherapy web interactive-fiction choice interface',
      },
    },
  },
  'fishing-on-a-flat-earth': {
    kind: 'image',
    src: '/portfolio-content/generated/projects/fishing-on-a-flat-earth.webp',
    alt: {
      zh: 'Fishing on a Flat Earth 的球形海域、岛屿与渔船',
      en: 'The spherical ocean, islands, and fishing boat in Fishing on a Flat Earth',
    },
    accent: '#55a9dc',
    fit: 'contain',
  },
  'slacker-simulator': {
    kind: 'image',
    src: '/portfolio-content/generated/projects/slacker-simulator.webp',
    alt: {
      zh: 'Slacker Simulator 的红色人物档案主视觉',
      en: 'The red character-profile artwork for Slacker Simulator',
    },
    accent: '#d71920',
    fit: 'contain',
  },
  'mont-saint-michel-castle': {
    kind: 'image',
    src: '/portfolio-content/generated/projects/mont-saint-michel-castle.webp',
    alt: { zh: '圣米歇尔山城堡项目预览', en: 'Mont Saint-Michel Castle project preview' },
    accent: '#d6a85f',
  },
  'multiplayer-xr-drone-game': {
    kind: 'image',
    src: '/portfolio-content/generated/projects/multiplayer-xr-drone-game.webp',
    alt: { zh: '无人机 XR 项目报告预览', en: 'Drone XR project report preview' },
    accent: '#72b5c4',
  },
  'interpretable-nsfw-text-moderation': {
    kind: 'image',
    src: '/portfolio-content/generated/projects/interpretable-nsfw-text-moderation.webp',
    alt: { zh: '可解释文本审核报告预览', en: 'Interpretable text moderation report preview' },
    accent: '#c6859f',
  },
};

export function getProjectMedia(projectId: string): ProjectMedia {
  if (realMedia[projectId]) return realMedia[projectId];
  let hash = 0;
  for (const character of projectId) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return { kind: 'concept', accent: accents[hash % accents.length] };
}
