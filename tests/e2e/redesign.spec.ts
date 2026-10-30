import { expect, test } from '@playwright/test';

test('the root opens the research homepage directly, without a language gate', async ({
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
  await expect(
    page
      .getByRole('main')
      .getByRole('link', { name: 'Explore studies', exact: true }),
  ).toHaveAttribute('href', '/en/studies/');
});

test('desktop navigation exposes five real destinations consistently', async ({
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
      'Our research',
      'Publications',
      'The group',
      'For clinicians',
    ]);
    await expect(navigation.locator('details, button')).toHaveCount(0);
  }
});

test('the homepage leads with specific research and study information instead of slogans', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /Diabetes,\s*cognition\s*& aging\./,
  );
  await expect(page.getByRole('main')).toContainText(
    'Prof. Tali Cukierman-Yaffe',
  );
  const studies = page.getByRole('region', { name: 'Studies', exact: true });
  await expect(studies).toContainText('STAY-STRONG');
  await expect(studies).toContainText('Registry lists recruiting');
  const sequence = await page
    .locator('main > section')
    .evaluateAll((nodes) => nodes.map((node) => node.id));
  expect(sequence.indexOf('home-studies')).toBeLessThan(
    sequence.indexOf('home-research'),
  );
  await expect(page.locator('.hero-panel, .orbit, .path-card')).toHaveCount(0);
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(
    /Aging well|Living fully|Three perspectives|The next question starts here|Science, with people at its heart|Room for shared questions/i,
  );
});

test('the Hebrew revision has the same factual content and study access', async ({
  page,
}) => {
  await page.goto('/he/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    /סוכרת,\s*קוגניציה\s*והזדקנות\./,
  );
  await expect(page.getByRole('main')).toContainText('פרופ׳ טלי צוקרמן־יפה');
  await expect(
    page.getByRole('region', { name: 'מחקרים', exact: true }),
  ).toContainText('STAY-STRONG');
  await expect(page.locator('body')).not.toContainText('שלוש נקודות מבט');
  await expect(page.locator('form, [data-live-enquiry]')).toHaveCount(0);
});
