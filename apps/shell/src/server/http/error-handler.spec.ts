import type { NextFunction, Request, Response } from 'express';
import { apiErrorHandler } from './error-handler';
import { NotFoundError, ValidationError } from './errors';

function createResponse(headersSent = false) {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return {
    res: { status, json, headersSent } as unknown as Response,
    status,
    json,
  };
}

describe('apiErrorHandler', () => {
  const req = {} as Request;
  const next = vi.fn() as NextFunction;

  it('maps AppError subclasses to their status and code', () => {
    const { res, status, json } = createResponse();

    apiErrorHandler(new NotFoundError('Task missing'), req, res, next);

    expect(status).toHaveBeenCalledWith(404);
    expect(json).toHaveBeenCalledWith({
      code: 'not_found',
      message: 'Task missing',
    });
  });

  it('uses 400 for validation errors', () => {
    const { res, status } = createResponse();

    apiErrorHandler(new ValidationError(), req, res, next);

    expect(status).toHaveBeenCalledWith(400);
  });

  it('treats malformed JSON bodies as a 400, not a server error', () => {
    const { res, status, json } = createResponse();
    const parseError = Object.assign(new SyntaxError('Unexpected token'), {
      type: 'entity.parse.failed',
    });

    apiErrorHandler(parseError, req, res, next);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      code: 'validation_error',
      message: 'Malformed request body',
    });
  });

  it('hides unexpected error details behind a generic 500', () => {
    const { res, status, json } = createResponse();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    apiErrorHandler(new Error('db password leaked: hunter2'), req, res, next);

    expect(status).toHaveBeenCalledWith(500);
    expect(JSON.stringify(json.mock.calls)).not.toContain('hunter2');
  });

  it('delegates when the response was already started', () => {
    const { res, status } = createResponse(true);
    const error = new Error('late');

    apiErrorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(status).not.toHaveBeenCalled();
  });
});
