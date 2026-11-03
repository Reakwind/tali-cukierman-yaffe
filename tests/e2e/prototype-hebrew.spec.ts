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

test('Hebrew text uses the Hebrew faces, and citations stay left to right', async ({
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
      cite: getComputedStyle(document.querySelector('.cite')!).direction,
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
