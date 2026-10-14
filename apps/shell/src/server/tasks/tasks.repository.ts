import type { EntityManager } from '@mikro-orm/postgresql';
import type { Task, TasksDataSource } from '../../app/core/api/tasks.model';
import { TaskEntity } from './task.entity';
import type { TaskRecord } from './task.model';

function toTask(record: TaskRecord): Task {
  return { id: String(record.id), title: record.title };
}

export class TasksRepository implements TasksDataSource {
  readonly #em: Pick<EntityManager, 'fork'>;

  constructor(em: Pick<EntityManager, 'fork'>) {
    this.#em = em;
  }

  async list(): Promise<Task[]> {
    const records = await this.#em
      .fork()
      .find(TaskEntity, {}, { orderBy: { id: 'asc' } });
    return records.map(toTask);
  }

  async create(title: string): Promise<Task> {
    const em = this.#em.fork();
    const record = em.create(TaskEntity, { title });
    await em.flush();
    return toTask(record);
  }
}
