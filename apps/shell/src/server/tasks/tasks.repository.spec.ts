import type { EntityManager } from '@mikro-orm/postgresql';
import { TaskEntity } from './task.entity';
import { TasksRepository } from './tasks.repository';

function createEntityManager(overrides: Partial<EntityManager>) {
  const em = { ...overrides, fork: () => em };
  return em as unknown as EntityManager;
}

describe('TasksRepository', () => {
  it('lists tasks ordered by id and maps them to the API shape', async () => {
    const find = vi.fn().mockResolvedValue([
      { id: 1, title: 'A', createdAt: new Date() },
      { id: 2, title: 'B', createdAt: new Date() },
    ]);
    const repository = new TasksRepository(createEntityManager({ find }));

    expect(await repository.list()).toEqual([
      { id: '1', title: 'A' },
      { id: '2', title: 'B' },
    ]);
    expect(find).toHaveBeenCalledWith(
      TaskEntity,
      {},
      { orderBy: { id: 'asc' } },
    );
  });

  it('persists a new task and returns it with the generated id', async () => {
    const record = { id: '7', title: 'B', createdAt: new Date() };
    const create = vi.fn().mockReturnValue(record);
    const flush = vi.fn().mockResolvedValue(undefined);
    const repository = new TasksRepository(
      createEntityManager({ create, flush }),
    );

    expect(await repository.create('B')).toEqual({ id: '7', title: 'B' });
    expect(create).toHaveBeenCalledWith(TaskEntity, { title: 'B' });
    expect(flush).toHaveBeenCalled();
  });
});
