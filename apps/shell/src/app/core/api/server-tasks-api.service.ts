import {
  Injectable,
  PendingTasks,
  REQUEST_CONTEXT,
  TransferState,
  inject,
} from '@angular/core';
import { Observable, defer, from, tap } from 'rxjs';
import { TasksApi } from './tasks-api.service';
import { tasksTransferKey } from './tasks-transfer.helper';
import { ServerRequestContext, TASKS_TRANSFER_KEY, Task } from './tasks.model';

/**
 * SSR facade: reads straight from the server-side data source (no HTTP loopback)
 * and hands the result to the browser through TransferState.
 */
@Injectable()
export class ServerTasksApi extends TasksApi {
  readonly #context = inject<ServerRequestContext>(REQUEST_CONTEXT);
  readonly #pendingTasks = inject(PendingTasks);
  readonly #transferState = inject(TransferState);

  list(): Observable<Task[]> {
    return this.track(() => this.#context.tasksDataSource.list()).pipe(
      tap((tasks) =>
        this.#transferState.set(tasksTransferKey(TASKS_TRANSFER_KEY), tasks),
      ),
    );
  }

  create(title: string): Observable<Task> {
    return this.track(() => this.#context.tasksDataSource.create(title));
  }

  /** Keeps SSR waiting until the promise settles. */
  private track<T>(load: () => Promise<T>): Observable<T> {
    return defer(() => {
      const done = this.#pendingTasks.add();
      return from(load().finally(done));
    });
  }
}
