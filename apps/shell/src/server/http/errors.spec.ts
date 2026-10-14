import {
  AppError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from './errors';

describe('AppError hierarchy', () => {
  it('carries status, code and message', () => {
    const error = new AppError(418, 'teapot', 'Short and stout');

    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(418);
    expect(error.code).toBe('teapot');
    expect(error.message).toBe('Short and stout');
  });

  it.each([
    [ValidationError, 400, 'validation_error', 'Invalid request'],
    [UnauthorizedError, 401, 'unauthorized', 'Authentication required'],
    [ForbiddenError, 403, 'forbidden', 'Access denied'],
    [NotFoundError, 404, 'not_found', 'Not found'],
    [ConflictError, 409, 'conflict', 'Conflict'],
  ])(
    '%o maps to %i with default message',
    (ErrorClass, status, code, message) => {
      const error = new ErrorClass();

      expect(error).toBeInstanceOf(AppError);
      expect(error.name).toBe(ErrorClass.name);
      expect(error.status).toBe(status);
      expect(error.code).toBe(code);
      expect(error.message).toBe(message);
    },
  );

  it.each([
    ValidationError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
  ])('%o accepts a custom message', (ErrorClass) => {
    expect(new ErrorClass('Custom').message).toBe('Custom');
  });
});
