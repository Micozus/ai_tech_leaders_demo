import { HttpErrorResponse } from '@angular/common/http';
import { ApiError, UNKNOWN_API_ERROR } from './api-error.model';

function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'code' in value &&
    'message' in value &&
    typeof value.code === 'string' &&
    typeof value.message === 'string'
  );
}

/** Turns any thrown value into an `ApiError` without leaking transport details. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse && isApiError(error.error)) {
    return { code: error.error.code, message: error.error.message };
  }
  return UNKNOWN_API_ERROR;
}
