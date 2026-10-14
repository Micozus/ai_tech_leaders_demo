import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { ServerTasksApi } from './core/api/server-tasks-api.service';
import { TasksApi } from './core/api/tasks-api.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    { provide: TasksApi, useClass: ServerTasksApi },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
