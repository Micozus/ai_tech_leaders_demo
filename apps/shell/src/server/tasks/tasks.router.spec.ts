import type { Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import express from 'express';
import type { TasksDataSource } from '../../app/core/api/tasks.model';
import { apiErrorHandler } from '../http/error-handler';
import { createTasksRouter } from './tasks.router';

describe('tasks router', () => {
  const task = { id: '1', title: 'A' };
  let server: Server;
  let baseUrl: string;
  const dataSource: TasksDataSource = {
    list: vi.fn(),
    create: vi.fn(),
  };

  beforeAll(async () => {
    const app = express();
    app.use('/api/tasks', createTasksRouter(dataSource));
    app.use('/api', apiErrorHandler);
    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', resolve);
    });
    baseUrl = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api/tasks`;
  });

  afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

  beforeEach(() => {
    vi.mocked(dataSource.list).mockReset();
    vi.mocked(dataSource.create).mockReset();
  });

  function post(body: string) {
    return fetch(baseUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    });
  }

  it('lists tasks', async () => {
    vi.mocked(dataSource.list).mockResolvedValue([task]);

    const response = await fetch(baseUrl);

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([task]);
  });

  it('creates a task from a trimmed title', async () => {
    vi.mocked(dataSource.create).mockResolvedValue(task);

    const response = await post(JSON.stringify({ title: '  A ' }));

    expect(response.status).toBe(201);
    expect(await response.json()).toEqual(task);
    expect(dataSource.create).toHaveBeenCalledWith('A');
  });

  it('rejects an invalid title with a validation error', async () => {
    const response = await post(JSON.stringify({ title: '   ' }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      code: 'validation_error',
      message: 'Invalid task title',
    });
    expect(dataSource.create).not.toHaveBeenCalled();
  });

  it('rejects malformed JSON with a 400', async () => {
    const response = await post('{bad');

    expect(response.status).toBe(400);
  });

  it('reports data source failures as a generic 500', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    vi.mocked(dataSource.list).mockRejectedValue(new Error('db password'));

    const response = await fetch(baseUrl);

    expect(response.status).toBe(500);
    expect(JSON.stringify(await response.json())).not.toContain('db password');
  });
});
