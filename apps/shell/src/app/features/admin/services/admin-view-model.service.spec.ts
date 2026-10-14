import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { tasksActions } from '../../../store/tasks/tasks.actions';
import { AdminViewModelService } from './admin-view-model.service';

describe('AdminViewModelService', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideMockStore({
          initialState: {
            tasks: {
              tasks: [
                { id: '1', title: 'A' },
                { id: '2', title: 'B' },
              ],
              loading: false,
              error: null,
            },
          },
        }),
        AdminViewModelService,
      ],
    });
    const dispatch = vi.spyOn(TestBed.inject(MockStore), 'dispatch');
    return { service: TestBed.inject(AdminViewModelService), dispatch };
  }

  it('exposes all tasks with their total', () => {
    const { service } = setup();

    expect(service.vm()).toEqual({
      tasks: [
        { id: '1', title: 'A' },
        { id: '2', title: 'B' },
      ],
      loading: false,
      errorMessage: null,
      isEmpty: false,
      total: 2,
    });
  });

  it('requests the tasks', () => {
    const { service, dispatch } = setup();

    service.load();

    expect(dispatch).toHaveBeenCalledWith(tasksActions.loadRequested());
  });
});
