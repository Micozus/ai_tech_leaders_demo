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
});
