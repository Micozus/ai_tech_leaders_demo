import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { AGENT_BROWSER_BIN } from './integration.model';

const run = promisify(execFile);
const COMMAND_TIMEOUT_MS = 30_000;

/** Thin wrapper over the agent-browser CLI; one named session per instance keeps suites isolated. */
export class AgentBrowser {
  readonly #session: string;

  constructor(session: string) {
    this.#session = session;
  }

  async open(url: string): Promise<void> {
    await this.exec('open', url);
  }

  async waitForText(text: string): Promise<void> {
    await this.exec('wait', '--text', text);
  }

  async waitForSelector(selector: string): Promise<void> {
    await this.exec('wait', selector);
  }

  async getText(selector: string): Promise<string> {
    return this.exec('get', 'text', selector);
  }

  async fill(selector: string, value: string): Promise<void> {
    await this.exec('fill', selector, value);
  }

  async click(selector: string): Promise<void> {
    await this.exec('click', selector);
  }

  async close(): Promise<void> {
    await this.exec('close');
  }

  private async exec(...args: string[]): Promise<string> {
    const { stdout } = await run(
      AGENT_BROWSER_BIN,
      ['--session', this.#session, ...args],
      {
        timeout: COMMAND_TIMEOUT_MS,
        env: {
          ...process.env,
          // CI containers and Ubuntu 24.04 runners restrict the Chrome sandbox.
          AGENT_BROWSER_ARGS:
            process.env['AGENT_BROWSER_ARGS'] ?? '--no-sandbox',
        },
      },
    );
    return stdout.trim();
  }
}

export function testId(id: string): string {
  return `[data-testid="${id}"]`;
}
