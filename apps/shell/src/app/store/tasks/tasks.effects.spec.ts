import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { firstValueFrom, of, Observable } from 'rxjs';
import { Action } from '@ngrx/store';
import { TasksApi } from '../../core/api/tasks-api.service';
import { tasksActions } from './tasks.actions';
import * as effects from './tasks.effects';

describe('tasks effects', () => {
  const task = { id: '1', title: 'A' };
  const api = { list: () => of([task]), create: () => of(task) };

  function setup(action: Action) {
    const actions$: Observable<Action> = of(action);
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockActions(() => actions$),
        { provide: TasksApi, useValue: api },
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
});
