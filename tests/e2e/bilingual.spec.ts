import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('English and Hebrew homepages have real localized document semantics', async ({
  page,
}) => {
  for (const [locale, direction] of [
    ['en', 'ltr'],
    ['he', 'rtl'],
  ]) {
    const response = await page.goto(`/${locale}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', locale!);
    await expect(page.locator('html')).toHaveAttribute('dir', direction!);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      /noindex/,
    );
    await expect(page.locator('[data-draft-notice]')).toHaveCount(0);
  }
});

test('language switching preserves the current research page', async ({
  page,
}) => {
  await page.goto('/en/research/');
  await page.getByRole('link', { name: 'עברית', exact: true }).click();
  await expect(page).toHaveURL(/\/he\/research\/$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/research\/$/);
});

test('mobile navigation works with native keyboard controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/');
  const menu = page.locator('summary');
  await expect(menu).toContainText('Menu');
  await menu.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('details[open]')).toBeVisible();
  await page
    .locator('details')
    .getByRole('link', { name: 'Research', exact: true })
    .click();
  await expect(page).toHaveURL(/\/en\/#home-research$/);
});

for (const [locale, name] of [
  ['en', 'Skip to main content'],
  ['he', 'דילוג לתוכן הראשי'],
] as const) {
  test(`${locale}: the focused skip link is visible above the header and reaches main content`, async ({
    page,
    browserName,
  }) => {
    await page.goto(`/${locale}/`);
    // Safari uses Option-Tab for links when full keyboard access is not enabled.
    await page.keyboard.press(browserName === 'webkit' ? 'Alt+Tab' : 'Tab');
    const skip = page.getByRole('link', { name });
    await expect(skip).toBeFocused();
    // WCAG 2.4.11: focus must not be hidden behind the sticky header.
    expect(
      await skip.evaluate((link) => {
        const box = link.getBoundingClientRect();
        const top = document.elementFromPoint(
          box.x + box.width / 2,
          box.y + box.height / 2,
        );
        return top === link || link.contains(top);
      }),
    ).toBe(true);
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });
}

test('Hebrew navigation and language switching work without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/he/');
  await page.locator('summary').click();
  await page
    .locator('details')
    .getByRole('link', { name: 'מחקר', exact: true })
    .click();
  await expect(page).toHaveURL(/\/he\/#home-research$/);
  await page.locator('.mobile-menu summary').click();
  await page.getByRole('link', { name: 'English', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await context.close();
});

test('research-theme links reach a real section, not an altered fragment', async ({
  page,
}) => {
  await page.goto('/en/');
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page
    .locator('.desktop-nav')
    .getByRole('link', { name: 'Research', exact: true })
    .click();
  await expect(page.locator(':target')).toHaveAttribute('id', 'home-research');
});

for (const locale of ['en', 'he']) {
  test(`${locale} home is readable without horizontal overflow and passes automated a11y checks`, async ({
    page,
  }) => {
    await page.goto(`/${locale}/`);
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth,
      );
      expect(overflows, `Horizontal overflow at ${width}px`).toBe(false);
    }
    const result = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(result.violations).toEqual([]);
  });
}
