import type { Locale } from '../content/types';

export const LOCALE_STORAGE_KEY = 'yunhan-portfolio-locale';

export function resolveLocale(saved: string | null, browserLocales: string[]): Locale {
  if (saved === 'zh' || saved === 'en') return saved;
  return browserLocales.some((locale) => /^zh(?:-|$)/i.test(locale)) ? 'zh' : 'en';
}

export function switchLocalePath(pathname: string, target: Locale, base: string): string {
  const normalizedBase = base.replace(/\/$/, '');
  const relative = pathname.startsWith(normalizedBase) ? pathname.slice(normalizedBase.length) : pathname;
  const segments = relative.split('/').filter(Boolean);
  if (segments[0] === 'zh' || segments[0] === 'en') segments[0] = target;
  else segments.unshift(target);
  return `${normalizedBase}/${segments.join('/')}/`;
}
