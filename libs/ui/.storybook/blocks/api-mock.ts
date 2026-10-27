/**
 * Documentation helper: simulates the API at the `fetch` boundary so the form pattern can show
 * every response (success, waiting, field error, server error, no network). Install it from a
 * story's `beforeEach`; it returns the cleanup that restores the real `fetch`.
 */
export type ApiScenario =
  | 'success'
  | 'pending'
  | 'field-error'
  | 'wrong-password'
  | 'server-error'
  | 'offline';

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function respond(
  scenario: ApiScenario,
  fieldErrors: Record<string, string>,
): Promise<Response> {
  switch (scenario) {
    case 'success':
      return Promise.resolve(
        new Response('{}', { status: 201, headers: JSON_HEADERS }),
      );
    case 'pending':
      return new Promise<Response>(() => undefined);
    case 'field-error':
      return Promise.resolve(
        new Response(JSON.stringify({ fieldErrors }), {
          status: 422,
          headers: JSON_HEADERS,
        }),
      );
    case 'wrong-password':
      return Promise.resolve(
        new Response(
          JSON.stringify({
            fieldErrors: { form: 'Invalid email or password.' },
          }),
          { status: 401, headers: JSON_HEADERS },
        ),
      );
    case 'server-error':
      return Promise.resolve(
        new Response('{}', { status: 500, headers: JSON_HEADERS }),
      );
    case 'offline':
      return Promise.reject(new TypeError('Failed to fetch'));
  }
}

declare global {
  interface Window {
    /** Number of requests the mock has seen: lets a test prove a second submit was blocked. */
    __apiCalls?: number;
  }
}

export function installApiMock(
  scenario: ApiScenario,
  fieldErrors: Record<string, string> = {},
): () => void {
  const realFetch = window.fetch;
  window.__apiCalls = 0;
  window.fetch = (input, init) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.href
          : input.url;
    if (!url.startsWith('/api/')) return realFetch(input, init);
    window.__apiCalls = (window.__apiCalls ?? 0) + 1;
    return respond(scenario, fieldErrors);
  };
  return () => {
    window.fetch = realFetch;
  };
}
