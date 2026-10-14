import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { firstValueFrom, of, throwError, Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { UNKNOWN_API_ERROR } from '../../core/api/api-error.model';
import { TasksApi } from '../../core/api/tasks-api.service';
import { tasksActions } from './tasks.actions';
import * as effects from './tasks.effects';

describe('tasks effects', () => {
  const task = { id: '1', title: 'A' };
  const api = { list: () => of([task]), create: () => of(task) };

  function setup(action: Action, tasksApi: Partial<TasksApi> = api) {
    const actions$: Observable<Action> = of(action);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockActions(() => actions$),
        { provide: TasksApi, useValue: tasksApi },
      ],
    });
  }

  it('loads tasks from the API', async () => {
    setup(tasksActions.loadRequested());
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(effects.loadTasks()),
    );

    expect(result).toEqual(tasksActions.loadSucceeded({ tasks: [task] }));
  });

  it('creates a task through the API', async () => {
    setup(tasksActions.createRequested({ title: 'A' }));
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(effects.createTask()),
    );

    expect(result).toEqual(tasksActions.createSucceeded({ task }));
  });

  it('maps a failed load to a failure action instead of killing the effect', async () => {
    setup(tasksActions.loadRequested(), {
      list: () => throwError(() => new Error('boom')),
    });
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(effects.loadTasks()),
    );

    expect(result).toEqual(
      tasksActions.loadFailed({ error: UNKNOWN_API_ERROR }),
    );
  });

  it('maps a failed create to a failure action', async () => {
    setup(tasksActions.createRequested({ title: 'A' }), {
      create: () => throwError(() => new Error('boom')),
    });
    const result = await TestBed.runInInjectionContext(() =>
      firstValueFrom(effects.createTask()),
    );

    expect(result).toEqual(
      tasksActions.createFailed({ error: UNKNOWN_API_ERROR }),
    );
  });
});
