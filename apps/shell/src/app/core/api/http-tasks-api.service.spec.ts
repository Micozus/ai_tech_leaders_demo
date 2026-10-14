import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TransferState, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { HttpTasksApi } from './http-tasks-api.service';
import { tasksTransferKey } from './tasks-transfer.helper';
import { TASKS_API_URL, TASKS_TRANSFER_KEY } from './tasks.model';

describe('HttpTasksApi', () => {
  const task = { id: '1', title: 'A' };

  function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(),
        provideHttpClientTesting(),
        HttpTasksApi,
      ],
    });
    return {
      api: TestBed.inject(HttpTasksApi),
      http: TestBed.inject(HttpTestingController),
      transferState: TestBed.inject(TransferState),
    };
  }

  it('consumes the server-rendered tasks once, then calls the API', async () => {
    const { api, http, transferState } = setup();
    const key = tasksTransferKey(TASKS_TRANSFER_KEY);
    transferState.set(key, [task]);

    expect(await firstValueFrom(api.list())).toEqual([task]);
    expect(transferState.hasKey(key)).toBe(false);

    const second = firstValueFrom(api.list());
    http.expectOne(TASKS_API_URL).flush([task, { id: '2', title: 'B' }]);
    expect(await second).toHaveLength(2);
    http.verify();
  });

  it('loads tasks over HTTP when nothing was transferred', async () => {
    const { api, http } = setup();

    const result = firstValueFrom(api.list());
    const request = http.expectOne(TASKS_API_URL);
    expect(request.request.method).toBe('GET');
    request.flush([task]);

    expect(await result).toEqual([task]);
  });

  it('posts a new task', async () => {
    const { api, http } = setup();

    const result = firstValueFrom(api.create('A'));
    const request = http.expectOne(TASKS_API_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'A' });
    request.flush(task);

    expect(await result).toEqual(task);
  });
});
