import { expect, test } from '@playwright/test';

for (const locale of ['en', 'he'] as const) {
  test(`${locale}: study information and enquiries are readable by scrolling`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    const studies = page.locator('#home-studies');
    await expect(studies.locator('[data-study]')).toHaveCount(2);
    await expect(studies).toContainText('STAY-STRONG');
    await expect(studies).toContainText('BIRAX');
    await expect(
      studies.locator('[data-study="hybrid-closed-loop"]'),
    ).toHaveCount(0);
    await page.locator('#study-birax').scrollIntoViewIfNeeded();
    await expect(
      page.locator('#study-birax [data-study-details]'),
    ).toBeVisible();
    await page.locator('#taking-part').scrollIntoViewIfNeeded();
    await expect(page.locator('#taking-part')).toBeVisible();
    const language = page.getByRole('link', {
      name: locale === 'en' ? 'עברית' : 'English',
      exact: true,
    });
    await expect(language).toHaveAttribute(
      'href',
      `/${locale === 'en' ? 'he' : 'en'}/#taking-part`,
    );
    await language.click();
    await expect(page).toHaveURL(
      `/${locale === 'en' ? 'he' : 'en'}/#taking-part`,
    );
  });

  test(`${locale}: collaborators can read current publications with evidence types and direct sources`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/publications/`);
    const outputs = page.locator('[data-publication]');
    await expect(outputs).toHaveCount(6);
    const recent = page.locator('[data-publication="sarcopenia"]');
    await expect(recent).toContainText('2026');
    await expect(recent).toContainText(
      locale === 'en' ? 'Clinical proposal' : 'הצעה קלינית',
    );
    const conference = page.locator('[data-publication="grace-780g"]');
    await expect(conference).toContainText(
      locale === 'en' ? 'Conference abstract' : 'תקציר בכנס',
    );
    await expect(
      conference.locator(`a[href="/${locale}/studies/hybrid-closed-loop/"]`),
    ).toHaveCount(1);
    const sarcopenia = page.locator('[data-publication="sarcopenia"]');
    await expect(
      sarcopenia.locator(
        'a[href="https://doi.org/10.1016/j.diabres.2026.113326"]',
      ),
    ).toHaveCount(1);
    if (locale === 'he') {
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
      await expect(recent.locator('[data-citation]')).toHaveAttribute(
        'dir',
        'ltr',
      );
    }
  });

  test(`${locale}: completed GRACE-780G connects to results without an enrollment journey`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/studies/hybrid-closed-loop/`);
    await expect(page.locator('#outputs')).toContainText(
      locale === 'en' ? 'Conference abstract' : 'תקציר בכנס',
    );
    await expect(
      page.locator('#outputs a[href*="easddistribute.m-anage.com"]'),
    ).toHaveCount(1);
    await expect(page.locator('#taking-part')).toHaveCount(0);
    await expect(
      page.locator('.next-steps, form, [data-live-enquiry]'),
    ).toHaveCount(0);
    if (locale === 'he') {
      const glucoseRange = page
        .locator('[aria-labelledby="involves-heading"] bdi')
        .filter({ hasText: /^70–180$/ });
      await expect(glucoseRange).toHaveAttribute('dir', 'ltr');
      await expect(glucoseRange).toHaveCSS('unicode-bidi', 'isolate');
    }
  });

  test(`${locale}: research findings and publications retain their evidence`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    await expect(page.locator('#study-hybrid-closed-loop')).toContainText(
      'GRACE-780G',
    );
    await expect(page.locator('#study-hybrid-closed-loop')).toContainText(
      '2026',
    );
    await expect(
      page.locator('#home-publications [data-publication]'),
    ).toHaveCount(6);
    await expect(
      page.locator('#home-publications a[href="#study-hybrid-closed-loop"]'),
    ).toHaveCount(1);
    await expect(page.locator('#home-updates')).toHaveCount(0);
  });
}
