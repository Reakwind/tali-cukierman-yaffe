import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';

test('the continuous page runs under the production content security policy', async ({
  page,
}) => {
  const policy = readFileSync('public/_headers', 'utf8')
    .split('\n')
    .find((line) => line.trimStart().startsWith('Content-Security-Policy:'))!
    .trim()
    .slice('Content-Security-Policy: '.length);
  const errors: string[] = [];
  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /Content Security Policy/i.test(message.text())
    )
      errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.route('**/en/', async (route) => {
    const response = await route.fetch();
    await route.fulfill({
      response,
      headers: { ...response.headers(), 'Content-Security-Policy': policy },
    });
  });
  await page.goto('/en/');
  await page.locator('#home-team').scrollIntoViewIfNeeded();
  expect(errors).toEqual([]);
});

for (const locale of ['en', 'he']) {
  test(`${locale}: the complete site content is in one continuous document`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    expect(
      await page
        .locator('main > section[id]')
        .evaluateAll((sections) => sections.map((section) => section.id)),
    ).toEqual(['home-research', 'home-studies', 'home-contact']);
    await expect(page.locator('#home-studies [data-study]')).toHaveCount(2);
    await expect(
      page.locator('#home-studies [data-study-details]'),
    ).toHaveCount(2);
    await expect(page.locator('main form[data-enquiry-form]')).toHaveCount(1);
    await expect(
      page.locator('#home-publications [data-publication]'),
    ).toHaveCount(6);
    await expect(
      page.locator('#home-team .member, #home-team .pi'),
    ).toHaveCount(6);
    for (const id of [
      'home-research',
      'home-clinicians',
      'privacy',
      'accessibility',
    ]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
    await expect(
      page.locator('main select, main textarea, main input[type="file"]'),
    ).toHaveCount(0);
  });
}

test('menu shortcuts retain native fragments, Back, and visible keyboard focus', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');
  const menu = page.locator('.desktop-nav');
  await menu.getByRole('link', { name: 'Publications', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/#home-publications$/);
  const section = page.locator('#home-publications');
  await expect(section).toBeFocused();
  expect((await section.boundingBox())!.y).toBeGreaterThanOrEqual(
    (await page.locator('.site-header').boundingBox())!.height,
  );
  await menu.getByRole('link', { name: 'Team', exact: true }).click();
  await expect(page).toHaveURL(/#home-team$/);
  await page.goBack();
  await expect(page).toHaveURL(/#home-publications$/);
});

test('parallax is optional and never moves the reading text or form controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/en/');
  const art = page.locator('[data-hero-visual] [data-parallax-layer="near"]');
  if (await page.evaluate(() => CSS.supports('animation-timeline', 'view()'))) {
    expect(
      await art.evaluate(
        (element) => getComputedStyle(element).animationTimeline,
      ),
    ).toBe('--scene');
  }
  await expect(page.locator('.intro-text')).toHaveCSS('transform', 'none');
  await expect(page.locator('input[name="contact"]')).toHaveCSS(
    'transform',
    'none',
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(art).toHaveCSS('animation-name', 'none');
  await expect(art).toHaveCSS('transform', 'none');
});

test('native scrolling moves the illustration depth while the menu stays fixed', async ({
  page,
  browserName,
  isMobile,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');
  const art = page.locator('[data-hero-visual] [data-parallax-layer="near"]');
  const initial = await art.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  // The mobile WebKit driver has no wheel command; verify its native scroll path.
  if (browserName === 'webkit' && isMobile)
    await page.evaluate(() =>
      window.scrollBy({ top: 400, behavior: 'instant' }),
    );
  else await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  if (await page.evaluate(() => CSS.supports('animation-timeline', 'view()'))) {
    await expect
      .poll(() =>
        art.evaluate((element) => getComputedStyle(element).transform),
      )
      .not.toBe(initial);
  }
  expect((await page.locator('.site-header').boundingBox())!.y).toBe(0);
  await expect(page.locator('.intro-text')).toHaveCSS('transform', 'none');
});

test('section orientation survives portrait and landscape resizing', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/en/');
  for (const [width, height] of [
    [1440, 900],
    [390, 844],
    [844, 390],
  ]) {
    await page.setViewportSize({ width: width!, height: height! });
    await page.locator('#home-publications').scrollIntoViewIfNeeded();
    await expect(
      page.locator('.desktop-nav [data-section-link="home-publications"]'),
    ).toHaveAttribute('aria-current', 'location');
    if (width! < 950) {
      await page.locator('.mobile-menu summary').click();
      await expect(
        page
          .locator('.menu-panel')
          .getByRole('link', { name: 'Publications', exact: true }),
      ).toHaveAttribute('aria-current', 'location');
      await page.keyboard.press('Escape');
    }
  }
});

test('scrolling updates section orientation without changing browser history', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/');
  await page.locator('#home-publications').scrollIntoViewIfNeeded();
  await expect(
    page
      .locator('.desktop-nav')
      .getByRole('link', { name: 'Publications', exact: true }),
  ).toHaveAttribute('aria-current', 'location');
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(
    page.getByRole('link', { name: 'עברית', exact: true }),
  ).toHaveAttribute('href', '/he/#home-publications');
});

test('all content and anchor navigation remain usable without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/he/');
  await page.locator('.mobile-menu summary').click();
  await page
    .locator('.menu-panel')
    .getByRole('link', { name: 'הצוות', exact: true })
    .click();
  await expect(page).toHaveURL(/\/he\/#home-team$/);
  await page.locator('.mobile-menu summary').click();
  await expect(page.locator('#home-team')).toBeVisible();
  for (const id of [
    'home-studies',
    'taking-part',
    'home-research',
    'home-publications',
    'home-clinicians',
    'privacy',
    'accessibility',
  ]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await expect(page.locator(`#${id}`)).toBeVisible();
    expect(
      await page
        .locator(`#${id}`)
        .evaluate((element) => getComputedStyle(element).opacity),
    ).toBe('1');
  }
  await context.close();
});

test('reduced motion removes reveal movement and keeps the mobile shortcut usable', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  await page.locator('.mobile-menu summary').click();
  await page
    .locator('.menu-panel')
    .getByRole('link', { name: 'Research', exact: true })
    .click();
  await expect(page).toHaveURL(/#home-research$/);
  await expect(page.locator('.mobile-menu')).not.toHaveAttribute('open');
  await expect(page.locator('#home-research')).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe('auto');
  expect(
    await page.evaluate(
      () =>
        document
          .getAnimations()
          .filter((animation) => animation.playState === 'running').length,
    ),
  ).toBe(0);
});
