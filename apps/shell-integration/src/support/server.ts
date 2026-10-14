import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { setTimeout as delay } from 'node:timers/promises';
import {
  ALLOWED_HOSTS,
  SERVER_ENTRY,
  SERVER_HOST,
  SERVER_POLL_INTERVAL_MS,
  SERVER_READY_PATH,
  SERVER_START_TIMEOUT_MS,
  WORKSPACE_ROOT,
} from './integration.model';

export interface TestServer {
  baseUrl: string;
  stop(): Promise<void>;
}

function findFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = createServer();
    probe.once('error', reject);
    probe.listen(0, SERVER_HOST, () => {
      const address = probe.address();
      const port = typeof address === 'object' && address ? address.port : 0;
      probe.close(() => resolve(port));
    });
  });
}

async function isReady(url: string): Promise<boolean> {
  try {
    return (await fetch(url)).ok;
  } catch {
    return false;
  }
}

/** Starts the production SSR bundle (`nx build shell`) against the given database. */
export async function startServer(databaseUrl: string): Promise<TestServer> {
  const port = await findFreePort();
  const baseUrl = `http://${SERVER_HOST}:${port}`;
  const output: string[] = [];
  const child = spawn(process.execPath, [SERVER_ENTRY], {
    cwd: WORKSPACE_ROOT,
    env: {
      ...process.env,
      PORT: String(port),
      DATABASE_URL: databaseUrl,
      NG_ALLOWED_HOSTS: ALLOWED_HOSTS,
    },
  });
  child.stdout.on('data', (chunk: Buffer) => output.push(chunk.toString()));
  child.stderr.on('data', (chunk: Buffer) => output.push(chunk.toString()));

  const stop = (): Promise<void> =>
    new Promise((resolve) => {
      if (child.exitCode !== null) {
        resolve();
        return;
      }
      child.once('exit', () => resolve());
      child.kill('SIGTERM');
    });

  const deadline = Date.now() + SERVER_START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) break;
    if (await isReady(`${baseUrl}${SERVER_READY_PATH}`)) {
      return { baseUrl, stop };
    }
    await delay(SERVER_POLL_INTERVAL_MS);
  }
  await stop();
  throw new Error(`Server did not become ready.\n${output.join('')}`);
}
