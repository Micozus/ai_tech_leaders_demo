import { TasksRepository } from './tasks.repository';

describe('TasksRepository', () => {
  it('maps rows to tasks', async () => {
    const query = vi.fn().mockResolvedValue({
      rows: [{ id: '1', title: 'A', extra: 'ignored' }],
    });
    const repository = new TasksRepository({ query } as never);

    expect(await repository.list()).toEqual([{ id: '1', title: 'A' }]);
  });

  it('inserts with a parameterized query and returns the created task', async () => {
    const query = vi
      .fn()
      .mockResolvedValue({ rows: [{ id: '7', title: 'B' }] });
    const repository = new TasksRepository({ query } as never);

    expect(await repository.create('B')).toEqual({ id: '7', title: 'B' });
    expect(query).toHaveBeenCalledWith(expect.stringContaining('$1'), ['B']);
  });
});
