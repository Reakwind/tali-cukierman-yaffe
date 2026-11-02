import { expect, test } from '@playwright/test';

test('a participant can discover a dated study without a fake registration flow', async ({
  page,
}) => {
  await page.goto('/en/studies/stay-strong/');
  await expect(page).toHaveURL(/\/en\/studies\/stay-strong\/$/);
  await expect(page.locator('.page-heading .status')).toHaveText(
    'Now recruiting',
  );
  await expect(
    page.locator('bdi').filter({ hasText: 'NCT06497595' }).first(),
  ).toHaveText('NCT06497595');
  await expect(page.locator('time[datetime="2026-07-21"]')).toBeVisible();
  await expect(page.locator('#taking-part')).toBeVisible();
  await expect(page.locator('[data-consider]')).toHaveCount(0);
  await expect(page.locator('.next-steps')).toHaveCount(0);
  await expect(page.locator('textarea, [data-live-enquiry]')).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'View the official study record' }),
  ).toHaveAttribute('href', 'https://clinicaltrials.gov/study/NCT06497595');
  await page.getByRole('link', { name: 'עברית', exact: true }).click();
  await expect(page).toHaveURL(/\/he\/studies\/stay-strong\/$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('other research presents findings without a participation invitation', async ({
  page,
}) => {
  await page.goto('/en/studies/');
  const study = page.locator('[data-study="hybrid-closed-loop"]');
  await expect(study.locator('.status')).toHaveCount(0);
  await study.getByRole('link', { name: 'Read study', exact: true }).click();
  await expect(page.locator('#taking-part')).toHaveCount(0);
  await expect(
    page.locator('form, input, textarea, [data-live-enquiry]'),
  ).toHaveCount(0);
});

test('the clinician journey leads to source information without collecting patient details', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/for-clinicians/');
  await expect(page.getByRole('main')).toContainText('Do not send names');
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Explore studies', exact: true })
    .click();
  await page
    .locator('[data-study="stay-strong"]')
    .getByRole('link', { name: 'Learn about taking part' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'STAY-STRONG',
  );
  await expect(page.locator('textarea, input[type="file"]')).toHaveCount(0);
});

test('unknown deep links return a useful bilingual 404', async ({ page }) => {
  const response = await page.goto('/he/this-study-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Page not found',
  );
  await expect(
    page.getByRole('link', { name: 'לאתר בעברית', exact: true }),
  ).toHaveAttribute('href', '/he/');
});

test('a study acronym stays together in a narrow Hebrew heading', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/he/studies/stay-strong/');
  const acronym = page.getByRole('heading', { level: 1 }).locator('bdi');
  await expect(acronym).toHaveText('STAY-STRONG');
  await expect(acronym).toHaveCSS('white-space', 'nowrap');
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  ).toBe(false);
});
