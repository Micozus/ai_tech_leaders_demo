import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
  interface StateOverrides {
    tasks?: { id: string; title: string }[];
    loading?: boolean;
    error?: { code: string; message: string } | null;
  }

  async function setup({
    tasks = [],
    loading = false,
    error = null,
  }: StateOverrides = {}) {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: { tasks: { tasks, loading, error } },
        }),
      ],
    });
    const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
    const fixture = TestBed.createComponent(AdminPageComponent);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const byId = (id: string) => element.querySelector(`[data-testid="${id}"]`);
    return { dispatch, element, byId };
  }

  it('requests tasks and shows the total with every task', async () => {
    const { dispatch, byId } = await setup({
      tasks: [
        { id: '1', title: 'First' },
        { id: '2', title: 'Second' },
      ],
    });

    expect(dispatch).toHaveBeenCalledWith(tasksActions.loadRequested());
    expect(byId('admin-total')?.textContent).toContain('Total tasks: 2');
    const items = byId('admin-tasks-list')?.querySelectorAll('li');
    expect(items?.length).toBe(2);
    expect(items?.[1].textContent).toContain('#2');
    expect(items?.[1].textContent).toContain('Second');
    expect(byId('admin-empty')).toBeNull();
  });

  it('shows the empty state', async () => {
    const { byId } = await setup();

    expect(byId('admin-empty')).not.toBeNull();
    expect(byId('admin-total')?.textContent).toContain('Total tasks: 0');
  });

  it('shows the loading state', async () => {
    const { byId } = await setup({ loading: true });

    expect(byId('admin-loading')).not.toBeNull();
    expect(byId('admin-empty')).toBeNull();
  });

  it('shows an error message instead of the empty state', async () => {
    const { byId } = await setup({
      error: { code: 'unknown_error', message: 'Something went wrong.' },
    });

    expect(byId('admin-error')?.textContent).toContain('Something went wrong.');
    expect(byId('admin-empty')).toBeNull();
  });
});
