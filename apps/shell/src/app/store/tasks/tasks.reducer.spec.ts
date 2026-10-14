import { tasksActions } from './tasks.actions';
import { initialTasksState, tasksFeature } from './tasks.reducer';

describe('tasks reducer', () => {
  it('stores loaded tasks and clears loading', () => {
    const loading = tasksFeature.reducer(
      initialTasksState,
      tasksActions.loadRequested(),
    );
    const loaded = tasksFeature.reducer(
      loading,
      tasksActions.loadSucceeded({ tasks: [{ id: '1', title: 'A' }] }),
    );

    expect(loading.loading).toBe(true);
    expect(loaded).toEqual({
      loading: false,
      error: null,
      tasks: [{ id: '1', title: 'A' }],
    });
  });

  it('appends a created task', () => {
    const state = tasksFeature.reducer(
      initialTasksState,
      tasksActions.createSucceeded({ task: { id: '2', title: 'B' } }),
    );

    expect(state.tasks).toEqual([{ id: '2', title: 'B' }]);
  });

  it('stores a load failure, stops loading and clears it on retry', () => {
    const error = { code: 'unknown_error', message: 'Nope' };
    const loading = tasksFeature.reducer(
      initialTasksState,
      tasksActions.loadRequested(),
    );
    const failed = tasksFeature.reducer(
      loading,
      tasksActions.loadFailed({ error }),
    );
    const retried = tasksFeature.reducer(failed, tasksActions.loadRequested());

    expect(failed).toEqual({ ...initialTasksState, error });
    expect(retried.error).toBeNull();
  });

  it('keeps existing tasks when creating one fails', () => {
    const error = { code: 'validation_error', message: 'Invalid task title' };
    const state = tasksFeature.reducer(
      { ...initialTasksState, tasks: [{ id: '1', title: 'A' }] },
      tasksActions.createFailed({ error }),
    );

    expect(state.tasks).toEqual([{ id: '1', title: 'A' }]);
    expect(state.error).toEqual(error);
  });

  it('clears a previous error when a create is requested', () => {
    const state = tasksFeature.reducer(
      { ...initialTasksState, error: { code: 'x', message: 'old' } },
      tasksActions.createRequested({ title: 'A' }),
    );

    expect(state.error).toBeNull();
  });
});
