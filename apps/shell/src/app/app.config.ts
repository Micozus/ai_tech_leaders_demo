import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { InMemoryTasksApi } from './core/api/in-memory-tasks-api.service';
import { TasksApi } from './core/api/tasks-api.service';
import { provideAppPrimeNG } from './integration/primeng.providers';
import * as tasksEffects from './store/tasks/tasks.effects';
import { tasksFeature } from './store/tasks/tasks.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore({ [tasksFeature.name]: tasksFeature.reducer }),
    provideEffects(tasksEffects),
    provideAppPrimeNG(),
    { provide: TasksApi, useClass: InMemoryTasksApi },
  ],
};
