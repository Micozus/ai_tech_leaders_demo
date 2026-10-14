import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DATABASE_URL_ENV, POSTGRES_IMAGE } from './integration.model';

export interface TestDatabase {
  url: string;
  stop(): Promise<void>;
}

/** A throwaway PostgreSQL container, unless a disposable instance is supplied through the environment. */
export async function startDatabase(): Promise<TestDatabase> {
  const existingUrl = process.env[DATABASE_URL_ENV];
  if (existingUrl) {
    return { url: existingUrl, stop: () => Promise.resolve() };
  }
  const container = await new PostgreSqlContainer(POSTGRES_IMAGE).start();
  return {
    url: container.getConnectionUri(),
    stop: async () => {
      await container.stop();
    },
  };
}
