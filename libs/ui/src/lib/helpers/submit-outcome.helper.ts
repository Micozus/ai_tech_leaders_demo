/** What a form submit can come back with. Only `ok` means the server confirmed it. */
export type SubmitOutcome =
  | { readonly kind: 'ok' }
  | {
      readonly kind: 'field-errors';
      readonly errors: Readonly<Record<string, string>>;
    }
  | { readonly kind: 'server-error' }
  | { readonly kind: 'offline' };

export const SERVER_ERROR_MESSAGE =
  'Something went wrong on our side. Your answers are kept. Try again in a moment.';
export const OFFLINE_MESSAGE =
  'You seem to be offline. Your answers are kept. Check your connection and try again.';

interface FieldErrorBody {
  readonly fieldErrors?: Readonly<Record<string, string>>;
}

/** Maps a `fetch` response to an outcome: 2xx ok, 4xx with `fieldErrors` field errors, anything else a server error. */
export async function outcomeFromResponse(
  response: Response,
): Promise<SubmitOutcome> {
  if (response.ok) return { kind: 'ok' };
  if (response.status >= 400 && response.status < 500) {
    const body = (await response.json().catch(() => ({}))) as FieldErrorBody;
    if (body.fieldErrors && Object.keys(body.fieldErrors).length > 0) {
      return { kind: 'field-errors', errors: body.fieldErrors };
    }
  }
  return { kind: 'server-error' };
}

/** POSTs JSON and returns the outcome; a network failure is `offline`, never an exception. */
export async function postJson(
  url: string,
  body: unknown,
): Promise<SubmitOutcome> {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'devmentor',
      },
      body: JSON.stringify(body),
    });
    return await outcomeFromResponse(response);
  } catch {
    return { kind: 'offline' };
  }
}
