import { expect, test } from '@playwright/test';

test('admin lists every task, including one created on the home page', async ({
  page,
}) => {
  const title = `Admin e2e ${Date.now()}`;
  await page.goto('/');
  await page.getByTestId('field-title').fill(title);
  await page.getByTestId('form-submit').click();
  await expect(page.getByTestId('tasks-list')).toContainText(title);

  await page.goto('/admin');

  await expect(page.getByRole('heading', { name: 'Admin' })).toBeVisible();
  await expect(page.getByTestId('admin-total')).toContainText('Total tasks:');
  await expect(page.getByTestId('admin-tasks-list')).toContainText(title);
});
