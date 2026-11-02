import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Locale } from '../i18n/ui';

export const sectionTargets: Record<string, string> = {
  studies: 'home-studies',
  research: 'home-research',
  publications: 'home-publications',
  about: 'home-team',
  participation: 'taking-part',
  'for-clinicians': 'home-clinicians',
  privacy: 'privacy',
  accessibility: 'accessibility',
};

export function sectionHref(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  const study = clean.match(/^studies\/([^/]+)$/)?.[1];
  return `${getRelativeLocaleUrl(locale)}#${study ? `study-${study}` : (sectionTargets[clean] ?? clean)}`;
}
