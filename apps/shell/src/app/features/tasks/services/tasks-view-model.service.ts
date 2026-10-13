import { Injectable, inject } from '@angular/core';
import { FormValue } from '@org/form-engine';
import { Store } from '@ngrx/store';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { selectTasksVm } from '../../../store/tasks/tasks.selectors';
import { TASK_TITLE_KEY } from '../models/tasks-form.model';

/** Component-scoped: provide it in the owning component's `providers`. */
@Injectable()
export class TasksViewModelService {
  readonly #store = inject(Store);

  readonly vm = this.#store.selectSignal(selectTasksVm);

  load(): void {
    this.#store.dispatch(tasksActions.loadRequested());
  }

  add(value: FormValue): void {
    const title = value[TASK_TITLE_KEY];
    if (!title) return;
    this.#store.dispatch(tasksActions.createRequested({ title }));
  }
}
