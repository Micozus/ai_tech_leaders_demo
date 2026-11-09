import { outcomeFromResponse, postJson } from './submit-outcome.helper';

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status });
}

describe('outcomeFromResponse', () => {
  it('is ok for a successful response', async () => {
    expect(await outcomeFromResponse(json(201, {}))).toEqual({ kind: 'ok' });
  });

  it('carries the field errors of a rejected submit', async () => {
    const outcome = await outcomeFromResponse(
      json(422, { fieldErrors: { email: 'Enter a valid email.' } }),
    );

    expect(outcome).toEqual({
      kind: 'field-errors',
      errors: { email: 'Enter a valid email.' },
    });
  });

  it('is a server error for a 4xx without field errors, an empty list or an unreadable body', async () => {
    expect(await outcomeFromResponse(json(400, {}))).toEqual({
      kind: 'server-error',
    });
    expect(await outcomeFromResponse(json(422, { fieldErrors: {} }))).toEqual({
      kind: 'server-error',
    });
    expect(
      await outcomeFromResponse(new Response('not json', { status: 422 })),
    ).toEqual({ kind: 'server-error' });
  });

  it('is a server error for a 5xx', async () => {
    expect(await outcomeFromResponse(json(500, {}))).toEqual({
      kind: 'server-error',
    });
  });
});

describe('postJson', () => {
  afterEach(() => vi.restoreAllMocks());

  it('posts the body as JSON with the custom header and returns the outcome', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(json(201, {}));
    const outcome = await postJson('/api/x', { a: 1 });

    expect(outcome).toEqual({ kind: 'ok' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/x');
    expect(init?.body).toBe('{"a":1}');
    expect((init?.headers as Record<string, string>)['X-Requested-With']).toBe(
      'devmentor',
    );
  });

  it('is offline when the network fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new TypeError('Failed to fetch'),
    );

    expect(await postJson('/api/x', {})).toEqual({ kind: 'offline' });
  });
});
