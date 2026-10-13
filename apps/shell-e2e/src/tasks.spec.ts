import { expect, test } from '@playwright/test';

test('lists seeded tasks and adds a new one', async ({ page }) => {
  await page.goto('/');

  const list = page.getByTestId('tasks-list');
  await expect(list.getByRole('listitem')).toHaveCount(2);

  await page.getByTestId('field-title').fill('Ship it');
  await page.getByTestId('form-submit').click();

  await expect(list.getByRole('listitem')).toHaveCount(3);
  await expect(list).toContainText('Ship it');
});
