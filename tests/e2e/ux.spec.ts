import { expect, test } from '@playwright/test';

test('audience shortcuts stay reachable from deep pages and small screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/en/studies/stay-strong/');
  const banner = page.getByRole('banner');
  await expect(
    banner.getByRole('link', { name: 'About participation', exact: true }),
  ).toHaveAttribute('href', '/en/#taking-part');
  await expect(
    banner.getByRole('link', { name: 'For clinicians', exact: true }),
  ).toHaveAttribute('href', '/en/#home-clinicians');

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  for (const nav of await banner.locator('.desktop-nav, .utility-nav').all()) {
    await expect(nav).toBeHidden();
  }
  await page.locator('.mobile-menu summary').click();
  const panel = page.locator('.menu-panel');
  await expect(
    panel.getByRole('link', { name: 'About participation', exact: true }),
  ).toHaveAttribute('href', '/en/#taking-part');
  await expect(
    panel.getByRole('link', { name: 'For clinicians', exact: true }),
  ).toHaveAttribute('href', '/en/#home-clinicians');
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

test('the homepage gives collaborators and prospective students a direct contact', async ({
  page,
}) => {
  for (const locale of ['en', 'he']) {
    await page.goto(`/${locale}/`);
    const contact = page.locator('.professional-contact');
    await expect(
      contact.getByRole('link', {
        name:
          locale === 'en'
            ? 'Email Prof. Cukierman-Yaffe'
            : 'כתבו לפרופ׳ צוקרמן־יפה',
        exact: true,
      }),
    ).toHaveAttribute('href', 'mailto:tcukierm@gmail.com');
  }
  const sequence = await page
    .locator('main > section')
    .evaluateAll((nodes) => nodes.map((node) => node.id).filter(Boolean));
  expect(sequence).toEqual(['home-research', 'home-studies', 'home-contact']);
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

test('the participation page is minimal and action-first', async ({ page }) => {
  for (const [locale, button, forbidden] of [
    ['en', 'Send my details', ['placebo', 'cost', 'medicines']],
    ['he', 'שלחו את הפרטים שלי', ['פלסבו', 'עלות', 'התרופות']],
  ] as const) {
    await page.goto(`/${locale}/participation/`);
    const main = page.getByRole('main');
    // No speculative disclosure about costs, placebo, or medication handling.
    for (const term of forbidden) {
      await expect(main).not.toContainText(term);
    }
    // Visitors can enquire without choosing a study or answering medical questions.
    await expect(main.locator('.article-section:not(.sources)')).toHaveCount(0);
    const form = main.locator('form[data-enquiry-form]');
    await expect(
      form.getByRole('button', { name: button, exact: true }),
    ).toBeVisible();
    await expect(form.locator('input[name="study"]')).toHaveValue('general');
    await expect(form.locator('input:not([type="hidden"])')).toHaveCount(2);
    await expect(
      main.locator('select, textarea, input[type="file"], .sources'),
    ).toHaveCount(0);
  }
});

test('the team page leads with Tali, lists students by degree, and invites applicants', async ({
  page,
}) => {
  await page.goto('/en/about/');
  const people = page.locator('#people');
  await expect(people.locator('.pi')).toContainText(
    'Prof. Tali Cukierman-Yaffe',
  );
  await expect(people).toContainText('Current students');
  const students = people.locator('.member-grid').nth(1);
  await expect(students).toContainText('MSc');
  await expect(students).toContainText('PhD');
  await expect(
    people.getByRole('link', { name: 'Email Prof. Cukierman-Yaffe' }),
  ).toHaveAttribute('href', 'mailto:tcukierm@gmail.com');
});

test('the footer keeps support links without repeating the main navigation', async ({
  page,
}) => {
  await page.goto('/en/');
  const footer = page.getByRole('contentinfo');
  await expect(footer.locator('.footer-links').getByRole('link')).toHaveText([
    'Privacy',
    'Accessibility',
  ]);
});
