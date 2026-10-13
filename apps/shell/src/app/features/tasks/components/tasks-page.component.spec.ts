import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { TasksPageComponent } from './tasks-page.component';

describe('TasksPageComponent', () => {
  async function setup(tasks: { id: string; title: string }[]) {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: { tasks: { tasks, loading: false } },
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
});
