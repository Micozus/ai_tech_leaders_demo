import type { Pool } from 'pg';
import type { Task, TasksDataSource } from '../../app/core/api/tasks.model';

interface TaskRow {
  id: string;
  title: string;
}

function toTask(row: TaskRow): Task {
  return { id: row.id, title: row.title };
}

export class TasksRepository implements TasksDataSource {
  readonly #pool: Pick<Pool, 'query'>;

  constructor(pool: Pick<Pool, 'query'>) {
    this.#pool = pool;
  }

  async list(): Promise<Task[]> {
    const { rows } = await this.#pool.query<TaskRow>(
      'SELECT id::text, title FROM tasks ORDER BY id',
    );
    return rows.map(toTask);
  }

  async create(title: string): Promise<Task> {
    const { rows } = await this.#pool.query<TaskRow>(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING id::text, title',
      [title],
    );
    return toTask(rows[0]);
  }
}
