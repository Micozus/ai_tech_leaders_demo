import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import { toApiError } from '../../core/api/api-error.helper';
import { TasksApi } from '../../core/api/tasks-api.service';
import { tasksActions } from './tasks.actions';

/** `catchError` stays inside `switchMap` so a failed request never kills the effect. */
export const loadTasks = createEffect(
  (actions$ = inject(Actions), api = inject(TasksApi)) =>
    actions$.pipe(
      ofType(tasksActions.loadRequested),
      switchMap(() =>
        api.list().pipe(
          map((tasks) => tasksActions.loadSucceeded({ tasks })),
          catchError((error) =>
            of(tasksActions.loadFailed({ error: toApiError(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
);

export const createTask = createEffect(
  (actions$ = inject(Actions), api = inject(TasksApi)) =>
    actions$.pipe(
      ofType(tasksActions.createRequested),
      switchMap(({ title }) =>
        api.create(title).pipe(
          map((task) => tasksActions.createSucceeded({ task })),
          catchError((error) =>
            of(tasksActions.createFailed({ error: toApiError(error) })),
          ),
        ),
      ),
    ),
  { functional: true },
);
