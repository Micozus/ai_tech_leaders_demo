import { inject } from 'vitest';
import { AgentBrowser, testId } from './support/agent-browser';

/** Black-box expectation: what a fresh database is seeded with. */
const SEED_TASK_TITLES = ['Read AGENTS.md', 'Add your first feature'];

describe('home page', () => {
  const baseUrl = inject('baseUrl');
  const browser = new AgentBrowser('integration-home');

  afterAll(async () => {
    await browser.close().catch(() => undefined);
  });

  it('is server-rendered with the tasks stored in PostgreSQL', async () => {
    const html = await (await fetch(baseUrl)).text();

    expect(html).toContain('Angular Nx Monorepo');
    for (const title of SEED_TASK_TITLES) expect(html).toContain(title);
  });

  it('shows the seeded tasks in the browser', async () => {
    await browser.open(baseUrl);
    await browser.waitForSelector(testId('tasks-list'));

    const list = await browser.getText(testId('tasks-list'));
    for (const title of SEED_TASK_TITLES) expect(list).toContain(title);
  });

  it('adds a task that survives a reload', async () => {
    const title = `Integration task ${Date.now()}`;
    await browser.open(baseUrl);
    await browser.waitForSelector(testId('field-title'));

    await browser.fill(testId('field-title'), title);
    await browser.click(testId('form-submit'));
    await browser.waitForText(title);

    await browser.open(baseUrl);
    await browser.waitForText(title);
    expect(await browser.getText(testId('tasks-list'))).toContain(title);
  });
});
