import { expect, test } from '@playwright/test';

test('patient journey reaches the shared enquiry form by scrolling', async ({
  page,
}) => {
  let interest: string | null = null;
  await page.route('**/api/participation', async (route) => {
    interest = new URLSearchParams(route.request().postData() ?? '').get(
      'study',
    );
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"ok":true}',
    });
  });
  await page.goto('/en/');
  await page.locator('#taking-part').scrollIntoViewIfNeeded();
  await page
    .getByLabel('Phone or email', { exact: true })
    .fill('participant@example.invalid');
  await page
    .getByRole('button', { name: 'Send my details', exact: true })
    .click();
  await expect(page.locator('[data-form-success]')).toBeVisible();
  expect(interest).toBe('general');
});

test('clinician journey reaches referral and dated study information in the same page', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  await page
    .getByRole('banner')
    .getByRole('link', { name: 'For clinicians', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/#home-clinicians$/);
  await expect(page.locator('#home-clinicians')).toContainText(
    'The patient contacts the team',
  );
  await page
    .locator('.desktop-nav')
    .getByRole('link', { name: 'Studies', exact: true })
    .click();
  await expect(page).toHaveURL(/#home-studies$/);
  await page.locator('#study-stay-strong').scrollIntoViewIfNeeded();
  await expect(page.locator('#study-stay-strong')).toContainText('NCT06497595');
  await expect(page.locator('#study-stay-strong time')).toHaveAttribute(
    'datetime',
    '2026-11-01',
  );
});

test('academic journey moves from research to publications and the team without a page change', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/en/');
  const menu = page.locator('.desktop-nav');
  await menu.getByRole('link', { name: 'Research', exact: true }).click();
  await expect(page).toHaveURL(/#home-research$/);
  await expect(page.locator('#study-hybrid-closed-loop')).toContainText(
    'EASD 2026',
  );
  await menu.getByRole('link', { name: 'Publications', exact: true }).click();
  await expect(page).toHaveURL(/#home-publications$/);
  await expect(
    page.locator('#home-publications [data-publication]'),
  ).toHaveCount(6);
  await menu.getByRole('link', { name: 'Team', exact: true }).click();
  await expect(page).toHaveURL(/#home-team$/);
});

test('supporting pages keep one link per destination in their content', async ({
  page,
}) => {
  for (const path of [
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
    expect(hrefs.length, path).toBe(new Set(hrefs).size);
  }
});

test('one shared participation action serves both studies', async ({
  page,
}) => {
  await page.goto('/en/');
  await expect(page.locator('main form[data-enquiry-form]')).toHaveCount(1);
  await expect(
    page.locator('#home-studies form, .home-intro .button'),
  ).toHaveCount(0);
  await expect(page.locator('#home-contact button[type="submit"]')).toHaveCount(
    1,
  );
});
