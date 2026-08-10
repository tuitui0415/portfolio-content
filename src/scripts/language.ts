import { LOCALE_STORAGE_KEY } from '../lib/i18n/locale';

document.querySelectorAll<HTMLAnchorElement>('[data-language-switch]').forEach((link) => {
  link.addEventListener('click', () => {
    const locale = link.dataset.languageSwitch;
    if (locale === 'zh' || locale === 'en') localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  });
});
