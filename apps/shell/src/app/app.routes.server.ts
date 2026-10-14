import { RenderMode, ServerRoute } from '@angular/ssr';

/** Pages read from the database, so they render per request. */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
