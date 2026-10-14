import { createFeature, createReducer, on } from '@ngrx/store';
import { ApiError } from '../../core/api/api-error.model';
import { Task } from '../../core/api/tasks.model';
import { tasksActions } from './tasks.actions';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: ApiError | null;
}

export const initialTasksState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialTasksState,
    on(tasksActions.loadRequested, (state) => ({
      ...state,
      loading: true,
      error: null,
    })),
    on(tasksActions.loadSucceeded, (state, { tasks }) => ({
      ...state,
      tasks,
      loading: false,
    })),
    on(tasksActions.createRequested, (state) => ({ ...state, error: null })),
    on(tasksActions.createSucceeded, (state, { task }) => ({
      ...state,
      tasks: [...state.tasks, task],
    })),
    on(tasksActions.loadFailed, (state, { error }) => ({
      ...state,
      loading: false,
      error,
    })),
    on(tasksActions.createFailed, (state, { error }) => ({ ...state, error })),
  ),
});
