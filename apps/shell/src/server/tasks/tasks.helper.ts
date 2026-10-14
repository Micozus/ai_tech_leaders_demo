import { MAX_TASK_TITLE_LENGTH } from '../../app/core/api/tasks.model';

/** Returns the trimmed title, or `null` when the body is not a valid task. */
export function parseCreateTaskBody(body: unknown): string | null {
  if (typeof body !== 'object' || body === null || !('title' in body)) {
    return null;
  }
  if (typeof body.title !== 'string') return null;
  const title = body.title.trim();
  if (!title || title.length > MAX_TASK_TITLE_LENGTH) return null;
  return title;
}
