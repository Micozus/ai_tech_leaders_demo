export interface Task {
  id: string;
  title: string;
}

export const TASKS_API_URL = '/api/tasks';
export const TASKS_TRANSFER_KEY = 'tasks:list';
export const MAX_TASK_TITLE_LENGTH = 200;

/** Data-source contract shared by the Express server and the SSR facade. */
export interface TasksDataSource {
  list(): Promise<Task[]>;
  create(title: string): Promise<Task>;
}

/** Passed to `AngularNodeAppEngine.handle()` and read via `REQUEST_CONTEXT`. */
export interface ServerRequestContext {
  tasksDataSource: TasksDataSource;
}
