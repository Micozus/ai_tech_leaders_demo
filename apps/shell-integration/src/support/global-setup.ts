import type { TestProject } from 'vitest/node';
import { startDatabase } from './database';
import { startServer } from './server';

/** One database and one server for the whole run; suites reach it through `inject('baseUrl')`. */
export default async function setup(project: TestProject) {
  const database = await startDatabase();
  const server = await startServer(database.url).catch(async (error) => {
    await database.stop();
    throw error;
  });
  project.provide('baseUrl', server.baseUrl);

  return async () => {
    await server.stop();
    await database.stop();
  };
}
