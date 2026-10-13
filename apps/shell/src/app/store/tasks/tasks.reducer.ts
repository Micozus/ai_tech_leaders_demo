import { createFeature, createReducer, on } from '@ngrx/store';
import { Task } from '../../core/api/tasks.model';
import { tasksActions } from './tasks.actions';

export interface TasksState {
  tasks: Task[];
  loading: boolean;
}

export const initialTasksState: TasksState = { tasks: [], loading: false };

export const tasksFeature = createFeature({
  name: 'tasks',
  reducer: createReducer(
    initialTasksState,
    on(tasksActions.loadRequested, (state) => ({ ...state, loading: true })),
    on(tasksActions.loadSucceeded, (state, { tasks }) => ({
      ...state,
      tasks,
      loading: false,
    })),
    on(tasksActions.createSucceeded, (state, { task }) => ({
      ...state,
      tasks: [...state.tasks, task],
    })),
  ),
});
