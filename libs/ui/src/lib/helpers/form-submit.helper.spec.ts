import { FormSubmitState, focusFirstInvalid } from './form-submit.helper';
import {
  OFFLINE_MESSAGE,
  SERVER_ERROR_MESSAGE,
  type SubmitOutcome,
} from './submit-outcome.helper';

describe('FormSubmitState', () => {
  it('succeeds only when the server confirms', async () => {
    const state = new FormSubmitState();
    await state.submit(async () => ({ kind: 'ok' }));

    expect(state.status()).toBe('success');
    expect(state.formError()).toBe('');
  });

  it('keeps field errors from the server', async () => {
    const state = new FormSubmitState();
    await state.submit(async () => ({
      kind: 'field-errors',
      errors: { email: 'Taken.' },
    }));

    expect(state.status()).toBe('failed');
    expect(state.fieldErrors()).toEqual({ email: 'Taken.' });
  });

  it('explains a server error and an offline failure', async () => {
    const state = new FormSubmitState();
    await state.submit(async () => ({ kind: 'server-error' }));
    expect(state.formError()).toBe(SERVER_ERROR_MESSAGE);

    await state.submit(async () => ({ kind: 'offline' }));
    expect(state.formError()).toBe(OFFLINE_MESSAGE);
    expect(state.status()).toBe('failed');
  });

  it('treats a thrown error as offline', async () => {
    const state = new FormSubmitState();
    await state.submit(async () => {
      throw new Error('boom');
    });

    expect(state.formError()).toBe(OFFLINE_MESSAGE);
  });

  it('blocks a second submit while one is running', async () => {
    const state = new FormSubmitState();
    let release: (outcome: SubmitOutcome) => void = () => undefined;
    const run = vi.fn(
      () => new Promise<SubmitOutcome>((resolve) => (release = resolve)),
    );
    const first = state.submit(run);
    expect(state.status()).toBe('submitting');
    await state.submit(run);

    expect(run).toHaveBeenCalledTimes(1);
    release({ kind: 'ok' });
    await first;
    expect(state.status()).toBe('success');
  });

  it('clears the previous errors when it submits again', async () => {
    const state = new FormSubmitState();
    await state.submit(async () => ({ kind: 'server-error' }));
    await state.submit(async () => ({ kind: 'ok' }));

    expect(state.formError()).toBe('');
    expect(state.fieldErrors()).toEqual({});
  });
});

describe('focusFirstInvalid', () => {
  it('focuses the first invalid control and says so', () => {
    document.body.innerHTML =
      '<div id="r"><input id="a" /><input id="b" aria-invalid="true" /><input id="c" aria-invalid="true" /></div>';
    const found = focusFirstInvalid(
      document.getElementById('r') as HTMLElement,
    );

    expect(found).toBe(true);
    expect(document.activeElement?.id).toBe('b');
  });

  it('reports when nothing is invalid', () => {
    document.body.innerHTML = '<div id="r"><input /></div>';

    expect(focusFirstInvalid(document.getElementById('r') as HTMLElement)).toBe(
      false,
    );
  });
});
