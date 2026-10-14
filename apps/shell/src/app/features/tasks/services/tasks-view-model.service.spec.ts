import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { TasksViewModelService } from './tasks-view-model.service';

describe('TasksViewModelService', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: {
            tasks: {
              tasks: [{ id: '1', title: 'A' }],
              loading: false,
              error: null,
            },
          },
        }),
        TasksViewModelService,
      ],
    });
    const store = TestBed.inject(MockStore);
    const dispatch = vi.spyOn(store, 'dispatch');
    return { service: TestBed.inject(TasksViewModelService), dispatch };
  }

  it('exposes the view model from the store', () => {
    const { service } = setup();

    expect(service.vm()).toEqual({
      tasks: [{ id: '1', title: 'A' }],
      loading: false,
      errorMessage: null,
      isEmpty: false,
    });
  });

  it('dispatches load and create actions', () => {
    const { service, dispatch } = setup();

    service.load();
    service.add({ title: 'New' });
    service.add({ title: '' });

    expect(dispatch.mock.calls).toEqual([
      [tasksActions.loadRequested()],
      [tasksActions.createRequested({ title: 'New' })],
    ]);
  });
});
