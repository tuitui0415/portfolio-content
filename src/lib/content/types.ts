export type Locale = 'zh' | 'en';
export type LocalizedText = Record<Locale, string>;
export type LocalizedList = Record<Locale, string[]>;

export interface ProfileRecord {
  name: LocalizedText;
  positioning: LocalizedText;
  email: string;
  phone: string;
  github: string;
  website: string;
  legacy_website: string;
  languages: string[];
}

export interface EducationRecord {
  institution: string;
  degree: LocalizedText;
  start: string;
  end: string;
  graduated?: string;
  gpa?: string;
  honor?: string;
}

export interface ExperienceRecord {
  organization: LocalizedText;
  role: LocalizedText;
  start: string;
  end: string;
  summary: LocalizedText;
}

export interface ExternalLinkRecord {
  id: string;
  label: LocalizedText;
  url: string;
  project_id: string;
  type: string;
  access: string;
  action: string;
}

export interface ProjectRecord {
  id: string;
  title: LocalizedText;
  type: string;
  status: string;
  dates: { start: string; end: string };
  team: { size: number; context: LocalizedText };
  roles: LocalizedList;
  tools: string[];
  summary: LocalizedText;
  design: {
    goals: LocalizedList;
    mechanics: LocalizedList;
    decisions: LocalizedList;
    iteration: LocalizedList;
  };
  copy: {
    resume: LocalizedList;
    website: LocalizedText;
    full: LocalizedText;
  };
  link_ids: string[];
  sources: string[];
  questions: string[];
}

export interface PortfolioData {
  profile: ProfileRecord;
  education: EducationRecord[];
  experience: ExperienceRecord[];
  links: ExternalLinkRecord[];
  projects: ProjectRecord[];
}

export interface ProjectLink {
  id: string;
  label: string;
  url: string;
  type: string;
}

export interface ProjectViewModel {
  id: string;
  title: string;
  titleAlt: string;
  type: string;
  status: string;
  dates: { start: string; end: string };
  teamSize: number;
  teamContext: string;
  roles: string[];
  tools: string[];
  summary: string;
  websiteCopy: string;
  fullCopy: string;
  design: {
    goals: string[];
    mechanics: string[];
    decisions: string[];
    iteration: string[];
  };
  links: ProjectLink[];
  sources: string[];
  questions: string[];
}

export interface LocalizedPortfolio {
  locale: Locale;
  profile: Omit<ProfileRecord, 'name' | 'positioning'> & { name: string; positioning: string };
  education: Array<Omit<EducationRecord, 'degree'> & { degree: string }>;
  experience: Array<Omit<ExperienceRecord, 'organization' | 'role' | 'summary'> & {
    organization: string;
    role: string;
    summary: string;
  }>;
  projects: ProjectViewModel[];
}

export interface ProjectMedia {
  kind: 'image' | 'concept';
  src?: string;
  alt?: LocalizedText;
  accent: string;
  fit?: 'cover' | 'contain';
  detail?: {
    src: string;
    alt: LocalizedText;
  };
}
