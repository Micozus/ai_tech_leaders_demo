export const DEFAULT_DATABASE_URL =
  'postgres://postgres:postgres@127.0.0.1:5432/open-mercato';

export const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS tasks (
    id         BIGSERIAL PRIMARY KEY,
    title      TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 200),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

export const SEED_TASK_TITLES: readonly string[] = [
  'Read AGENTS.md',
  'Add your first feature',
];
