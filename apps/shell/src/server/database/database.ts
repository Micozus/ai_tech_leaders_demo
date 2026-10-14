import { MikroORM } from '@mikro-orm/postgresql';
import { TaskEntity } from '../tasks/task.entity';
import { DEFAULT_DATABASE_URL, SEED_TASK_TITLES } from './database.model';

export function createOrm(): MikroORM {
  return new MikroORM({
    clientUrl: process.env['DATABASE_URL'] ?? DEFAULT_DATABASE_URL,
    entities: [TaskEntity],
    discovery: { warnWhenNoEntities: false },
  });
}

/** Idempotent bootstrap; switch to MikroORM migrations when the schema needs history. */
export async function ensureSchema(orm: MikroORM): Promise<void> {
  await orm.schema.update();
  const em = orm.em.fork();
  if ((await em.count(TaskEntity)) > 0) return;
  for (const title of SEED_TASK_TITLES) em.create(TaskEntity, { title });
  await em.flush();
}
