import { expect, test, type Page } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// The one-page draft in prototype/index.html, built with its images inlined.
const draft = () => {
  execFileSync('node', ['scripts/prototype.ts']);
  return readFileSync('dist/prototype/index.html', 'utf8');
};

const open = async (page: Page, width: number, height: number) => {
  await page.setViewportSize({ width, height });
  await page.setContent(draft(), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
};

const box = async (page: Page, selector: string) => {
  const b = await page.locator(selector).first().boundingBox();
  if (!b) throw new Error(`${selector} is not rendered`);
  return b;
};

const charactersPerLine = (page: Page, selector: string) =>
  page
    .locator(selector)
    .first()
    .evaluate((el) => {
      const range = document.createRange();
      range.selectNodeContents(el);
      const lines = new Set(
        [...range.getClientRects()].map((r) => Math.round(r.top)),
      ).size;
      return (el.textContent ?? '').replace(/\s+/g, ' ').trim().length / lines;
    });

test('tablets in portrait get one wide column with readable lines', async ({
  page,
}) => {
  await open(page, 768, 1024);
  expect((await box(page, '#research .content')).width).toBeGreaterThan(600);
  expect(await charactersPerLine(page, '.measure p')).toBeGreaterThan(45);
});

test('spacing grows with the change of level', async ({ page }) => {
  await open(page, 1440, 900);
  const gap = async (upper: string, lower: string) =>
    (await box(page, lower)).y -
    ((await box(page, upper)).y + (await box(page, upper)).height);
  const heading = await gap('.area h3', '.area p');
  const items = await gap('.area:nth-child(1)', '.area:nth-child(2)');
  const blocks = await gap('#research .intro', '#research .areas');
  const sections = await gap('#research .measure', '#studies h2');
  expect(heading).toBeGreaterThanOrEqual(12);
  expect(items).toBeGreaterThan(heading);
  expect(blocks).toBeGreaterThan(items);
  expect(sections).toBeGreaterThan(blocks);
});

test('long single lines stay within a readable measure', async ({ page }) => {
  await open(page, 1440, 900);
  expect(await charactersPerLine(page, '.collab')).toBeLessThanOrEqual(70);
  expect(await charactersPerLine(page, '.intro p + p')).toBeLessThanOrEqual(70);
});

test('phones keep a 20px margin, a compact header and a short measure panel', async ({
  page,
}) => {
  await open(page, 390, 844);
  expect((await box(page, '#research .content')).x).toBeGreaterThanOrEqual(20);
  expect((await box(page, '.site-header')).height).toBeLessThanOrEqual(76);
  const figure = await box(page, '.measure figure');
  expect(figure.width).toBeLessThanOrEqual(170);
  expect(figure.y).toBeLessThan((await box(page, '.measure p')).y);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(390);
});
