import { Pool } from 'pg';
import {
  DEFAULT_DATABASE_URL,
  SCHEMA_SQL,
  SEED_TASK_TITLES,
} from './database.model';

export function createPool(): Pool {
  return new Pool({
    connectionString: process.env['DATABASE_URL'] ?? DEFAULT_DATABASE_URL,
  });
}

/** Idempotent bootstrap; replace with a migration tool when the schema grows. */
export async function ensureSchema(pool: Pool): Promise<void> {
  await pool.query(SCHEMA_SQL);
  const { rows } = await pool.query<{ count: string }>(
    'SELECT count(*) FROM tasks',
  );
  if (rows[0]?.count !== '0') return;
  for (const title of SEED_TASK_TITLES) {
    await pool.query('INSERT INTO tasks (title) VALUES ($1)', [title]);
  }
}
