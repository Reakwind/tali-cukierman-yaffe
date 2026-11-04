import { expect, test, type Page } from '@playwright/test';
import { buildPrototype } from '../../scripts/prototype.ts';

// Scroll behaviour of the one-page draft (owner chose option C, 2026-11-03):
// orientation (a reading line, titles that stay with their section) plus
// drawings that arrive once. Text never moves; the page is complete at rest.

// Built in memory: parallel workers never share a half-written file.
const draft = () => buildPrototype();

// These tests set desktop viewports. At the iPhone project's 3x pixel density
// a 1440x900 frame is 4320x2700 pixels, nine times the work, and under a busy
// CPU WebKit starved the animations being measured (13-15 of 15 runs failed
// at 10 workers). Pixel density does not change scroll or animation logic.
test.use({ deviceScaleFactor: 1 });

const viewport =
  '<meta name="viewport" content="width=device-width, initial-scale=1">';

const open = async (page: Page, width: number, height: number) => {
  await page.setViewportSize({ width, height });
  await page.setContent(viewport + (await draft()), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
};

const scaleX = (page: Page, selector: string, pseudo = '::after') =>
  page.evaluate(
    ([s, p]) => {
      const t = getComputedStyle(document.querySelector(s!)!, p).transform;
      return t === 'none' ? 1 : new DOMMatrix(t).a;
    },
    [selector, pseudo],
  );

const scrollTo = (page: Page, y: number) =>
  page.evaluate((top) => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, top);
  }, y);

test('a reading line under the header grows with the page', async ({
  page,
}) => {
  await open(page, 1440, 900);
  test.skip(
    !(await page.evaluate(() => CSS.supports('animation-timeline: scroll()'))),
    'no scroll timelines in this browser: the line is simply absent',
  );
  expect(await scaleX(page, '.site-header')).toBeLessThan(0.05);
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight - innerHeight,
  );
  await scrollTo(page, height / 2);
  await expect.poll(() => scaleX(page, '.site-header')).toBeGreaterThan(0.4);
  expect(await scaleX(page, '.site-header')).toBeLessThan(0.6);
  await scrollTo(page, height);
  await expect.poll(() => scaleX(page, '.site-header')).toBeGreaterThan(0.95);
});

test('section titles stay beside their section on desktop', async ({
  page,
}) => {
  await open(page, 1440, 900);
  const top = await page.evaluate(
    () => document.getElementById('research')!.offsetTop + 600,
  );
  await scrollTo(page, top);
  const title = await page.locator('#research-h').boundingBox();
  const header = await page.locator('.site-header').boundingBox();
  expect(title!.y).toBeGreaterThanOrEqual(header!.height);
  expect(title!.y).toBeLessThan(header!.height + 64);
});

// Records each animation in the painting as it starts. It goes before the
// page's own script, so it sees the drawing from its first frame however long
// loading and fonts take; counting running animations after load raced them.
const recorder = `<script>
  window.artStarts = [];
  document.addEventListener('animationstart', (e) => {
    if (e.target instanceof Element && e.target.closest('.art'))
      window.artStarts.push([e.target, e.animationName]);
  }, true);
</script>`;

test('the painting draws itself once, then rests complete', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setContent(viewport + recorder + (await draft()), {
    waitUntil: 'load',
  });
  const running = () =>
    page.evaluate(
      () =>
        document.getAnimations().filter((a) => {
          const t = (a.effect as KeyframeEffect | null)?.target;
          return t instanceof Element && t.closest('.art');
        }).length,
    );
  await expect.poll(running, { timeout: 6000 }).toBe(0);
  const drawn = await page.evaluate(() => {
    const starts = (window as unknown as { artStarts: [Element, string][] })
      .artStarts;
    const byElement = new Map<Element, string[]>();
    for (const [el, name] of starts)
      byElement.set(el, [...(byElement.get(el) ?? []), name]);
    return {
      parts: byElement.size,
      names: [...new Set(starts.map(([, name]) => name))].sort(),
      repeated: [...byElement.values()].filter((n) => n.length > 1).length,
    };
  });
  expect(drawn.parts).toBeGreaterThanOrEqual(3);
  expect(drawn.names).toEqual(['lens-in', 'paint-in', 'settle']);
  expect(drawn.repeated, 'each part draws once').toBe(0);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector('.art .course')!).clipPath,
    ),
  ).toBe('none');
});

test('only drawings move: no text is animated while scrolling', async ({
  page,
}) => {
  await open(page, 1440, 900);
  const moving = new Set<string>();
  const height = await page.evaluate(
    () => document.documentElement.scrollHeight,
  );
  for (let y = 0; y < height; y += 300) {
    await scrollTo(page, y);
    await page.waitForTimeout(60);
    const now = await page.evaluate(() =>
      document.getAnimations().map((a) => {
        const effect = a.effect as KeyframeEffect | null;
        const t = effect?.target as Element | null;
        if (!t) return 'unknown';
        if (effect?.pseudoElement) return 'drawing';
        if (t.closest('.art') || t.matches('.measure figure')) return 'drawing';
        return t.outerHTML.slice(0, 60);
      }),
    );
    now.forEach((n) => moving.add(n));
  }
  expect([...moving].filter((n) => n !== 'drawing')).toEqual([]);
});

test('rules draw in as they arrive, and are drawn at once after a menu jump', async ({
  page,
}) => {
  await open(page, 1440, 900);
  // Below the first screen, the study rule waits to be drawn.
  expect(await scaleX(page, '#birax')).toBeLessThan(0.05);
  // The research rule is reached by scrolling and draws in.
  const research = await page.evaluate(
    () =>
      document.querySelector('.areas')!.getBoundingClientRect().top + scrollY,
  );
  await scrollTo(page, research - 400);
  await expect.poll(() => scaleX(page, '.areas')).toBeGreaterThan(0.99);
  // A menu jump arrives with everything already drawn.
  await page.getByRole('link', { name: 'Publications' }).click();
  expect(await scaleX(page, '#birax')).toBeGreaterThan(0.99);
  expect(await scaleX(page, '.pubs')).toBeGreaterThan(0.99);
});

test('with reduced motion nothing moves and everything is drawn', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, 1440, 900);
  expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  expect(await scaleX(page, '#birax')).toBe(1);
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector('#birax')!).borderTopColor,
    ),
  ).toBe('rgb(232, 56, 128)');
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('.measure figure')!).opacity,
    ),
  ).toBe('1');
});

test('without JavaScript the page is complete', async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.setContent(viewport + (await draft()), { waitUntil: 'load' });
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector('#birax')!).borderTopColor,
    ),
  ).toBe('rgb(232, 56, 128)');
  expect(
    await page.evaluate(
      () =>
        getComputedStyle(document.querySelector('.measure figure')!).opacity,
    ),
  ).toBe('1');
  expect(
    await page.evaluate(
      () => getComputedStyle(document.querySelector('.art .course')!).clipPath,
    ),
  ).toBe('none');
  await context.close();
});
