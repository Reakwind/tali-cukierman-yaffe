import { expect, test } from '@playwright/test';

for (const locale of ['en', 'he']) {
  test(`${locale}: phone research keeps the relevant graphic beside readable topic text`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${locale}/`);
    const visual = page.locator('.research-visual');
    for (const topic of ['cognition', 'movement', 'technology']) {
      const heading = page.locator(`#research-${topic} h3`);
      const targetTop = await page.evaluate(
        () =>
          parseFloat(
            getComputedStyle(document.documentElement).scrollPaddingTop,
          ) +
          Math.min(innerHeight * 0.4, 340) +
          32,
      );
      await heading.evaluate(
        (element, y) =>
          scrollTo({
            top: element.getBoundingClientRect().top + scrollY - y,
            behavior: 'instant',
          }),
        targetTop,
      );
      await expect(page.locator('.research-story')).toHaveAttribute(
        'data-research-focus',
        topic,
      );
      const art = (await visual.boundingBox())!;
      const title = (await heading.boundingBox())!;
      const header = (await page.locator('.site-header').boundingBox())!;
      expect(art.y).toBeGreaterThanOrEqual(header.height);
      expect(art.y).toBeLessThan(header.height + 50);
      expect(title.y).toBeGreaterThanOrEqual(art.y + art.height + 16);
      expect(title.y + title.height).toBeLessThan(844 - 24);
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(visual).toHaveCSS('position', 'relative');
    for (const heading of await page.locator('[data-research-step] h3').all()) {
      await heading.scrollIntoViewIfNeeded();
      await expect(heading).toBeInViewport();
    }
  });
}

test('the fallback preserves depth and stops immediately when reduced motion is requested', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const supports = CSS.supports.bind(CSS);
    CSS.supports = ((...args: [string, string?]) =>
      args[0].includes('animation-timeline')
        ? false
        : args.length === 1
          ? supports(args[0])
          : supports(args[0], args[1]!)) as typeof CSS.supports;
  });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');
  await expect(page.locator('html')).toHaveAttribute(
    'data-parallax-engine',
    'js',
  );
  const layers = page.locator('[data-hero-visual] [data-parallax-layer]');
  const position = () =>
    layers.evaluateAll((elements) =>
      elements.map(
        (element) =>
          new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
      ),
    );
  const before = await position();
  await page.evaluate(() => scrollBy({ top: 600, behavior: 'instant' }));
  await expect
    .poll(async () => {
      const after = await position();
      return Math.abs(after[2]! - before[2]! - (after[0]! - before[0]!));
    })
    .toBeGreaterThan(100);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      page
        .locator(
          '[data-hero-visual] [data-parallax-layer], [data-hero-visual] [data-scroll-detail]',
        )
        .evaluateAll((elements) =>
          elements.every(
            (element) =>
              getComputedStyle(element).transform === 'none' &&
              element.getAnimations().length === 0,
          ),
        ),
    )
    .toBe(true);
});

for (const locale of ['en', 'he']) {
  test(`${locale}: six visual parts keep the agreed reading order`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    expect(
      await page
        .locator('[data-content-part]')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('data-content-part')),
        ),
    ).toEqual([
      'menu',
      'hero',
      'research',
      'studies',
      'participation',
      'footer',
    ]);
    expect(
      await page.locator('main [data-diabetes-icon]').count(),
    ).toBeGreaterThanOrEqual(12);
    await expect(
      page.locator(
        '[data-diabetes-icon="brain"], [data-diabetes-icon="person"]',
      ),
    ).toHaveCount(0);
    await expect(
      page.locator(
        '[data-hero-visual] [data-art-direction="geometric-devices"]',
      ),
    ).toHaveCount(1);
    await expect(
      page.locator('#study-stay-strong [data-visit-week]'),
    ).toHaveCount(4);
    expect(
      await page
        .locator('#study-stay-strong [data-visit-week]')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('data-visit-week')),
        ),
    ).toEqual(['0', '8', '16', '26']);
    await expect(page.locator('main form')).toHaveCount(1);
  });
}

test('the hero is visually led and its depth layers separate substantially on scroll', async ({
  page,
  browserName,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');
  const visual = await page.locator('[data-hero-visual]').boundingBox();
  const copy = await page.locator('.intro-copy').boundingBox();
  expect(visual).not.toBeNull();
  expect(copy).not.toBeNull();
  expect(visual!.width / (visual!.width + copy!.width)).toBeGreaterThanOrEqual(
    0.6,
  );
  const far = page.locator('[data-hero-visual] [data-parallax-layer="far"]');
  const near = page.locator('[data-hero-visual] [data-parallax-layer="near"]');
  const y = async (locator: typeof far) =>
    locator.evaluate(
      (element) =>
        new DOMMatrixReadOnly(getComputedStyle(element).transform).m42,
    );
  const before = { far: await y(far), near: await y(near) };
  if (browserName === 'webkit' && isMobile)
    await page.evaluate(() => scrollBy({ top: 600, behavior: 'instant' }));
  else await page.mouse.wheel(0, 600);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await expect
    .poll(async () =>
      Math.abs((await y(near)) - before.near - ((await y(far)) - before.far)),
    )
    .toBeGreaterThan(100);
  expect((await page.locator('.site-header').boundingBox())!.y).toBe(0);
});
