import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Task } from '../../core/api/tasks.model';

export const tasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Requested': emptyProps(),
    'Load Succeeded': props<{ tasks: Task[] }>(),
    'Create Requested': props<{ title: string }>(),
    'Create Succeeded': props<{ task: Task }>(),
  },
});
