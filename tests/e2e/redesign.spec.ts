import { expect, test } from '@playwright/test';

test('the root opens the research homepage without a language gate', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Diabetes,\s*cognition\s*& aging\./,
  );
  await expect(
    page.getByRole('banner').getByRole('link', {
      name: 'The Cukierman-Yaffe research group',
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.locator('main form')).toHaveCount(1);
});

test('desktop navigation keeps short content and audience shortcuts', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const path of [
    '/en/',
    '/en/research/',
    '/en/studies/',
    '/en/publications/',
  ]) {
    await page.goto(path);
    const navigation = page.locator('.desktop-nav');
    await expect(navigation.getByRole('link')).toHaveText([
      'Studies',
      'Research',
      'Team',
      'Publications',
    ]);
    await expect(navigation.locator('details, button')).toHaveCount(0);
    await expect(
      page
        .getByRole('banner')
        .getByRole('link', { name: 'About participation', exact: true }),
    ).toHaveAttribute('href', '/en/#taking-part');
    await expect(
      page
        .getByRole('banner')
        .getByRole('link', { name: 'For clinicians', exact: true }),
    ).toHaveAttribute('href', '/en/#home-clinicians');
  }
});

test('the homepage has the requested research, studies, contact sequence', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Diabetes,\s*cognition\s*& aging\./,
  );
  const sequence = await page
    .locator('main > section[id]')
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(sequence).toEqual(['home-research', 'home-studies', 'home-contact']);
  await expect(page.locator('#home-research .area-art')).toHaveCount(3);
  await expect(page.locator('#home-studies [data-study]')).toHaveCount(2);
  await expect(
    page.locator('.hero-panel, .orbit, .path-card, #home-updates'),
  ).toHaveCount(0);
  expect(await page.locator('body').innerText()).not.toMatch(
    /Aging well|Living fully|Three perspectives|The next question starts here|Science, with people at its heart|Room for shared questions/i,
  );
});

test('the Hebrew page carries the same content and study information', async ({
  page,
}) => {
  await page.goto('/he/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /סוכרת,\s*קוגניציה\s*והזדקנות\./,
  );
  await expect(page.locator('#home-research .area-art')).toHaveCount(3);
  await expect(page.locator('#home-research .method-art')).toHaveCount(3);
  await expect(page.locator('#home-studies [data-study]')).toHaveCount(2);
  await expect(page.locator('#research-methods')).toContainText('6 Vital');
  await expect(page.locator('main form')).toHaveCount(1);
  await expect(page.locator('[data-live-enquiry]')).toHaveCount(0);
});
