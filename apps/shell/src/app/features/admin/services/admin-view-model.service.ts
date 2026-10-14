import { Injectable, computed, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { selectTasksVm } from '../../../store/tasks/tasks.selectors';

/** Component-scoped: provide it in the owning component's `providers`. */
@Injectable()
export class AdminViewModelService {
  readonly #store = inject(Store);
  readonly #tasks = this.#store.selectSignal(selectTasksVm);

  readonly vm = computed(() => {
    const { tasks, loading, errorMessage, isEmpty } = this.#tasks();
    return { tasks, loading, errorMessage, isEmpty, total: tasks.length };
  });

  load(): void {
    this.#store.dispatch(tasksActions.loadRequested());
  }
}
