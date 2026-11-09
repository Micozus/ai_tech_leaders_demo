import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AlertComponent } from '../../components/alert/alert.component';
import { ButtonComponent } from '../../components/button/button.component';
import { CardComponent } from '../../components/card/card.component';
import { FieldComponent } from '../../components/field/field.component';
import { TextFieldComponent } from '../../components/text-field/text-field.component';
import {
  FormSubmitState,
  focusFirstInvalid,
} from '../../helpers/form-submit.helper';
import type { SubmitOutcome } from '../../helpers/submit-outcome.helper';

export interface Credentials {
  readonly email: string;
  readonly password: string;
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCredentials(
  value: Credentials,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!value.email.trim()) errors['email'] = 'Enter your email.';
  else if (!EMAIL_SHAPE.test(value.email.trim()))
    errors['email'] = 'Enter an email like name@example.com.';
  if (!value.password) errors['password'] = 'Enter your password.';
  return errors;
}

/**
 * Sign in with GitHub, or with email and password (E01-S01, E01-S02). The email form follows the
 * form pattern: errors after leaving a field and on submit, focus on the first error, values kept,
 * one submit at a time, success only when the server confirms. A wrong password and an unknown
 * email give the same message (the server's `form` error).
 */
@Component({
  selector: 'ui-sign-in-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AlertComponent,
    ButtonComponent,
    CardComponent,
    FieldComponent,
    TextFieldComponent,
  ],
  template: `
    <ui-card heading="Sign in" density="roomy">
      @if (githubFailed()) {
        <div class="mb-groups">
          <ui-alert tone="danger" heading="GitHub sign-in did not complete">
            Try again, or sign in with email.
          </ui-alert>
        </div>
      }
      <button
        ui-button
        variant="quiet"
        type="button"
        [block]="true"
        (click)="githubSignIn.emit()"
      >
        <i class="pi pi-github" aria-hidden="true"></i>
        Sign in with GitHub
      </button>
      <p class="my-groups text-center text-meta text-muted">
        or use your email
      </p>
      <form class="grid gap-0" novalidate (submit)="submit($event)">
        @if (state.formError() || state.fieldErrors()['form']; as message) {
          <div class="mb-groups">
            <ui-alert tone="danger">{{ message }}</ui-alert>
          </div>
        }
        <ui-field label="Email" controlId="si-email" [error]="error('email')">
          <input
            ui-text-field
            id="si-email"
            type="email"
            autocomplete="email"
            [invalid]="!!error('email')"
            [value]="email()"
            (input)="email.set($any($event.target).value)"
            (blur)="touch('email')"
          />
        </ui-field>
        <ui-field
          label="Password"
          controlId="si-password"
          [error]="error('password')"
        >
          <input
            ui-text-field
            id="si-password"
            type="password"
            autocomplete="current-password"
            [invalid]="!!error('password')"
            [value]="password()"
            (input)="password.set($any($event.target).value)"
            (blur)="touch('password')"
          />
        </ui-field>
        <button
          ui-button
          type="submit"
          [block]="true"
          [loading]="state.status() === 'submitting'"
        >
          Sign in
        </button>
      </form>
    </ui-card>
  `,
})
export class SignInPanelComponent {
  /** Sends the credentials; the panel never talks to the network itself. */
  readonly submitter =
    input.required<(value: Credentials) => Promise<SubmitOutcome>>();
  readonly githubFailed = input(false);
  readonly githubSignIn = output<void>();
  readonly signedIn = output<void>();

  protected readonly email = signal('');
  protected readonly password = signal('');
  protected readonly state = new FormSubmitState();
  readonly #touched = signal<ReadonlySet<string>>(new Set());
  readonly #submitted = signal(false);
  readonly #host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #injector = inject(Injector);

  protected touch(name: string): void {
    this.#touched.update((set) => new Set(set).add(name));
  }

  protected error(name: string): string {
    const local =
      validateCredentials({ email: this.email(), password: this.password() })[
        name
      ] ?? '';
    const shown = this.#submitted() || this.#touched().has(name) ? local : '';
    return shown || this.state.fieldErrors()[name] || '';
  }

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.#submitted.set(true);
    const value = { email: this.email().trim(), password: this.password() };
    if (Object.keys(validateCredentials(value)).length > 0) {
      afterNextRender(() => focusFirstInvalid(this.#host.nativeElement), {
        injector: this.#injector,
      });
      return;
    }
    await this.state.submit(() => this.submitter()(value));
    if (this.state.status() === 'success') this.signedIn.emit();
    else
      afterNextRender(() => focusFirstInvalid(this.#host.nativeElement), {
        injector: this.#injector,
      });
  }
}
