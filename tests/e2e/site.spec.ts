import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

// The published site, served by `wrangler dev` from dist/site exactly as
// Cloudflare serves it in production (headers, redirects and 404s included).

const pages = [
  { path: '/', lang: 'en', dir: 'ltr', other: '/he' },
  { path: '/he', lang: 'he', dir: 'rtl', other: '/' },
] as const;

for (const p of pages) {
  test(`${p.lang}: the published page is served complete, labelled and hidden from search`, async ({
    page,
    request,
  }) => {
    const response = await page.goto(p.path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow',
    );
    await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
    await expect(page.locator('html')).toHaveAttribute('dir', p.dir);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect((await page.title()).trim()).not.toBe('');
    // Enquiries are not open: nothing on the page collects information.
    await expect(page.locator('form, input, textarea, select')).toHaveCount(0);

    const ids = await page
      .locator('[id]')
      .evaluateAll((nodes) => nodes.map((node) => node.id));
    expect(new Set(ids).size, 'duplicate ids').toBe(ids.length);

    // Every image loads, whether inlined or served as a file.
    const sources = await page
      .locator('img')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src') ?? ''));
    expect(sources.length).toBeGreaterThan(0);
    for (const src of sources.filter((s) => !s.startsWith('data:'))) {
      const image = await request.get(new URL(src, page.url()).href);
      expect(image.status(), src).toBe(200);
      expect(image.headers()['content-type'], src).toMatch(/^image\//);
    }

    for (const width of [320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        `horizontal scroll at ${width}px`,
      ).toBe(false);
    }
  });

  test(`${p.lang}: every link leads somewhere real`, async ({
    page,
    request,
  }) => {
    await page.goto(p.path);
    const ids = new Set(
      await page
        .locator('[id]')
        .evaluateAll((nodes) => nodes.map((node) => node.id)),
    );
    const links = await page
      .locator('a[href]')
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute('href') ?? ''));
    expect(links.length).toBeGreaterThan(0);
    for (const href of links) {
      expect(href, 'empty link').not.toBe('');
      const url = new URL(href, page.url());
      if (url.origin !== new URL(page.url()).origin) {
        expect(['https:', 'mailto:', 'tel:'], href).toContain(url.protocol);
        continue;
      }
      if (url.pathname === new URL(page.url()).pathname && url.hash) {
        expect(ids.has(decodeURIComponent(url.hash.slice(1))), href).toBe(true);
        continue;
      }
      const target = await request.get(url.href);
      expect(target.status(), href).toBe(200);
    }
    // The language switch reaches the other page.
    await page.locator('a.lang').click();
    await expect(page).toHaveURL(new URL(p.other, page.url()).href);
  });

  test(`${p.lang}: no automatically detectable accessibility violations`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(p.path);
    await page.evaluate(() => document.fonts.ready);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
