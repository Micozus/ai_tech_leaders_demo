import { TaskEntity } from './task.entity';

describe('TaskEntity', () => {
  it('maps to the tasks table with a snake_case created_at column', () => {
    TaskEntity.init();
    const { meta } = TaskEntity;

    expect(meta.tableName).toBe('tasks');
    expect(meta.properties['createdAt'].fieldNames).toEqual(['created_at']);
  });

  it('stamps createdAt with the current time on create', () => {
    const { onCreate } = TaskEntity.meta.properties['createdAt'];
    const before = Date.now();

    const createdAt = onCreate?.({} as never, {} as never) as Date;

    expect(createdAt).toBeInstanceOf(Date);
    expect(createdAt.getTime()).toBeGreaterThanOrEqual(before);
  });
});
