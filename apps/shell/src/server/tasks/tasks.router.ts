import express, { Router } from 'express';
import type { TasksDataSource } from '../../app/core/api/tasks.model';
import { parseCreateTaskBody } from './tasks.helper';

export function createTasksRouter(dataSource: TasksDataSource): Router {
  const router = Router();
  router.use(express.json());

  router.get('/', async (_req, res, next) => {
    try {
      res.json(await dataSource.list());
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    const title = parseCreateTaskBody(req.body);
    if (!title) {
      res.status(400).json({ message: 'Invalid task title' });
      return;
    }
    try {
      res.status(201).json(await dataSource.create(title));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
