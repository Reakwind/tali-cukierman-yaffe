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

for (const locale of ['en', 'he']) {
  test(`${locale}: hero and research scenes keep all instruments unclipped inside their frames during scroll`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`/${locale}/`);

    const pin = page.locator('.hero-pin');
    const heroLayers = page.locator('[data-hero-visual] [data-parallax-layer]');
    for (const scrollTop of [0, 600]) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: 'instant' }),
        scrollTop,
      );
      const pinBox = (await pin.boundingBox())!;
      for (const layer of await heroLayers.all()) {
        const box = (await layer.boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(pinBox.y);
        expect(box.y + box.height).toBeLessThanOrEqual(
          pinBox.y + pinBox.height,
        );
      }
    }

    const visual = page.locator('.research-visual');
    const backdrop = page
      .locator('.research-scene [data-parallax-layer="far"] rect')
      .first();
    const icons = page.locator('.research-scene .icon-lines');
    for (const topic of ['cognition', 'movement', 'technology']) {
      const heading = page.locator(`#research-${topic} h3`);
      await heading.evaluate((element) =>
        scrollTo({
          top: element.getBoundingClientRect().top + scrollY - 420,
          behavior: 'instant',
        }),
      );
      await expect(page.locator('.research-story')).toHaveAttribute(
        'data-research-focus',
        topic,
      );
      const headerBox = (await page.locator('.site-header').boundingBox())!;
      const sectionTitleBox = (await page
        .locator('#research-title')
        .boundingBox())!;
      const straddlesHeader =
        sectionTitleBox.y < headerBox.y + headerBox.height &&
        sectionTitleBox.y + sectionTitleBox.height >
          headerBox.y + headerBox.height;
      expect(straddlesHeader).toBe(false);

      const visualBox = (await visual.boundingBox())!;
      const backdropBox = (await backdrop.boundingBox())!;
      for (const icon of await icons.all()) {
        const box = (await icon.boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(visualBox.y);
        expect(box.y + box.height).toBeLessThanOrEqual(
          visualBox.y + visualBox.height,
        );
        expect(box.y).toBeGreaterThanOrEqual(backdropBox.y);
        expect(box.y + box.height).toBeLessThanOrEqual(
          backdropBox.y + backdropBox.height,
        );
      }
      if (topic === 'technology') {
        const methodsBox = (await page
          .locator('#research-methods')
          .boundingBox())!;
        expect(methodsBox.y).toBeGreaterThanOrEqual(
          visualBox.y + visualBox.height + 24,
        );
      }
    }

    const methodsVisual = page.locator('.methods-visual');
    const methodsBackdrop = page
      .locator('.methods-scene [data-parallax-layer="far"] rect')
      .first();
    const methodsIcons = page.locator('.methods-scene .icon-lines');
    for (const step of ['six-vital', 'ml-frailty', 'interventions']) {
      const heading = page.locator(`#method-${step} h3`);
      await heading.evaluate((element) =>
        scrollTo({
          top: element.getBoundingClientRect().top + scrollY - 420,
          behavior: 'instant',
        }),
      );
      await expect(page.locator('.methods-story')).toHaveAttribute(
        'data-methods-focus',
        step,
      );
      const visualBox = (await methodsVisual.boundingBox())!;
      const backdropBox = (await methodsBackdrop.boundingBox())!;
      for (const icon of await methodsIcons.all()) {
        const box = (await icon.boundingBox())!;
        expect(box.y).toBeGreaterThanOrEqual(visualBox.y);
        expect(box.y + box.height).toBeLessThanOrEqual(
          visualBox.y + visualBox.height,
        );
        expect(box.y).toBeGreaterThanOrEqual(backdropBox.y);
        expect(box.y + box.height).toBeLessThanOrEqual(
          backdropBox.y + backdropBox.height,
        );
      }
    }
  });
}

test('continuous parallax guides depth across all content sections without misaligning cards or colliding rows', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');

  for (const part of [
    'hero',
    'research',
    'studies',
    'participation',
    'footer',
  ]) {
    const partEl = page.locator(`[data-content-part="${part}"]`);
    expect(
      await page
        .locator(
          `[data-content-part="${part}"].parallax-scene, [data-content-part="${part}"] .parallax-scene`,
        )
        .count(),
      `Missing parallax-scene in ${part}`,
    ).toBeGreaterThan(0);
    expect(
      await partEl.locator('[data-parallax-layer="far"]').count(),
      `Missing far layer in ${part}`,
    ).toBeGreaterThan(0);
    expect(
      await partEl.locator('[data-parallax-layer="middle"]').count(),
      `Missing middle layer in ${part}`,
    ).toBeGreaterThan(0);
    expect(
      await partEl.locator('[data-parallax-layer="near"]').count(),
      `Missing near layer in ${part}`,
    ).toBeGreaterThan(0);
  }

  for (const selector of [
    '#research-methods .methods-story',
    '#study-birax',
    '#study-stay-strong',
    '#home-clinicians',
    '#home-contact',
    '#home-publications',
  ]) {
    const scene = page.locator(selector);
    const far = scene.locator('[data-parallax-layer="far"]').first();
    const near = scene.locator('[data-parallax-layer="near"]').first();
    const y = (loc: typeof far) =>
      loc.evaluate(
        (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42,
      );

    await scene.evaluate((el) =>
      scrollTo({
        top: Math.max(0, el.getBoundingClientRect().top + scrollY - 720),
        behavior: 'instant',
      }),
    );
    const startDelta = (await y(near)) - (await y(far));

    await scene.evaluate((el) => {
      const rect = el.getBoundingClientRect();
      scrollTo({
        top: Math.max(0, rect.top + scrollY + Math.max(200, rect.height - 650)),
        behavior: 'instant',
      });
    });
    await expect
      .poll(async () => Math.abs((await y(near)) - (await y(far)) - startDelta))
      .toBeGreaterThan(45);
  }

  // Verify STAY-STRONG rows never collide on scroll
  const stayStrong = page.locator('#study-stay-strong');
  await stayStrong.scrollIntoViewIfNeeded();
  const timelineBox = (await stayStrong
    .locator('.study-timeline')
    .boundingBox())!;
  const weeklyBox = (await stayStrong.locator('.weekly-plan').boundingBox())!;
  expect(weeklyBox.y).toBeGreaterThanOrEqual(
    timelineBox.y + timelineBox.height + 8,
  );

  // Verify Team portraits stay aligned on the same horizontal row
  await page.locator('#home-team').scrollIntoViewIfNeeded();
  const portraitTops = await page
    .locator('#home-team .portrait-strip > article')
    .evaluateAll((els) =>
      els.map((el) => Math.round(el.getBoundingClientRect().top)),
    );
  expect(new Set(portraitTops).size).toBe(1);
});
