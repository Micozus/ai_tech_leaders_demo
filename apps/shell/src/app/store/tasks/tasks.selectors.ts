import { createSelector } from '@ngrx/store';
import { tasksFeature } from './tasks.reducer';

export const selectTasksVm = createSelector(
  tasksFeature.selectTasks,
  tasksFeature.selectLoading,
  tasksFeature.selectError,
  (tasks, loading, error) => ({
    tasks,
    loading,
    errorMessage: error?.message ?? null,
    isEmpty: !loading && !error && !tasks.length,
  }),
);
