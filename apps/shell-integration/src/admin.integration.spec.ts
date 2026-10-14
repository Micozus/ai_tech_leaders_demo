import { inject } from 'vitest';
import { AgentBrowser, testId } from './support/agent-browser';

/** Black-box expectation: what a fresh database is seeded with. */
const SEED_TASK_TITLES = ['Read AGENTS.md', 'Add your first feature'];

describe('admin panel', () => {
  const baseUrl = inject('baseUrl');
  const adminUrl = `${baseUrl}/admin`;
  const browser = new AgentBrowser('integration-admin');

  afterAll(async () => {
    await browser.close().catch(() => undefined);
  });

  it('is server-rendered with the stored tasks and their total', async () => {
    const html = await (await fetch(adminUrl)).text();

    expect(html).toContain('Admin');
    expect(html).toContain('Total tasks:');
    for (const title of SEED_TASK_TITLES) expect(html).toContain(title);
  });

  it('lists the seeded tasks in the browser', async () => {
    await browser.open(adminUrl);
    await browser.waitForSelector(testId('admin-tasks-list'));

    const list = await browser.getText(testId('admin-tasks-list'));
    for (const title of SEED_TASK_TITLES) expect(list).toContain(title);
    expect(await browser.getText(testId('admin-total'))).toMatch(
      /Total tasks: \d+/,
    );
  });

  it('shows a task created on the home page', async () => {
    const title = `Admin visible ${Date.now()}`;
    await browser.open(baseUrl);
    await browser.waitForSelector(testId('field-title'));
    await browser.fill(testId('field-title'), title);
    await browser.click(testId('form-submit'));
    await browser.waitForText(title);

    await browser.open(adminUrl);
    await browser.waitForText(title);

    expect(await browser.getText(testId('admin-tasks-list'))).toContain(title);
  });
});
