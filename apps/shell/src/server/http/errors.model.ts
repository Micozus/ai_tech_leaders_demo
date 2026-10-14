export interface ErrorResponseBody {
  code: string;
  message: string;
}

export const INTERNAL_ERROR_BODY: ErrorResponseBody = {
  code: 'internal_error',
  message: 'Internal server error',
};
