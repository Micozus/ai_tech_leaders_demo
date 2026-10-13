import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./features/tasks/components/tasks-page.component').then(
        (m) => m.TasksPageComponent,
      ),
  },
  { path: '**', redirectTo: '' },
];
