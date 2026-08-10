import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import type {
  ExternalLinkRecord,
  Locale,
  LocalizedPortfolio,
  PortfolioData,
  ProjectRecord,
  ProjectViewModel,
} from './types';

const ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const CONTENT = join(ROOT, 'content');

function readJson<T>(path: string): T {
  return JSON.parse(readFileSync(path, 'utf-8')) as T;
}

export function sortProjectsChronologically(projects: ProjectRecord[]): ProjectRecord[] {
  return [...projects].sort((left, right) =>
    left.dates.start.localeCompare(right.dates.start)
    || left.dates.end.localeCompare(right.dates.end)
    || left.id.localeCompare(right.id),
  );
}

export function loadPortfolio(): PortfolioData {
  const projects = readdirSync(join(CONTENT, 'projects'))
    .filter((name) => name.endsWith('.json'))
    .map((name) => readJson<ProjectRecord>(join(CONTENT, 'projects', name)));
  const links = readJson<ExternalLinkRecord[]>(join(CONTENT, 'external-links.json'));

  const ids = new Set<string>();
  for (const project of projects) {
    if (ids.has(project.id)) throw new Error(`Duplicate project id: ${project.id}`);
    if (!/^\d{4}-\d{2}$/.test(project.dates.start)) {
      throw new Error(`Project ${project.id} is missing a confirmed YYYY-MM start date`);
    }
    ids.add(project.id);
  }

  const linkIds = new Set(links.map(({ id }) => id));
  for (const project of projects) {
    for (const linkId of project.link_ids) {
      if (!linkIds.has(linkId)) throw new Error(`Project ${project.id} references unknown link ${linkId}`);
    }
  }

  return {
    profile: readJson(join(CONTENT, 'profile.json')),
    education: readJson(join(CONTENT, 'education.json')),
    experience: readJson(join(CONTENT, 'experience.json')),
    links,
    projects: sortProjectsChronologically(projects),
  };
}

function localizeProject(
  project: ProjectRecord,
  locale: Locale,
  linksById: Map<string, ExternalLinkRecord>,
): ProjectViewModel {
  const alternate: Locale = locale === 'zh' ? 'en' : 'zh';
  return {
    id: project.id,
    title: project.title[locale],
    titleAlt: project.title[alternate],
    type: project.type,
    status: project.status,
    dates: project.dates,
    teamSize: project.team.size,
    teamContext: project.team.context[locale],
    roles: project.roles[locale],
    tools: project.tools,
    summary: project.summary[locale],
    websiteCopy: project.copy.website[locale],
    fullCopy: project.copy.full[locale],
    design: {
      goals: project.design.goals[locale],
      mechanics: project.design.mechanics[locale],
      decisions: project.design.decisions[locale],
      iteration: project.design.iteration[locale],
    },
    links: project.link_ids.map((id) => {
      const link = linksById.get(id);
      if (!link) throw new Error(`Project ${project.id} references unknown link ${id}`);
      return { id, label: link.label[locale], url: link.url, type: link.type };
    }),
    sources: project.sources,
    questions: project.questions,
  };
}

export function localizePortfolio(data: PortfolioData, locale: Locale): LocalizedPortfolio {
  const linksById = new Map(data.links.map((link) => [link.id, link]));
  return {
    locale,
    profile: {
      ...data.profile,
      name: data.profile.name[locale],
      positioning: data.profile.positioning[locale],
    },
    education: data.education.map((item) => ({ ...item, degree: item.degree[locale] })),
    experience: data.experience.map((item) => ({
      ...item,
      organization: item.organization[locale],
      role: item.role[locale],
      summary: item.summary[locale],
    })),
    projects: data.projects.map((project) => localizeProject(project, locale, linksById)),
  };
}
