import { expect, test } from '@playwright/test';

test('patient journey reaches a study and participation guidance', async ({
  page,
}) => {
  await page.goto('/en/');
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Explore studies', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/studies\/$/);
  await page
    .locator('[data-study="stay-strong"]')
    .getByRole('link', { name: 'Read study' })
    .click();
  await expect(page).toHaveURL(/\/en\/studies\/stay-strong\/$/);
  await page
    .getByRole('main')
    .getByRole('link', { name: 'About participation', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/participation\/$/);
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Explore studies', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/studies\/$/);
});

test('clinician journey finds referral guidance and the study record', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'For clinicians', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/for-clinicians\/$/);
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Explore studies', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/studies\/$/);
  await page
    .locator('[data-study="stay-strong"]')
    .getByRole('link', { name: 'Read study' })
    .click();
  await expect(page).toHaveURL(/\/en\/studies\/stay-strong\/$/);
  const record = page
    .getByRole('main')
    .getByRole('link', { name: 'View the official study record' });
  await expect(record).toHaveCount(1);
  await expect(record).toHaveAttribute('href', /clinicaltrials\.gov/);
});

test('academic journey moves from a research theme to publications and the team', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Diabetes & cognitive function' })
    .click();
  await expect(page).toHaveURL(/\/en\/research\/#cognition$/);
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Selected publications' })
    .click();
  await expect(page).toHaveURL(/\/en\/publications\/$/);
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'Team', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/about\/$/);
});

test('each page keeps one link per destination in its content', async ({
  page,
}) => {
  for (const path of [
    '/en/',
    '/en/studies/',
    '/en/studies/stay-strong/',
    '/en/research/',
    '/en/for-clinicians/',
    '/en/participation/',
  ]) {
    await page.goto(path);
    const hrefs = await page
      .locator('main a')
      .evaluateAll((links) =>
        links.map((link) => link.getAttribute('href')).filter(Boolean),
      );
    expect(
      hrefs.length,
      `${path} links the same destination more than once`,
    ).toBe(new Set(hrefs).size);
  }
});

test('the home hero carries one primary action and honest affiliation labels', async ({
  page,
}) => {
  await page.goto('/en/');
  const hero = page.locator('.home-intro');
  await expect(
    hero.getByRole('link', { name: 'Explore studies', exact: true }),
  ).toHaveCount(1);
  // Audience shortcuts live in the header, not repeated in the hero.
  await expect(hero.getByRole('link', { name: /For clinicians/ })).toHaveCount(
    0,
  );
  // Institution names are context, not links to unrelated profiles.
  await expect(hero.locator('.institution-links a')).toHaveCount(0);
});
