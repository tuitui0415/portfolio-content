import type { Locale } from '../content/types';

export const ui = {
  zh: {
    home: '入口', journey: '项目旅程', about: '个人档案', resume: '简历', contact: '联系',
    skip: '跳到主要内容', language: 'EN', menu: '打开导航', begin: '开始旅程',
    dossier: '进入设计师档案', openProject: '打开项目档案', backLibrary: '返回项目图书馆',
    concept: '概念视觉', controls: '方向键 / A D 移动 · 空格跳跃 · E 打开',
  },
  en: {
    home: 'Entrance', journey: 'Journey', about: 'About', resume: 'Résumé', contact: 'Contact',
    skip: 'Skip to main content', language: '中文', menu: 'Open navigation', begin: 'Begin the Journey',
    dossier: 'Enter the designer dossier', openProject: 'Open project dossier', backLibrary: 'Return to the library',
    concept: 'Concept Visual', controls: 'Arrow keys / A D to move · Space to jump · E to open',
  },
} satisfies Record<Locale, Record<string, string>>;

export const projectTypeLabels: Record<Locale, Record<string, string>> = {
  zh: {
    'solo-project': '个人项目', 'game-jam': 'Game Jam', 'team-project': '团队项目',
    'research-project': '研究项目', 'academic-project': '课程项目', 'lab-project': '实验室项目',
  },
  en: {
    'solo-project': 'Solo Project', 'game-jam': 'Game Jam', 'team-project': 'Team Project',
    'research-project': 'Research Project', 'academic-project': 'Academic Project', 'lab-project': 'Lab Project',
  },
};
