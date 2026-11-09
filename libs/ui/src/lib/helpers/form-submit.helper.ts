import { signal } from '@angular/core';
import {
  OFFLINE_MESSAGE,
  SERVER_ERROR_MESSAGE,
  type SubmitOutcome,
} from './submit-outcome.helper';

export type FormStatus = 'idle' | 'submitting' | 'success' | 'failed';

/**
 * The state behind the form pattern: one submit at a time, field errors from the server kept next
 * to the values, success only after the server confirms, and a readable message for every failure.
 */
export class FormSubmitState {
  readonly status = signal<FormStatus>('idle');
  readonly fieldErrors = signal<Readonly<Record<string, string>>>({});
  readonly formError = signal('');

  async submit(run: () => Promise<SubmitOutcome>): Promise<void> {
    if (this.status() === 'submitting') return;
    this.status.set('submitting');
    this.formError.set('');
    this.fieldErrors.set({});
    const outcome = await run().catch((): SubmitOutcome => ({
      kind: 'offline',
    }));
    this.#apply(outcome);
  }

  #apply(outcome: SubmitOutcome): void {
    switch (outcome.kind) {
      case 'ok':
        this.status.set('success');
        return;
      case 'field-errors':
        this.fieldErrors.set(outcome.errors);
        break;
      case 'server-error':
        this.formError.set(SERVER_ERROR_MESSAGE);
        break;
      case 'offline':
        this.formError.set(OFFLINE_MESSAGE);
        break;
    }
    this.status.set('failed');
  }
}

/** Moves focus to the first control marked invalid inside `root`. Returns whether one was found. */
export function focusFirstInvalid(root: HTMLElement): boolean {
  const invalid = root.querySelector<HTMLElement>('[aria-invalid="true"]');
  invalid?.focus();
  return invalid !== null;
}
