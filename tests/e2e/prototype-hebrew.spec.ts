import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// The Hebrew page renders right to left, at every width, with the same
// orientation and drawing behaviour as the English page.

const hebrew = () => {
  execFileSync('node', ['scripts/prototype.ts']);
  return readFileSync('dist/prototype/he.html', 'utf8');
};

const open = async (page: Page, width: number, height: number) => {
  await page.setViewportSize({ width, height });
  await page.setContent(hebrew(), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
};

const box = async (page: Page, selector: string) => {
  const b = await page.locator(selector).first().boundingBox();
  if (!b) throw new Error(`${selector} is not rendered`);
  return b;
};

test('the Hebrew page mirrors the layout without overflowing', async ({
  page,
}) => {
  await open(page, 1440, 900);
  expect(await page.evaluate(() => document.documentElement.dir)).toBe('rtl');
  // Brand at the right, menu to its left; heading at the right of the painting.
  expect((await box(page, '.brand')).x).toBeGreaterThan(
    (await box(page, '.nav')).x,
  );
  const heading = await box(page, '.about h1');
  const art = await box(page, '.about .art');
  expect(art.x + art.width).toBeLessThan(heading.x + 40);
  // Section titles sit at the right of their content.
  expect((await box(page, '#research-h')).x).toBeGreaterThan(
    (await box(page, '#research .content')).x,
  );
  for (const [w, h] of [
    [1440, 900],
    [1024, 768],
    [820, 1180],
    [390, 844],
  ] as const) {
    await page.setViewportSize({ width: w, height: h });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(w);
  }
});

test('Hebrew text uses the Hebrew faces, and publications stay left to right', async ({
  page,
}) => {
  await open(page, 1440, 900);
  const faces = await page.evaluate(() => {
    const used = (s: string) =>
      getComputedStyle(document.querySelector(s)!).fontFamily;
    return {
      body: used('.area p'),
      meta: used('.study .meta'),
      caption: used('.measure figcaption'),
      cite: getComputedStyle(document.querySelector('.pubs')!).direction,
    };
  });
  expect(faces.body).toMatch(/^"?IBM Plex Sans Hebrew/);
  expect(faces.meta).toMatch(/^"?IBM Plex Sans Hebrew/);
  expect(faces.caption).toMatch(/^"?IBM Plex Sans Hebrew/);
  expect(faces.cite).toBe('ltr');
});

test('the language link keeps the reader in the same section', async ({
  page,
}) => {
  await open(page, 1440, 900);
  const lang = page.locator('a.lang');
  await expect(lang).toHaveAttribute('href', 'index.html');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.getElementById('studies')!.scrollIntoView();
    window.dispatchEvent(new Event('scroll'));
  });
  await expect(lang).toHaveAttribute('href', 'index.html#studies');
});

test('the reading line grows from the right in Hebrew', async ({ page }) => {
  await open(page, 1440, 900);
  test.skip(
    !(await page.evaluate(() => CSS.supports('animation-timeline: scroll()'))),
    'no scroll timelines in this browser',
  );
  const origin = await page.evaluate(
    () =>
      getComputedStyle(document.querySelector('.site-header')!, '::after')
        .transformOrigin,
  );
  expect(origin.startsWith('1440px')).toBe(true);
});

test('the painting is not mirrored in Hebrew', async ({ page }) => {
  await open(page, 1440, 900);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector('.art svg')!).transform,
    ),
  ).toBe('none');
});

test('English publications read left to right inside the Hebrew page', async ({
  page,
}) => {
  await open(page, 1440, 900);
  const entry = await box(page, '#pub-grace');
  const year = await box(page, '#pub-grace .yr');
  const title = await box(page, '#pub-grace a');
  // Year at the left, title beside it, both starting from the left edge.
  expect(year.x).toBeLessThan(entry.x + 4);
  expect(title.x).toBeGreaterThan(year.x + year.width);
  expect(title.x).toBeLessThan(year.x + 80);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector('.pubs a')!).fontFamily,
    ),
  ).toMatch(/^"?IBM Plex Sans"?,/);
});

for (const [width, height] of [
  [1440, 900],
  [1024, 768],
  [820, 1180],
  [390, 844],
  [360, 740],
] as const) {
  test(`mixed Hebrew and English stays inside its column at ${width}px`, async ({
    page,
  }) => {
    await open(page, width, height);
    const escapes = await page.evaluate(() => {
      const out: string[] = [];
      document.querySelectorAll('.section .content').forEach((column) => {
        const c = column.getBoundingClientRect();
        column.querySelectorAll('*').forEach((el) => {
          if (el.closest('svg')) return;
          const r = el.getBoundingClientRect();
          if (!r.width) return;
          if (
            r.left < c.left - 1 ||
            r.right > c.right + 1 ||
            r.left < -1 ||
            r.right > document.documentElement.clientWidth + 1
          )
            out.push(
              `${el.tagName}.${el.className}: ${el.textContent!.trim().slice(0, 40)}`,
            );
          if (
            el.scrollWidth > el.clientWidth + 1 &&
            getComputedStyle(el).overflowX === 'visible' &&
            el.clientWidth
          )
            out.push(`overflowing ${el.tagName}.${el.className}`);
        });
      });
      return out;
    });
    expect(escapes).toEqual([]);
  });
}
