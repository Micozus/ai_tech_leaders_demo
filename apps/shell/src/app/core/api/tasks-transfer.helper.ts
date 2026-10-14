import { makeStateKey, StateKey } from '@angular/core';
import { Task } from './tasks.model';

export function tasksTransferKey(name: string): StateKey<Task[] | null> {
  return makeStateKey<Task[] | null>(name);
}
