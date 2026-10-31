import { expect, test } from '@playwright/test';

test('audience shortcuts stay reachable from deep pages and small screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/studies/stay-strong/');
  const banner = page.getByRole('banner');
  await expect(
    banner.getByRole('link', { name: 'About participation', exact: true }),
  ).toHaveAttribute('href', '/en/participation/');
  await expect(
    banner.getByRole('link', { name: 'For clinicians', exact: true }),
  ).toHaveAttribute('href', '/en/for-clinicians/');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  for (const nav of await banner.locator('.desktop-nav, .utility-nav').all()) {
    await expect(nav).toBeHidden();
  }
  await page.locator('summary').click();
  const panel = page.locator('.menu-panel');
  await expect(
    panel.getByRole('link', { name: 'About participation', exact: true }),
  ).toHaveAttribute('href', '/en/participation/');
  await expect(
    panel.getByRole('link', { name: 'For clinicians', exact: true }),
  ).toHaveAttribute('href', '/en/for-clinicians/');
});

test('the group page is the team page, without duplicated role and platform sections', async ({
  page,
}) => {
  await page.goto('/en/about/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The team');
  await expect(page.locator('#people')).toContainText('GRACE-780G');
  await expect(page.locator('#connections, #six-vital')).toHaveCount(0);
  // Institutional roles survive inside the sourced profile copy.
  await expect(page.locator('#people')).toContainText(
    'Population Health Research Institute',
  );
});

test('the homepage routes visitors onward without repeating the team page', async ({
  page,
}) => {
  await page.goto('/en/');
  const team = page.locator('#home-team');
  await expect(team.getByRole('link', { name: /the team/i })).toHaveAttribute(
    'href',
    '/en/about/',
  );
  await expect(page.getByRole('main')).not.toContainText(
    'Population Health Research Institute',
  );
  const sequence = await page
    .locator('main > section')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  const order = ['home-studies', 'home-research', 'home-team', 'home-routes'];
  const indexes = order.map((id) => sequence.indexOf(id));
  expect(indexes.every((index) => index >= 0)).toBe(true);
  expect([...indexes].sort((a, b) => a - b)).toEqual(indexes);
});

test('the header remains available while scrolling', async ({ page }) => {
  await page.goto('/en/about/');
  const position = await page
    .locator('.site-header')
    .evaluate((element) => getComputedStyle(element).position);
  expect(position).toBe('sticky');
});

test('anchor jumps scroll smoothly but respect reduced motion', async ({
  page,
}) => {
  await page.goto('/en/research/');
  const behavior = () =>
    page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    );
  expect(await behavior()).toBe('smooth');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await behavior()).toBe('auto');
});

test('wide desktop screens use the full canvas', async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto('/en/');
  const container = await page
    .locator('main .container')
    .first()
    .evaluate((element) => element.getBoundingClientRect().width);
  expect(container).toBeGreaterThanOrEqual(1300);

  await page.goto('/en/about/');
  const wrap = await page
    .locator('.article-wrap')
    .evaluate((element) => element.getBoundingClientRect());
  const column = await page
    .locator('main > .container')
    .evaluate((element) => element.getBoundingClientRect());
  // Long-form columns sit inside the canvas instead of clinging to one edge.
  expect(wrap.left - column.left).toBeGreaterThan(100);
  expect(column.right - wrap.right).toBeGreaterThan(100);
});

test('every page stays fluid from phone to wide desktop', async ({ page }) => {
  for (const path of [
    '/en/',
    '/en/about/',
    '/en/studies/stay-strong/',
    '/he/',
  ]) {
    for (const width of [320, 390, 768, 1024, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`http://127.0.0.1:4173${path}`);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflow, `${path} overflows at ${width}px`).toBe(false);
    }
  }
});

test('the footer keeps support links without repeating the main navigation', async ({
  page,
}) => {
  await page.goto('/en/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('link')).toHaveText([
    'About participation',
    'Privacy',
    'Accessibility',
  ]);
});
