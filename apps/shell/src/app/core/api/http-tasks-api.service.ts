import { HttpClient } from '@angular/common/http';
import { Injectable, TransferState, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TasksApi } from './tasks-api.service';
import { TASKS_API_URL, TASKS_TRANSFER_KEY, Task } from './tasks.model';
import { tasksTransferKey } from './tasks-transfer.helper';

/** Browser implementation. Reuses data rendered by the server on first load. */
@Injectable()
export class HttpTasksApi extends TasksApi {
  readonly #http = inject(HttpClient);
  readonly #transferState = inject(TransferState);

  list(): Observable<Task[]> {
    const key = tasksTransferKey(TASKS_TRANSFER_KEY);
    const transferred = this.#transferState.get(key, null);
    if (transferred) {
      this.#transferState.remove(key);
      return of(transferred);
    }
    return this.#http.get<Task[]>(TASKS_API_URL);
  }

  create(title: string): Observable<Task> {
    return this.#http.post<Task>(TASKS_API_URL, { title });
  }
}
