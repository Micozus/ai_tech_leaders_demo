import { resolve } from 'node:path';

export const WORKSPACE_ROOT = resolve(import.meta.dirname, '../../../..');
export const SERVER_ENTRY = resolve(
  WORKSPACE_ROOT,
  'dist/apps/shell/server/server.mjs',
);
export const AGENT_BROWSER_BIN = resolve(
  WORKSPACE_ROOT,
  'node_modules/.bin/agent-browser',
);

/** Set to reuse an existing, disposable PostgreSQL instead of starting a container. */
export const DATABASE_URL_ENV = 'INTEGRATION_DATABASE_URL';
export const POSTGRES_IMAGE = 'postgres:17-alpine';

export const SERVER_HOST = '127.0.0.1';
/** Angular SSR rejects unknown Host headers; the suite reaches the server by IP and by name. */
export const ALLOWED_HOSTS = '127.0.0.1,localhost';
export const SERVER_START_TIMEOUT_MS = 60_000;
export const SERVER_POLL_INTERVAL_MS = 250;
export const SERVER_READY_PATH = '/api/tasks';

declare module 'vitest' {
  export interface ProvidedContext {
    baseUrl: string;
  }
}
