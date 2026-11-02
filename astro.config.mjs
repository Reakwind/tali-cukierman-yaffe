import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  // Keep the form handler compatible with the production script-src 'self' policy.
  vite: { build: { assetsInlineLimit: 0 } },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
