import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const enNames = [
  'Tali Cukierman-Yaffe',
  'Naama Peltz-Sinvani',
  'Hagar Shimon',
  'Yasmin Alt',
  'Tal Yahalom-Peri',
  'Itay Cohen',
];
const heNames = [
  'טלי צוקרמן',
  'נעמה פלץ',
  'הגר שמעון',
  'יסמין אלט',
  'טל יהלום',
  'איתי כהן',
];

test('the group page presents the sourced six-person team', async ({
  page,
}) => {
  await page.goto('/en/about/');
  const team = page.locator('#people');
  for (const name of enNames) {
    await expect(team).toContainText(name);
  }
  await expect(team).toContainText('GRACE-780G');
  await expect(team).toContainText('STAY-STRONG');
  await expect(team).not.toContainText(
    'will be added after research-team review',
  );
});

test('team portraits load and carry names in alt text', async ({ page }) => {
  await page.goto('/en/about/');
  const team = page.locator('#people');
  await expect(team.locator('img')).toHaveCount(4);
  const alts = await team
    .locator('img')
    .evaluateAll((images) =>
      images.map((image) => image.getAttribute('alt') ?? ''),
    );
  for (const fragment of [
    'Tali Cukierman-Yaffe',
    'Naama Peltz-Sinvani',
    'Tal Yahalom-Peri',
    'Itay Cohen',
  ]) {
    expect(alts.join(' | ')).toContain(fragment);
  }
  for (const alt of alts) {
    expect(alt.length).toBeGreaterThan(8);
  }
  // Lazy portraits below the fold must actually decode once scrolled into view.
  for (const image of await team.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
  }
  await page.waitForFunction(() =>
    [...document.querySelectorAll('#people img')].every(
      (image) =>
        (image as HTMLImageElement).complete &&
        (image as HTMLImageElement).naturalWidth > 0,
    ),
  );
});

test('mixed-direction study names inside profiles are isolated', async ({
  page,
}) => {
  await page.goto('/en/about/');
  const team = page.locator('#people');
  for (const token of ['GRACE-780G', 'STAY-STRONG']) {
    const isolated = team.locator('bdi').filter({ hasText: token });
    expect(await isolated.count()).toBeGreaterThan(0);
    await expect(isolated.first()).toBeVisible();
  }
});

test('the Hebrew group page mirrors the roster in RTL', async ({ page }) => {
  await page.goto('/he/about/');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  const team = page.locator('#people');
  for (const name of heNames) {
    await expect(team).toContainText(name);
  }
  await expect(team.locator('img')).toHaveCount(4);
});

test('team profiles include no contact details or forms', async ({ page }) => {
  for (const locale of ['en', 'he']) {
    await page.goto(`/${locale}/about/`);
    await expect(
      page
        .locator('#people')
        .locator('a[href^="mailto:"], a[href^="tel:"], form, input, textarea'),
    ).toHaveCount(0);
  }
});

test('the group page has no automatically detectable accessibility violations', async ({
  page,
}) => {
  for (const locale of ['en', 'he']) {
    await page.goto(`/${locale}/about/`);
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
