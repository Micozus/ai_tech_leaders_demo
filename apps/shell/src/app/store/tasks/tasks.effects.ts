import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs';
import { TasksApi } from '../../core/api/tasks-api.service';
import { tasksActions } from './tasks.actions';

export const loadTasks = createEffect(
  (actions$ = inject(Actions), api = inject(TasksApi)) =>
    actions$.pipe(
      ofType(tasksActions.loadRequested),
      switchMap(() => api.list()),
      map((tasks) => tasksActions.loadSucceeded({ tasks })),
    ),
  { functional: true },
);

export const createTask = createEffect(
  (actions$ = inject(Actions), api = inject(TasksApi)) =>
    actions$.pipe(
      ofType(tasksActions.createRequested),
      switchMap(({ title }) => api.create(title)),
      map((task) => tasksActions.createSucceeded({ task })),
    ),
  { functional: true },
);
