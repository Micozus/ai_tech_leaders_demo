import express, { Router } from 'express';
import type { TasksDataSource } from '../../app/core/api/tasks.model';
import { ValidationError } from '../http/errors';
import { parseCreateTaskBody } from './tasks.helper';

/** Async handlers may reject freely: Express 5 forwards rejections to the error handler. */
export function createTasksRouter(dataSource: TasksDataSource): Router {
  const router = Router();
  router.use(express.json());

  router.get('/', async (_req, res) => {
    res.json(await dataSource.list());
  });

  router.post('/', async (req, res) => {
    const title = parseCreateTaskBody(req.body);
    if (!title) throw new ValidationError('Invalid task title');
    res.status(201).json(await dataSource.create(title));
  });

  return router;
}
