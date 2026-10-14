import { HttpErrorResponse } from '@angular/common/http';
import { toApiError } from './api-error.helper';
import { UNKNOWN_API_ERROR } from './api-error.model';

describe('toApiError', () => {
  it('reads the server error body', () => {
    const error = new HttpErrorResponse({
      status: 400,
      error: { code: 'validation_error', message: 'Invalid task title' },
    });

    expect(toApiError(error)).toEqual({
      code: 'validation_error',
      message: 'Invalid task title',
    });
  });

  it('falls back to a generic error for unknown shapes', () => {
    expect(toApiError(new HttpErrorResponse({ status: 500 }))).toEqual(
      UNKNOWN_API_ERROR,
    );
    expect(toApiError(new Error('boom: internal detail'))).toEqual(
      UNKNOWN_API_ERROR,
    );
  });
});
