import { createSelector } from '@ngrx/store';
import { tasksFeature } from './tasks.reducer';

export const selectTasksVm = createSelector(
  tasksFeature.selectTasks,
  tasksFeature.selectLoading,
  (tasks, loading) => ({ tasks, loading, isEmpty: !loading && !tasks.length }),
);
