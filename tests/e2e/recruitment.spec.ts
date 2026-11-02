import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const policy = (await readFile('public/_headers', 'utf8'))
  .split('\n')
  .find((line) => line.trimStart().startsWith('Content-Security-Policy:'))!
  .trim()
  .slice('Content-Security-Policy: '.length);

for (const locale of ['en', 'he'] as const) {
  const he = locale === 'he';
  test(`${locale}: the homepage has one shared participation form for both studies`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    const main = page.getByRole('main');
    await expect(main.locator('form[data-enquiry-form]')).toHaveCount(1);
    const studies = page.locator('#home-studies');
    await expect(studies.locator('[data-study]')).toHaveCount(2);
    await expect(studies.locator('form, [data-participation-cta]')).toHaveCount(
      0,
    );
    await expect(page.locator('.home-intro .button')).toHaveCount(0);
    await page.locator('#taking-part').scrollIntoViewIfNeeded();
    await expect(page.locator('input[name="study"]')).toHaveValue('general');
    await expect(
      main.getByRole('button', {
        name: he ? 'שלחו את הפרטים שלי' : 'Send my details',
        exact: true,
      }),
    ).toHaveCount(1);
    await expect(
      main.locator('select, textarea, input[type="file"]'),
    ).toHaveCount(0);
  });

  test(`${locale}: recruiting study pages lead with an invitation before technical details`, async ({
    page,
  }) => {
    for (const id of ['birax', 'stay-strong']) {
      await page.goto(`/${locale}/studies/${id}/`);
      await expect(page.locator('.page-heading .status')).toHaveText(
        he ? 'מגייסים משתתפים' : 'Now recruiting',
      );
      const invite = page.locator('#taking-part');
      await expect(invite.getByRole('heading')).toHaveText(
        he ? 'רוצים לשמוע עוד על השתתפות?' : 'Interested in taking part?',
      );
      const beforePopulation = await page.evaluate(() => {
        const invitation = document.querySelector('#taking-part');
        const population = document.querySelector(
          '[aria-labelledby="population-heading"]',
        );
        return Boolean(
          invitation &&
          population &&
          invitation.compareDocumentPosition(population) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        );
      });
      expect(beforePopulation).toBe(true);
      await expect(page.getByRole('main')).not.toContainText(
        he ? 'פרטי ההשתתפות טרם אושרו' : 'Participation details not confirmed',
      );
      await expect(page.locator('textarea, input[type="file"]')).toHaveCount(0);
    }
  });

  test(`${locale}: other research is presented without completion labels or recruitment invitations`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/studies/`);
    const research = page.locator('[data-study="hybrid-closed-loop"]');
    await expect(research).toBeVisible();
    await expect(research.locator('.status, .button')).toHaveCount(0);
    await research
      .getByRole('link', {
        name: he ? 'לפרטי המחקר' : 'Read study',
        exact: true,
      })
      .click();
    await expect(page.getByRole('main')).not.toContainText(
      he
        ? /הסתיים|הושלם|אינו מגייס|אינו פתוח להרשמה/
        : /completed|no longer enrolling|enrollment has ended|not offered for enrollment/i,
    );
    await expect(
      page.locator('#taking-part, [data-participation-cta]'),
    ).toHaveCount(0);
    await expect(page.locator('#outputs')).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: he ? 'לרשומה הרשמית של המחקר' : 'View the official study record',
        exact: true,
      }),
    ).toHaveAttribute('href', 'https://clinicaltrials.gov/study/NCT06236256');
  });

  test(`${locale}: participants can submit only their contact details and see a real result`, async ({
    page,
  }) => {
    let submitted: URLSearchParams | undefined;
    await page.route(`**/${locale}/studies/birax/`, async (route) => {
      const response = await route.fetch();
      await route.fulfill({
        response,
        headers: { ...response.headers(), 'Content-Security-Policy': policy },
      });
    });
    await page.route('**/api/participation', async (route) => {
      submitted = new URLSearchParams(route.request().postData() ?? '');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto(`/${locale}/studies/birax/`);
    const form = page.locator('form[data-enquiry-form]');
    await form
      .getByLabel(he ? 'שם פרטי (לא חובה)' : 'First name (optional)', {
        exact: true,
      })
      .fill('Test');
    await form
      .getByLabel(he ? 'טלפון או אימייל' : 'Phone or email', { exact: true })
      .fill('participant@example.invalid');
    await form
      .getByRole('button', {
        name: he ? 'שלחו את הפרטים שלי' : 'Send my details',
        exact: true,
      })
      .click();
    await expect(page.locator('[data-form-success]')).toBeVisible();
    expect(submitted?.get('study')).toBe('birax');
    expect(submitted?.get('contact')).toBe('participant@example.invalid');
    expect(submitted?.has('recipients')).toBe(false);
    await expect(page.getByRole('main')).not.toContainText(
      he ? /הסכמה מדעת|תנאים משפטיים/ : /informed consent|legal terms/i,
    );
  });

  test(`${locale}: failed email delivery never shows success or clears the contact field`, async ({
    page,
  }) => {
    await page.route('**/api/participation', (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'unavailable' }),
      }),
    );
    await page.goto(`/${locale}/studies/stay-strong/`);
    const contact = page.getByLabel(he ? 'טלפון או אימייל' : 'Phone or email', {
      exact: true,
    });
    await contact.fill('participant@example.invalid');
    await page
      .getByRole('button', {
        name: he ? 'שלחו את הפרטים שלי' : 'Send my details',
        exact: true,
      })
      .click();
    await expect(page.locator('[data-form-status]')).toBeVisible();
    await expect(page.locator('[data-form-success]')).toBeHidden();
    await expect(contact).toHaveValue('participant@example.invalid');
  });

  test(`${locale}: student and collaborator CTAs open a blank email to Tali`, async ({
    page,
  }) => {
    for (const path of ['about', 'research', 'for-clinicians']) {
      await page.goto(`/${locale}/${path}/`);
      await expect(
        page.locator('main a[href="mailto:tcukierm@gmail.com"]'),
      ).toHaveCount(1);
      await expect(
        page.locator('main a[href^="mailto:"][href*="?"]'),
      ).toHaveCount(0);
    }
  });
}
