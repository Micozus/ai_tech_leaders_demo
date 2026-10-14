import { expect, test } from '@playwright/test';

test('renders tasks from the database and adds a new one', async ({ page }) => {
  await page.goto('/');

  const items = page.getByTestId('tasks-list').getByRole('listitem');
  await expect(items.first()).toBeVisible();
  const before = await items.count();

  const title = `Ship it ${Date.now()}`;
  await page.getByTestId('field-title').fill(title);
  await page.getByTestId('form-submit').click();

  await expect(items).toHaveCount(before + 1);
  await expect(page.getByTestId('tasks-list')).toContainText(title);
});
