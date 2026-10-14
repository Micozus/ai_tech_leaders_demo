import {
  REQUEST_CONTEXT,
  TransferState,
  provideZonelessChangeDetection,
} from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ServerTasksApi } from './server-tasks-api.service';
import { tasksTransferKey } from './tasks-transfer.helper';
import {
  ServerRequestContext,
  TASKS_TRANSFER_KEY,
  TasksDataSource,
} from './tasks.model';

describe('ServerTasksApi', () => {
  const task = { id: '1', title: 'A' };

  function setup(dataSource: Partial<TasksDataSource>) {
    const context: ServerRequestContext = {
      tasksDataSource: dataSource as TasksDataSource,
    };
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: REQUEST_CONTEXT, useValue: context },
        ServerTasksApi,
      ],
    });
    return {
      api: TestBed.inject(ServerTasksApi),
      transferState: TestBed.inject(TransferState),
    };
  }

  it('lists from the data source and hands the result to the browser', async () => {
    const list = vi.fn().mockResolvedValue([task]);
    const { api, transferState } = setup({ list });

    expect(await firstValueFrom(api.list())).toEqual([task]);
    expect(
      transferState.get(tasksTransferKey(TASKS_TRANSFER_KEY), null),
    ).toEqual([task]);
  });

  it('creates through the data source', async () => {
    const create = vi.fn().mockResolvedValue(task);
    const { api } = setup({ create });

    expect(await firstValueFrom(api.create('A'))).toEqual(task);
    expect(create).toHaveBeenCalledWith('A');
  });

  it('propagates data source failures', async () => {
    const { api } = setup({
      list: vi.fn().mockRejectedValue(new Error('db down')),
    });

    await expect(firstValueFrom(api.list())).rejects.toThrow('db down');
  });
});
