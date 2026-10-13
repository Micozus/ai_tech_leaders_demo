import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TasksApi } from './tasks-api.service';
import { SEED_TASKS, Task } from './tasks.model';

@Injectable()
export class InMemoryTasksApi extends TasksApi {
  #nextId = 1;

  list(): Observable<Task[]> {
    return of([...SEED_TASKS]);
  }

  create(title: string): Observable<Task> {
    return of({ id: `task-${this.#nextId++}`, title });
  }
}
