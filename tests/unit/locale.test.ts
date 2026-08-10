import { describe, expect, it } from 'vitest';
import { resolveLocale, switchLocalePath } from '../../src/lib/i18n/locale';

describe('locale routing', () => {
  it('prefers a saved language over browser language', () => {
    expect(resolveLocale('en', ['zh-CN'])).toBe('en');
  });

  it('uses Chinese only for Chinese browser locales', () => {
    expect(resolveLocale(null, ['zh-CN'])).toBe('zh');
    expect(resolveLocale(null, ['fr-FR'])).toBe('en');
  });

  it('switches locale while preserving the equivalent route', () => {
    expect(switchLocalePath('/portfolio-content/zh/projects/isolation/', 'en', '/portfolio-content'))
      .toBe('/portfolio-content/en/projects/isolation/');
  });
});
