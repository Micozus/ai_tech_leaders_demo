import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { TasksPageComponent } from './tasks-page.component';

describe('TasksPageComponent', () => {
  async function setup(
    tasks: { id: string; title: string }[],
    error: { code: string; message: string } | null = null,
  ) {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: { tasks: { tasks, loading: false, error } },
        }),
      ],
    });
    const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
    const fixture = TestBed.createComponent(TasksPageComponent);
    await fixture.whenStable();
    return { dispatch, element: fixture.nativeElement as HTMLElement };
  }

  it('requests tasks and renders them', async () => {
    const { dispatch, element } = await setup([
      { id: '1', title: 'Write tests' },
    ]);

    expect(dispatch).toHaveBeenCalledWith(tasksActions.loadRequested());
    expect(element.querySelector('.tasks-page__item')?.textContent).toBe(
      'Write tests',
    );
  });

  it('shows the empty state', async () => {
    const { element } = await setup([]);

    expect(element.querySelector('[data-testid="tasks-empty"]')).not.toBeNull();
  });

  it('shows an error message instead of the empty state when loading failed', async () => {
    const { element } = await setup([], {
      code: 'unknown_error',
      message: 'Something went wrong.',
    });

    expect(
      element.querySelector('[data-testid="tasks-error"]')?.textContent,
    ).toContain('Something went wrong.');
    expect(element.querySelector('[data-testid="tasks-empty"]')).toBeNull();
  });
});
