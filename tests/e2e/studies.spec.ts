import { expect, test } from '@playwright/test';

test('a participant can discover a dated study without a fake registration flow', async ({
  page,
}) => {
  await page.goto('/en/');
  await page
    .getByRole('link', { name: 'Explore studies', exact: true })
    .last()
    .click();
  const study = page.locator('[data-study="stay-strong"]');
  await expect(study.locator('.status')).toHaveText('Recruiting');
  await study.getByRole('link', { name: 'Read study', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/studies\/stay-strong\/$/);
  await expect(
    page.locator('bdi').filter({ hasText: 'NCT06497595' }).first(),
  ).toHaveText('NCT06497595');
  await expect(page.locator('time[datetime="2026-07-21"]')).toBeVisible();
  await expect(page.locator('[data-enquiry-state]')).toContainText(
    'An enquiry is a question',
  );
  await expect(page.locator('[data-consider] li')).toHaveCount(4);
  await expect(page.locator('[data-consider]')).toContainText(
    'leave the study at any time',
  );
  await expect(page.locator('[data-consider]')).toContainText(
    'not joining the study',
  );
  await expect(page.locator('[data-next]')).toContainText(
    'You send a question',
  );
  await expect(page.locator('.article-wrap h2').last()).toHaveText(
    'What happens next',
  );
  await expect(
    page.locator('form, input, textarea, [data-live-enquiry]'),
  ).toHaveCount(0);
  await expect(
    page.getByRole('link', { name: 'View the official study record' }),
  ).toHaveAttribute('href', 'https://clinicaltrials.gov/study/NCT06497595');
  await page.getByRole('link', { name: 'עברית', exact: true }).click();
  await expect(page).toHaveURL(/\/he\/studies\/stay-strong\/$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('a completed study is clearly archived and never offered for enrollment', async ({
  page,
}) => {
  await page.goto('/en/studies/');
  const study = page.locator('[data-study="hybrid-closed-loop"]');
  await expect(study).toContainText('Completed');
  await study.getByRole('link', { name: 'Read study', exact: true }).click();
  await expect(page.locator('[data-enquiry-state]')).toContainText('completed');
  await expect(
    page.locator('form, input, textarea, [data-live-enquiry]'),
  ).toHaveCount(0);
});

test('the clinician journey leads to source information without collecting patient details', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'For clinicians', exact: true })
    .click();
  await expect(page.getByRole('main')).toContainText('Do not send names');
  await page
    .getByRole('main')
    .getByRole('link', { name: 'Explore studies', exact: true })
    .click();
  await page
    .locator('[data-study="stay-strong"]')
    .getByRole('link', { name: 'Read study' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'STAY-STRONG',
  );
  await expect(page.locator('form')).toHaveCount(0);
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
