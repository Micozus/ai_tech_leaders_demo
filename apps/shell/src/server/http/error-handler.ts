import type { ErrorRequestHandler } from 'express';
import { AppError, ValidationError } from './errors';
import { INTERNAL_ERROR_BODY } from './errors.model';

/** body-parser rejects malformed payloads with `type: 'entity.parse.failed'` (and similar). */
function isBodyParseError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'type' in error &&
    typeof error.type === 'string' &&
    error.type.startsWith('entity.')
  );
}

/** Single error path for `/api/*`: maps `AppError` to its status, hides everything else behind a 500. */
export const apiErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }
  if (isBodyParseError(error)) {
    apiErrorHandler(
      new ValidationError('Malformed request body'),
      req,
      res,
      next,
    );
    return;
  }
  if (error instanceof AppError) {
    res.status(error.status).json({ code: error.code, message: error.message });
    return;
  }
  console.error('Unhandled API error', error);
  res.status(500).json(INTERNAL_ERROR_BODY);
};
