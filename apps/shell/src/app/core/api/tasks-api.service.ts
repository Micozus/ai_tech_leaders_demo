import { Observable } from 'rxjs';
import { Task } from './tasks.model';

/** API abstraction: swap the provider in app.config to talk to a real backend. */
export abstract class TasksApi {
  abstract list(): Observable<Task[]>;
  abstract create(title: string): Observable<Task>;
}
