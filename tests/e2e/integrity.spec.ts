import { globSync, statSync } from 'node:fs';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const locale of ['en', 'he']) {
  test(`${locale}: every built page has valid links, metadata, accessible content, and a narrow layout`, async ({
    page,
    request,
  }) => {
    test.setTimeout(90_000);
    const files = [...globSync(`${locale}/**/*.html`, { cwd: 'dist' })];
    expect(files.length).toBeGreaterThanOrEqual(11);
    const titles = new Set<string>();
    const pages = new Map<string, Set<string>>();
    const references: { href: string; from: string }[] = [];
    const unexpectedRequests: string[] = [];
    page.on('request', (req) => {
      if (new URL(req.url()).origin !== 'http://127.0.0.1:4173')
        unexpectedRequests.push(req.url());
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const file of files) {
      const path = `/${file.replace(/index\.html$/, '')}`;
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute(
        'dir',
        locale === 'he' ? 'rtl' : 'ltr',
      );
      const title = await page.title();
      expect(titles.has(title), `Duplicate title on ${path}`).toBe(false);
      titles.add(title);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /\S.{15}/,
      );
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        'content',
        /noindex/,
      );
      await expect(page.locator('script, form, input, textarea')).toHaveCount(
        0,
      );
      const ids = await page
        .locator('[id]')
        .evaluateAll((nodes) => nodes.map((node) => node.id));
      expect(new Set(ids).size, `Duplicate IDs on ${path}`).toBe(ids.length);
      pages.set(path, new Set(ids));
      const links = await page
        .locator('a[href]')
        .evaluateAll((nodes) =>
          nodes.map((node) => node.getAttribute('href') ?? ''),
        );
      references.push(...links.map((href) => ({ href, from: path })));

      for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => document.fonts.ready);
        expect(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          `${path} at ${width}px`,
        ).toBe(false);
      }
      const result = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
        .analyze();
      expect(result.violations, path).toEqual([]);
    }

    const checked = new Set<string>();
    for (const { href, from } of references) {
      expect(href, `Empty link on ${from}`).not.toBe('');
      const url = new URL(href, `http://127.0.0.1:4173${from}`);
      if (url.origin !== 'http://127.0.0.1:4173') {
        expect(url.protocol, `Unsafe external link on ${from}`).toBe('https:');
        continue;
      }
      if (!checked.has(url.pathname)) {
        const response = await request.get(url.pathname);
        expect(response.status(), `Broken ${href} from ${from}`).toBe(200);
        checked.add(url.pathname);
      }
      if (url.hash && pages.has(url.pathname)) {
        expect(
          pages.get(url.pathname)?.has(decodeURIComponent(url.hash.slice(1))),
          `Missing ${url.hash} from ${from}`,
        ).toBe(true);
      }
    }
    expect(
      unexpectedRequests,
      'Rendering must not contact trackers, remote fonts, or live APIs',
    ).toEqual([]);
  });
}

test('static CSS and font payloads stay within modest asset budgets', () => {
  const bytes = (pattern: string) =>
    [...globSync(pattern, { cwd: 'dist' })].reduce(
      (sum, file) => sum + statSync(`dist/${file}`).size,
      0,
    );
  expect(bytes('**/*.css')).toBeLessThan(50 * 1024);
  expect(bytes('**/*.woff2')).toBeLessThan(300 * 1024);
  expect([...globSync('**/*.js', { cwd: 'dist' })]).toEqual([]);
});
