import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { appRoutes } from './app.routes';
import { HttpTasksApi } from './core/api/http-tasks-api.service';
import { TasksApi } from './core/api/tasks-api.service';
import { provideAppPrimeNG } from './integration/primeng.providers';
import * as tasksEffects from './store/tasks/tasks.effects';
import { tasksFeature } from './store/tasks/tasks.reducer';
import {
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    provideStore({ [tasksFeature.name]: tasksFeature.reducer }),
    provideEffects(tasksEffects),
    provideAppPrimeNG(),
    { provide: TasksApi, useClass: HttpTasksApi },
  ],
};
