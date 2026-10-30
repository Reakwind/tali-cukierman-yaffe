import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('the draft identifies the group and stays out of search results', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Cukierman-Yaffe',
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    /noindex/,
  );
  await expect(page.locator('form')).toHaveCount(0);
});

test('the foundation has no automatically detectable accessibility violations', async ({
  page,
}) => {
  await page.goto('/');
  const result = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(result.violations).toEqual([]);
});
