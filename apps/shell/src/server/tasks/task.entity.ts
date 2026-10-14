import { EntitySchema } from '@mikro-orm/core';
import { MAX_TASK_TITLE_LENGTH } from '../../app/core/api/tasks.model';
import type { TaskRecord } from './task.model';

/** Schema-based mapping: the Angular esbuild toolchain has no decorator metadata. */
export const TaskEntity = new EntitySchema<TaskRecord>({
  name: 'Task',
  tableName: 'tasks',
  properties: {
    id: { type: 'bigint', primary: true, autoincrement: true },
    title: { type: 'string', length: MAX_TASK_TITLE_LENGTH },
    createdAt: {
      type: 'Date',
      columnType: 'timestamptz',
      fieldName: 'created_at',
      onCreate: () => new Date(),
    },
  },
});
