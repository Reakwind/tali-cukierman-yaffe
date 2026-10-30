import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he'],
    routing: { prefixDefaultLocale: true, redirectToDefaultLocale: false },
  },
});
