import { AdminPageComponent } from './features/admin/components/admin-page.component';
import { appRoutes } from './app.routes';
import { TasksPageComponent } from './features/tasks/components/tasks-page.component';

describe('appRoutes', () => {
  it('lazy-loads the tasks page on the empty path', async () => {
    const [home] = appRoutes;

    expect(home.path).toBe('');
    expect(await (home.loadComponent as () => Promise<unknown>)()).toBe(
      TasksPageComponent,
    );
  });

  it('lazy-loads the admin page on /admin', async () => {
    const admin = appRoutes.find((route) => route.path === 'admin');

    expect(await (admin?.loadComponent as () => Promise<unknown>)()).toBe(
      AdminPageComponent,
    );
  });

  it('redirects unknown paths home', () => {
    expect(appRoutes.at(-1)).toEqual({ path: '**', redirectTo: '' });
  });
});
