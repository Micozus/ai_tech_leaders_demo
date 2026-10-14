/** Normalized failure shape shared by every API implementation and the store. */
export interface ApiError {
  code: string;
  message: string;
}

export const UNKNOWN_API_ERROR: ApiError = {
  code: 'unknown_error',
  message: 'Something went wrong. Please try again.',
};
