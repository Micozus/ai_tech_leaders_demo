import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ApiError } from '../../core/api/api-error.model';
import { Task } from '../../core/api/tasks.model';

export const tasksActions = createActionGroup({
  source: 'Tasks',
  events: {
    'Load Requested': emptyProps(),
    'Load Succeeded': props<{ tasks: Task[] }>(),
    'Load Failed': props<{ error: ApiError }>(),
    'Create Requested': props<{ title: string }>(),
    'Create Succeeded': props<{ task: Task }>(),
    'Create Failed': props<{ error: ApiError }>(),
  },
});
